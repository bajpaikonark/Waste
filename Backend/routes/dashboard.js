const express = require('express');
const { protect, authorize } = require('../middleware/Auths');
const Report = require('../models/Reports');
const User = require('../models/Users');
const router = express.Router();

// Get dashboard data based on user role
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      // Admin dashboard data
      const totalReports = await Report.countDocuments();
      const pendingReports = await Report.countDocuments({ status: 'pending' });
      const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
      const resolvedReports = await Report.countDocuments({ status: 'resolved' });
      
      // Get recent reports with user info
      const recentReports = await Report.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);
      
      // Get recent users
      const recentUsers = await User.find()
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

      // Format recent activity
      const recentActivity = recentReports.map(report => ({
        type: 'report_submitted',
        message: `New report submitted by ${report.user.name}`,
        timestamp: report.createdAt,
        reportId: report._id
      }));

      res.json({
        success: true,
        role: 'admin',
        stats: {
          totalReports,
          pendingReports,
          inProgressReports,
          resolvedReports,
          totalUsers: await User.countDocuments()
        },
        recentActivity,
        recentReports,
        recentUsers
      });
    } else {
      // User dashboard data
      const userReports = await Report.countDocuments({ user: userId });
      const userPendingReports = await Report.countDocuments({ 
        user: userId, 
        status: 'pending' 
      });
      const userInProgressReports = await Report.countDocuments({ 
        user: userId, 
        status: 'in-progress' 
      });
      const userResolvedReports = await Report.countDocuments({ 
        user: userId, 
        status: 'resolved' 
      });
      
 // Get user details with points
      const user = await User.findById(userId).select('points');
      // Get user's recent reports
      const recentReports = await Report.find({ user: userId })
  .sort({ createdAt: -1 })
  .limit(5)
  .lean(); // Add .lean() to get plain JavaScript objects

// Format recent activity
const recentActivity = recentReports.map(report => ({
  type: report.status === 'resolved' ? 'report_resolved' : 
        report.status === 'in-progress' ? 'report_in_progress' : 'report_submitted',
  message: report.status === 'resolved' ? 'Your report was resolved' :
            report.status === 'in-progress' ? 'Your report is in progress' :
            'You submitted a new report',
  timestamp: report.createdAt,
  reportId: report._id,
  points: report.status === 'resolved' ? 20 : 0,
  // Add the report data itself for easier access
  report: {
    _id: report._id,
    description: report.description,
    status: report.status,
    location: report.location,
    imageUrl: report.imageUrl,
    createdAt: report.createdAt
  }
}));

res.json({
  success: true,
  role: 'user',
  stats: {
    userReports,
    userPendingReports,
    userInProgressReports,
    userResolvedReports,
    userPoints: user.points || 0
  },
  recentActivity,
  recentReports // Include the raw reports as well
});
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard data' 
    });
  }
});

// Get admin-only statistics (more detailed)
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // Get reports by status
    const reportsByStatus = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get reports by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const reportsByMonth = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top reporters
    const topReporters = await Report.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.name': 1,
          'user.email': 1,
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      reportsByStatus,
      reportsByMonth,
      topReporters
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching admin statistics' 
    });
  }
});

module.exports = router;