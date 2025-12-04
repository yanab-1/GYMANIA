// backend/routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getExercises, 
    createExercise, 
    createWorkoutLog, 
    getMemberWorkoutHistory,
    getStrengthProgress // <-- NEW Import
} = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Exercise Catalog (Setup by Admin/Trainer, used by all)
router.route('/exercises')
  .get(protect, getExercises)
  .post(protect, authorize(['admin', 'trainer']), createExercise);

// Member Logging
router.route('/log')
  .post(protect, authorize(['member']), createWorkoutLog);

// Member History (Member or Trainer viewing client)
router.route('/log/history')
    .get(protect, getMemberWorkoutHistory);

// Progress Tracking Endpoint
router.route('/progress/:exerciseId') // <-- NEW Route
    .get(protect, getStrengthProgress); 

module.exports = router;