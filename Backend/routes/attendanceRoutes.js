// backend/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { checkIn, getTodayAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Member Check-in
router.post('/checkin', protect, authorize(['member']), checkIn);

// Admin/Trainer view (Requires authentication and specific roles)
router.get('/today', protect, authorize(['admin', 'trainer']), getTodayAttendance);

module.exports = router;