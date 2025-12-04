// backend/routes/userRoutes.js
const express = require('express');
const { 
    getUserProfile, 
    purchaseMembership,
    getGymMembers, // <-- ADDED
    updateUserRole  // <-- ADDED
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Route: accessible by any authenticated user
router.get('/profile', protect, getUserProfile);
router.post('/membership/purchase', protect, purchaseMembership);

// Trainer/Admin Route: List all members (clients)
router.get('/members', protect, authorize(['trainer', 'admin']), getGymMembers); // <-- ADDED

// Admin Route: Update user role (Staff Management)
router.route('/staff/:id')
    .put(protect, authorize('admin'), updateUserRole); // <-- ADDED

// Example Admin Route
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.name}!` });
});

module.exports = router;