// backend/models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
  },
  // In a real system, gymId or scannerId would confirm the location
  scannerId: { 
    type: String,
    default: 'MAIN_ENTRANCE',
  },
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;