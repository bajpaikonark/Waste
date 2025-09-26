// const jwt = require('jsonwebtoken');
// const User = require('../models/Users');

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({ message: 'Not authorized to access this route' });
//     }

//     try {
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
//       // Get user from the token
//       req.user = await User.findById(decoded.userId);
      
//       next();
//     } catch (error) {
//       console.error('Token verification error:', error);
//       return res.status(401).json({ message: 'Not authorized to access this route' });
//     }
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `User role ${req.user.role} is not authorized to access this route`
//       });
//     }
//     next();
//   };
// };

// module.exports = { protect, authorize };

const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const protect = async (req, res, next) => {
  let token;

  try {
    // 1️⃣ Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }

    // 3️⃣ Get user from token payload
    // Make sure the key matches what you used when signing the token
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next(); // ✅ All good, continue to next middleware
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error in authentication' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user missing' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
