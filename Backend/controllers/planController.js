// backend/controllers/planController.js
const Plan = require('../models/Plan');

// @desc    Get all membership plans (Publicly visible to members/public)
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  const plans = await Plan.find({ isAvailable: true }).sort({ price: 1 });
  res.json(plans);
};

// @desc    Admin: Get all plans (including unavailable ones)
// @route   GET /api/plans/admin
// @access  Private/Admin
const getAllPlansAdmin = async (req, res) => {
    const plans = await Plan.find({});
    res.json(plans);
};

// @desc    Admin: Create a new plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  const { name, price, durationDays, description } = req.body;

  if (!name || !price || !durationDays || !description) {
    return res.status(400).json({ message: 'Please include all plan details.' });
  }

  const plan = new Plan({ name, price, durationDays, description });
  const createdPlan = await plan.save();
  res.status(201).json(createdPlan);
};

// @desc    Admin: Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);

  if (plan) {
    plan.name = req.body.name || plan.name;
    plan.price = req.body.price || plan.price;
    plan.durationDays = req.body.durationDays || plan.durationDays;
    plan.description = req.body.description || plan.description;
    plan.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : plan.isAvailable;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
};

module.exports = { getPlans, getAllPlansAdmin, createPlan, updatePlan };