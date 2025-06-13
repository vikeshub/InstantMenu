const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Register a new restaurant_owner and restaurant
router.post('/register', restaurantController.registerRestaurant);

// Restaurant owner login
router.post('/login', restaurantController.loginRestaurant);

// You can add more restaurant routes here (CRUD, etc.)

module.exports = router;
