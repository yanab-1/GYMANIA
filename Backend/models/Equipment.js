// backend/models/Equipment.js
const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  identifier: {
    type: String, // e.g., 'Treadmill-03', 'Bench-Press-01'
    required: true,
    unique: true,
  },
  location: {
    type: String, // e.g., 'Cardio Area', 'Main Floor'
  },
  status: {
    type: String,
    enum: ['Operational', 'Needs Repair', 'Out of Service'],
    default: 'Operational',
  },
  lastMaintenanceDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);
module.exports = Equipment;