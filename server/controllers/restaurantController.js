const User = require('../models/user.model');
const Role = require('../models/role.model');

// Register a new restaurant_owner and restaurant
exports.registerRestaurant = async (req, res) => {
  try {
    const {
      owner_name,
      outlet_name,
      mobile_no,
      outlet_type,
      email,
      state,
      city,
      address,
      password,
      confirm_password,
      zip_code,
      country,
      logo_url
    } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Get restaurant_owner role
    const ownerRole = await Role.findOne({ name: 'restaurant_owner' });
    if (!ownerRole) {
      return res.status(500).json({ message: 'restaurant_owner role not found.' });
    }

    // Create user (restaurant_owner)
    const user = new User({
      name: owner_name,
      email,
      password,
      phone: mobile_no,
      role_id: ownerRole._id
    });
    await user.save();

    // Create restaurant
    const Restaurant = require('../models/restaurant.model');
    const restaurant = new Restaurant({
      owner_id: user._id,
      owner_name,
      outlet_name,
      outlet_type,
      address,
      city,
      state,
      zip_code,
      country,
      logo_url
    });
    await restaurant.save();

    res.status(201).json({
      message: 'Restaurant and owner registered successfully.',
      owner: { id: user._id, name: user.name, email: user.email },
      restaurant
    });
  } catch (error) {
    console.error('Register restaurant error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login for restaurant owner by email or phone and password
exports.loginRestaurant = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier }
      ]
    }).populate('role_id');

    if (!user || user.role_id.name !== 'restaurant_owner') {
      return res.status(404).json({ message: 'Restaurant owner not found.' });
    }

    const isMatch = await require('bcryptjs').compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const authConfig = require('../config/auth.config');
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role_id.name },
      authConfig.JWT_ACCESS_SECRET,
      { expiresIn: authConfig.ACCESS_TOKEN_EXPIRATION }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      authConfig.JWT_REFRESH_SECRET,
      { expiresIn: authConfig.REFRESH_TOKEN_EXPIRATION }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role_id.name
      }
    });
  } catch (error) {
    console.error('Restaurant login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get restaurant and owner info (protected route)
exports.getRestaurantInfo = async (req, res) => {
  try {
    const Restaurant = require('../models/restaurant.model');
    const User = require('../models/user.model');
    // Only allow access to the logged-in restaurant owner
    const userId = req.user.userId;
    // Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({ owner_id: userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this user.' });
    }
    // Find the user (owner)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ restaurant, user });
  } catch (error) {
    console.error('Get restaurant info error:', error);
    res.status(500).json({ message: 'Server error while fetching restaurant info.' });
  }
};

// Update restaurant and owner profile (protected route)
exports.updateRestaurantProfile = async (req, res) => {
  try {
    const Restaurant = require('../models/restaurant.model');
    const User = require('../models/user.model');
    const userId = req.user.userId;
    // Only allow update for the logged-in owner
    const restaurant = await Restaurant.findOne({ owner_id: userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found for this user.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Update allowed fields
    const {
      owner_name,
      outlet_name,
      mobile_no,
      outlet_type,
      email,
      state,
      city,
      address,
      zip_code,
      country,
      logo_url
    } = req.body;
    // Update user fields
    if (owner_name) user.name = owner_name;
    if (email) user.email = email;
    if (mobile_no) user.phone = mobile_no;
    await user.save();
    // Update restaurant fields
    if (owner_name) restaurant.owner_name = owner_name;
    if (outlet_name) restaurant.outlet_name = outlet_name;
    if (outlet_type) restaurant.outlet_type = outlet_type;
    if (address) restaurant.address = address;
    if (city) restaurant.city = city;
    if (state) restaurant.state = state;
    if (zip_code) restaurant.zip_code = zip_code;
    if (country) restaurant.country = country;
    if (logo_url) restaurant.logo_url = logo_url;
    await restaurant.save();
    res.json({ message: 'Profile updated successfully.', restaurant, user });
  } catch (error) {
    console.error('Update restaurant profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};