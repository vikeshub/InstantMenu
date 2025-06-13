const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware'); 
const {
  validateRegistration,
  validateLogin,
  validateUserProfileUpdate,
  validatePasswordUpdate,
} = require('../middleware/validationMiddleware'); 

// Public routes
router.post('/register', validateRegistration, authController.registerUser); 
router.post('/login', validateLogin, authController.loginUser); 
router.post('/refresh-token', authController.refreshToken); // For refreshing access token 
router.post('/logout', authController.logoutUser);

// Protected routes (require authentication)
router.get('/profile', authenticateJWT, authController.getUserProfile);
router.put('/profile', authenticateJWT, validateUserProfileUpdate, authController.updateUserProfile);
router.put('/update-password', authenticateJWT, validatePasswordUpdate, authController.updatePassword);
router.post('/register-by-role', authenticateJWT, authController.registerByRole);

// Admin-only routes
router.get('/admin/users', authenticateJWT, authorizeRole(['admin']), authController.getAllUsers);
router.delete('/admin/users/:id', authenticateJWT, authorizeRole(['admin']), authController.deleteUser);
router.get('/roles', authController.getAllRoles);

module.exports = router;