// backend/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper function to check membership validity
const isMembershipActive = (membership) => {
    if (!membership || membership.status !== 'active') {
        return false;
    }
    const today = new Date();
    // Check if today is before or on the endDate
    return membership.endDate && membership.endDate >= today;
};

// @desc    Member checks in (QR Scan simulation)
// @route   POST /api/attendance/checkin
// @access  Private (Requires JWT from the scanning member's app)
const checkIn = async (req, res) => {
    const memberId = req.user._id;
    const { scannerId } = req.body; // Sent from the scanning location/device

    const user = await User.findById(memberId);

    if (!user || user.role !== 'member') {
        return res.status(404).json({ message: 'User not found or not a member.' });
    }

    // 1. Membership Validation
    if (!isMembershipActive(user.membership)) {
        return res.status(403).json({ 
            message: 'Membership Expired or Inactive. Please renew your plan.',
            redirect: '/purchase-plan'
        });
    }

    // 2. Daily Limit Check (Preventing duplicate check-ins on the same day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const alreadyCheckedIn = await Attendance.findOne({
        member: memberId,
        checkInTime: { $gte: startOfDay },
    });

    if (alreadyCheckedIn) {
        return res.status(400).json({ message: 'You have already checked in today.' });
    }

    // 3. Log Attendance
    const attendance = await Attendance.create({
        member: memberId,
        scannerId: scannerId || 'MAIN_ENTRANCE',
    });

    res.json({ 
        message: `Welcome, ${user.name}! Check-in successful at ${attendance.checkInTime.toLocaleTimeString()}.`,
        checkInId: attendance._id 
    });
};

// @desc    Admin/Trainer views today's attendance
// @route   GET /api/attendance/today
// @access  Private/Admin/Trainer
const getTodayAttendance = async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceList = await Attendance.find({
        checkInTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('member', 'name email membership'); // Populate member details

    res.json(attendanceList);
};


module.exports = { checkIn, getTodayAttendance };