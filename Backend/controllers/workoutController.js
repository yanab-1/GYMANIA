// backend/controllers/workoutController.js
const mongoose = require('mongoose'); // <-- NEW: Required for aggregation pipeline
const WorkoutLog = require('../models/WorkoutLog');
const Exercise = require('../models/Exercise');

// --- Exercise Catalog Management (Admin/Trainer) ---

// @desc    Get all available exercises
// @route   GET /api/workouts/exercises
// @access  Private (Used by Member/Trainer)
const getExercises = async (req, res) => {
  const exercises = await Exercise.find({});
  res.json(exercises);
};

// @desc    Create a new exercise (Admin/Trainer setup)
// @route   POST /api/workouts/exercises
// @access  Private/Admin/Trainer
const createExercise = async (req, res) => {
  const { name, category, description } = req.body;

  const exerciseExists = await Exercise.findOne({ name });
  if (exerciseExists) {
    return res.status(400).json({ message: 'Exercise already exists' });
  }

  const exercise = await Exercise.create({ name, category, description });
  res.status(201).json(exercise);
};


// --- Member Workout Logging ---

// @desc    Log a new workout session
// @route   POST /api/workouts/log
// @access  Private/Member
const createWorkoutLog = async (req, res) => {
  const { durationMinutes, exercises, notes } = req.body;
  const memberId = req.user._id;

  if (!exercises || exercises.length === 0) {
    return res.status(400).json({ message: 'A workout must contain at least one exercise.' });
  }

  const newLog = await WorkoutLog.create({
    member: memberId,
    durationMinutes,
    exercises,
    notes,
  });

  res.status(201).json({ 
      message: 'Workout logged successfully!', 
      logId: newLog._id, 
      date: newLog.date 
  });
};

// @desc    Get a member's full workout history
// @route   GET /api/workouts/log/history
// @access  Private/Member or Private/Trainer (if viewing client)
const getMemberWorkoutHistory = async (req, res) => {
  const memberId = req.user.role === 'member' ? req.user._id : req.query.memberId;

  if (!memberId) {
      return res.status(400).json({ message: 'Member ID required for history lookup.' });
  }

  // Fetch logs, sorting by date descending
  const history = await WorkoutLog.find({ member: memberId })
    .sort({ date: -1 })
    .limit(20); 

  res.json(history);
};

// --- Progress Tracking (Visual Analytics) ---

// @desc    Get aggregated strength progress for a specific exercise
// @route   GET /api/workouts/progress/:exerciseId
// @access  Private/Member or Private/Trainer (if viewing client)
const getStrengthProgress = async (req, res) => {
    const { exerciseId } = req.params;
    const memberId = req.user.role === 'member' ? req.user._id : req.query.memberId; // Allow trainer to query client data

    if (!memberId) {
        return res.status(400).json({ message: 'Member ID required for progress tracking.' });
    }
    
    // 1. Find the exercise name for the chart title
    const exercise = await Exercise.findById(exerciseId).select('name');
    if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found.' });
    }

    // 2. Aggregate Data using MongoDB's aggregation pipeline
    const progressData = await WorkoutLog.aggregate([
        // Filter logs by member and containing the specified exercise
        { $match: { member: req.user._id, 'exercises.exerciseId': new mongoose.Types.ObjectId(exerciseId) } },
        
        // Unwind the exercises array to process them one by one
        { $unwind: '$exercises' },
        
        // Match the specific exercise again after unwinding
        { $match: { 'exercises.exerciseId': new mongoose.Types.ObjectId(exerciseId) } },
        
        // Project the relevant fields (date, and the max weight lifted across all sets for that exercise)
        { $project: {
            date: '$date',
            // Calculate the max weight lifted for all sets in this logged instance
            maxWeight: { $max: '$exercises.sets.weight' }
        }},
        
        // Group by date to ensure only one data point per day (optional, but cleans up data)
        { $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            date: { $first: '$date' },
            maxWeight: { $max: '$maxWeight' } // Get the true max if logged multiple times that day
        }},
        
        // Sort chronologically
        { $sort: { date: 1 } }
    ]);

    // 3. Format the result for the chart
    const formattedData = progressData.map(item => ({
        date: item._id, // Date string
        maxWeight: item.maxWeight // Numeric value
    }));

    res.json({
        exerciseName: exercise.name,
        data: formattedData
    });
};


module.exports = { 
    getExercises, 
    createExercise, 
    createWorkoutLog, 
    getMemberWorkoutHistory,
    getStrengthProgress // <-- NEW Export
};