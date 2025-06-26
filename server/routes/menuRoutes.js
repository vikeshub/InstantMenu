const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Only restaurant owners can access these routes
router.use(authenticateJWT, authorizeRole(['restaurant_owner']));

// Create a new menu
router.post('/', menuController.createMenu);

// Get all menus for a restaurant
router.get('/restaurant/:restaurantId', menuController.getMenusByRestaurant);

// Get a single menu by ID
router.get('/:id', menuController.getMenuById);

// Update a menu
router.put('/:id', menuController.updateMenu);

// Delete a menu
router.delete('/:id', menuController.deleteMenu);

// Toggle is_active for a menu
router.patch('/:id/toggle-active', menuController.toggleMenuActive);

module.exports = router;
