// backend/models/Plan.js
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  durationDays: { // Store duration in days for easier calculation
    type: Number,
    required: true,
    min: 1, 
  },
  description: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;