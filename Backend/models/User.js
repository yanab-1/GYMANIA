// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'trainer', 'admin'],
    default: 'member',
  },
  // Membership tracking details
  membership: {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'expired', 'frozen', 'pending'],
      default: 'pending',
    },
  },
}, {
  timestamps: true,
});

// CORRECTED Middleware to hash password before saving (pre-save hook)
// Using modern Mongoose async syntax.
UserSchema.pre('save', async function () { 
  if (!this.isModified('password')) {
    return; // Exit if password wasn't modified
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// FIX: Corrected the mongoose.model definition.
const User = mongoose.model('User', UserSchema); 

module.exports = User;