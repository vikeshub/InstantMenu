const express = require("express");
const router = express.Router();
const menuitemController = require("../controllers/menuitemController");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middleware/authMiddleware");
router.use(authenticateJWT, authorizeRole(["restaurant_owner"]));
// Create a new menu item
router.post("/:menuId", menuitemController.createMenuItem);

// Update or patch a menu item
router.patch("/:menuId/:itemId", menuitemController.updateMenuItem);

// Get all menu items for a menu
router.get("/menu/:menuId", menuitemController.getMenuItemsByMenu);

// Get a single menu item by id
router.get("/:id", menuitemController.getMenuItemById);

// Delete a menu item
router.delete("/:menuId/:itemId", menuitemController.deleteMenuItem);

// Toggle is_available for a menu item
router.patch('/:menuId/:itemId/toggle', menuitemController.toggleMenuItemAvailability);

// Delete an addon from a menu item by index
router.delete('/:menuId/:itemId/addons/:addonIndex', menuitemController.deleteAddonFromMenuItem);

// DEBUG: Test route to verify routing and middleware
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'Test route hit' });
});

module.exports = router;
