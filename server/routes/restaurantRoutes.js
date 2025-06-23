const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Register a new restaurant_owner and restaurant
router.post('/register', restaurantController.registerRestaurant);

// Restaurant owner login
router.post('/login', restaurantController.loginRestaurant);

// Get restaurant and owner info (protected)
router.get('/profile', authenticateJWT, authorizeRole(['restaurant_owner']), restaurantController.getRestaurantInfo);

// Update restaurant and owner profile (protected)
router.put('/profile', authenticateJWT, authorizeRole(['restaurant_owner']), restaurantController.updateRestaurantProfile);

// You can add more restaurant routes here (CRUD, etc.)

module.exports = router;
