// backend/routes/planRoutes.js
const express = require('express');
const router = express.Router();
const { getPlans, getAllPlansAdmin, createPlan, updatePlan } = require('../controllers/planController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view available plans
router.get('/', getPlans); 

// Admin routes (Protected and restricted to 'admin')
router.route('/admin')
  .get(protect, authorize('admin'), getAllPlansAdmin) // View all plans
  .post(protect, authorize('admin'), createPlan);      // Create new plan

router.route('/:id')
  .put(protect, authorize('admin'), updatePlan);      // Update existing plan

module.exports = router;