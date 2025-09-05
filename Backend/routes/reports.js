const express = require('express');
const { protect, authorize } = require('../middleware/Auths');
const Report = require('../models/Reports');
const User = require('../models/Users');
const router = express.Router();

// Create a new waste report
router.post('/', protect, async (req, res) => {
  try {
    const { imageUrl, location, description, address } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'Valid location is required' });
    }

    // Create report
    const report = await Report.create({
      user: req.user.id,
      imageUrl,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || 10,
        address: address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
      },
      description: description || ''
    });

    // Award points to user
    const user = await User.findById(req.user.id);
    if (user) {
      user.points = (user.points || 0) + 20;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Waste report submitted successfully! You earned 20 points.',
      report: {
        id: report._id,
        imageUrl: report.imageUrl,
        location: report.location,
        description: report.description,
        pointsAwarded: report.pointsAwarded,
        createdAt: report.createdAt
      },
      userPoints: user?.points || 0
    });

  } catch (error) {
    console.error('Report creation error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ 
      message: error.message || 'Error creating waste report' 
    });
  }
});

// Get all reports for the authenticated user
router.get('/my-reports', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      reports,
      total: reports.length
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Get a single report by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns the report or is admin
    if (report.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this report' });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Get report error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    res.status(500).json({ message: 'Error fetching report' });
  }
});

// Update report status (admin only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      report
    });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Error updating report' });
  }
});
router.get('/admin/reports', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Update report status (admin only)
router.patch('/admin/reports/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes: notes },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      report
    });

  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Error updating report' });
  }
});

// Get stats for admin dashboard
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        inProgressReports,
        resolvedReports,
        recentReports
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;