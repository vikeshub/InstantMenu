const jwt = require('jsonwebtoken'); 
const authConfig = require('../config/auth.config');
const db = require('../models');
const User = db.User;
const Role = db.Role;

// Middleware to authenticate JWT
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Expects "Bearer TOKEN" 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token format invalid.' });
  }

  jwt.verify(token, authConfig.JWT_ACCESS_SECRET, (err, decoded) => { 
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' }); 
    }
    req.user = decoded; // Attach decoded payload (userId, role) to request 
    next();
  });
};

// Middleware for Role-Based Access Control (RBAC) 
exports.authorizeRole = (allowedRoles) => { 
  return async (req, res, next) => {
    if (!req.user ||!req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    try {
      const user = await User.findById(req.user.userId).populate('role_id');

      if (!user ||!user.role_id) {
        return res.status(403).json({ message: 'Forbidden: User role not found.' });
      }

      const userRoleName = user.role_id.name;
      if (!allowedRoles.includes(userRoleName)) { 
        return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions.' }); 
      }
      // Update req.user with the actual role name from DB for consistency
      req.user.role = userRoleName;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Server error during authorization.' });
    }
  };
};