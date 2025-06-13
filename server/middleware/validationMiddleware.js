const { body, validationResult } = require('express-validator'); 

// Validation for user registration
exports.validateRegistration = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email format.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    next();
  },
];

// Validation for user login
exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email format.'),
  body('password').notEmpty().withMessage('Password is required.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for updating user profile
exports.validateUserProfileUpdate = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for updating password
exports.validatePasswordUpdate = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];