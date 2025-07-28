const MenuItem = require('../models/menuitem.model');

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menuItem = new MenuItem({ ...req.body, menu_id: menuId });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all menu items for a menu
exports.getMenuItemsByMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const items = await MenuItem.find({ menu_id: menuId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single menu item by id
exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { menuId, itemId } = req.params;
    // Only update if the menu_id matches
    const item = await MenuItem.findOneAndUpdate(
      { _id: itemId, menu_id: menuId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { menuId, itemId } = req.params;
    const item = await MenuItem.findOneAndDelete({ _id: itemId, menu_id: menuId });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle is_available for a menu item
exports.toggleMenuItemAvailability = async (req, res) => {
  try {
    const { menuId, itemId } = req.params;
    const item = await MenuItem.findOne({ _id: itemId, menu_id: menuId });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    item.is_available = !item.is_available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an addon from a menu item by addon index
exports.deleteAddonFromMenuItem = async (req, res) => { 
  try {
    const { menuId, itemId, addonIndex } = req.params;
    // Ensure addonIndex is a number
    const idx = parseInt(addonIndex, 10);
    if (isNaN(idx)) {
      return res.status(400).json({ error: 'Invalid addon index' });
    }
    const item = await MenuItem.findOne({ _id: itemId, menu_id: menuId });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    if (!Array.isArray(item.addons) || idx < 0 || idx >= item.addons.length) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    item.addons.splice(idx, 1);
    await item.save();
    res.json({ message: 'Addon deleted', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
