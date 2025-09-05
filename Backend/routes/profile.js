const express = require('express');
const { protect } = require('../middleware/Auths');
const User = require('../models/Users');
const Report = require('../models/Reports');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const reports = await Report.find({ user: req.user.id });

    const stats = {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      resolvedReports: reports.filter(r => r.status === 'resolved').length,
      totalPoints: user.points || 0,
      joinDate: user.joinedAt || user.createdAt,
    };

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
