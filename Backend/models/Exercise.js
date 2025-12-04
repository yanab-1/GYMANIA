// backend/models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'],
    required: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise;