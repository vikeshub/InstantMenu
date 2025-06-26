const Menu = require('../models/menu.model');

// Create a new menu
exports.createMenu = async (req, res) => {
  try {
    const menu = new Menu({
      ...req.body,
      restaurant_id: req.body.restaurant_id,
    });
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all menus for a restaurant
exports.getMenusByRestaurant = async (req, res) => {
  try {
    const menus = await Menu.find({ restaurant_id: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single menu by ID
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a menu
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a menu
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle is_active for a menu
exports.toggleMenuActive = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    menu.is_active = !menu.is_active;
    menu.updated_at = Date.now();
    await menu.save();
    res.json({ message: 'Menu active status toggled', is_active: menu.is_active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
