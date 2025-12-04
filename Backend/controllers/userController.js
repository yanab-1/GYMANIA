// backend/controllers/userController.js
const User = require('../models/User');
const Plan = require('../models/Plan'); 

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires JWT)
const getUserProfile = (req, res) => {
  // req.user is set by the 'protect' middleware
  if (req.user) {
    // We only return safe, necessary profile data
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      membership: req.user.membership,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Member: Purchase/Renew membership (Simulated payment callback)
// @route   POST /api/users/membership/purchase
// @access  Private/Member
const purchaseMembership = async (req, res) => {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = await Plan.findById(planId);
    const user = await User.findById(userId);

    if (!plan || !user) {
        return res.status(404).json({ message: 'Plan or User not found.' });
    }

    // --- Core Membership Logic ---
    
    const today = new Date();
    let startDate = today;

    // Check if the current membership is still valid
    if (user.membership.status === 'active' && user.membership.endDate > today) {
        // Membership is still active, new plan starts after the current one expires
        startDate = new Date(user.membership.endDate);
    }

    // Calculate End Date: add durationDays to the determined start date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Update User's Membership Field
    user.membership = {
        planId: plan._id,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
    };

    await user.save();
    
    res.json({ 
        message: `Membership purchased successfully! Plan: ${plan.name}. Active until: ${endDate.toLocaleDateString()}`,
        membership: user.membership
    });
};

// @desc    Trainer/Admin: Get list of all members (clients)
// @route   GET /api/users/members
// @access  Private/Trainer/Admin
const getGymMembers = async (req, res) => {
    // Only return users who are 'member'
    const members = await User.find({ role: 'member' }).select('-password -__v');
    res.json(members);
};

// @desc    Admin: Update user role (Promote/Demote staff)
// @route   PUT /api/users/staff/:id
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['member', 'trainer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // Prevent Admin from demoting themselves
    if (req.user._id.toString() === userId && role !== 'admin') {
         return res.status(403).json({ message: 'Cannot demote yourself.' });
    }

    const user = await User.findById(userId);

    if (user) {
        user.role = role || user.role;
        
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            role: updatedUser.role,
            message: `User role updated to ${updatedUser.role}.`
        });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};

module.exports = { getUserProfile, purchaseMembership, getGymMembers, updateUserRole };