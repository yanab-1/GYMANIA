// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Included for safety, though not strictly needed for these functions

// Middleware to check for a valid JWT and attach user data
const protect = async (req, res, next) => {
  let token;

  // Check for 'Bearer' token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach it to the request object
      // Exclude the password for security
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user has one of the required roles
const authorize = (roles = []) => {
  // Ensure roles is always an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Check if req.user exists (it should, as 'protect' runs before 'authorize')
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user data missing.' });
    }
    
    // If roles list is provided and the user's role is not included, deny access
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route.`,
      });
    }
    next();
  };
};

// Ensure both functions are exported
module.exports = { protect, authorize }; // <-- FIX IS HERE: Authorize must be defined above this line