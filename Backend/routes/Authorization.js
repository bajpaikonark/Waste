const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const admin = require('../config/firebaseAdmin');
const router = express.Router();

// Helper to generate token safely
function generateToken(userId) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
}

// ================== Signup with Phone Verification ==================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address, idToken } = req.body;

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('ID token verification error:', error);
      return res.status(401).json({ message: 'Invalid ID token' });
    }

// Get verified phone from Firebase
// Replace the phone number comparison logic with:
// const tokenPhoneDigits = decodedToken.phone_number.replace(/\D/g, '');
// const inputPhoneDigits = phone.replace(/\D/g, '');

// if (tokenPhoneDigits !== inputPhoneDigits) {
//   console.error('Phone number mismatch:', {
//     tokenPhone: decodedToken.phone_number,
//     inputPhone: phone,
//     tokenDigits: tokenPhoneDigits,
//     inputDigits: inputPhoneDigits
//   });
//   return res.status(400).json({ message: 'Phone number does not match verification' });
// }



    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'User already exists with this email' });
      } else {
        return res.status(400).json({ message: 'User already exists with this phone number' });
      }
    }

    // Create user with verified phone (store full E.164 format)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      isPhoneVerified: true
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message || 'Error creating user' });
  }
});

// ================== Password Login ==================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Error logging in' });
  }
});

// ================== OTP Login ==================
router.post('/login-otp', async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('ID token verification error:', error);
      return res.status(401).json({ message: 'Invalid ID token' });
    }

    const phoneNumber = decodedToken.phone_number; // full +91XXXXXXXXXX

    const user = await User.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account has been deactivated' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP Login error:', error);
    res.status(500).json({ message: error.message || 'Error logging in with OTP' });
  }
});

// ================== Profile ==================
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: error.message || 'Error fetching profile' });
  }
});

module.exports = router;
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/Users');
// const admin = require('../config/firebaseAdmin');
// const router = express.Router();

// // Helper to generate JWT token
// function generateToken(userId) {
//   const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
// }

// // Normalize phone number to E.164 format
// function normalizePhone(phone) {
//   let cleaned = phone.replace(/\D/g, '');
//   if (cleaned.length === 10) return `+91${cleaned}`;
//   if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
//   if (cleaned.startsWith('+')) return cleaned;
//   return `+${cleaned}`;
// }

// // ================== Signup with Phone Verification ==================
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, phone, address, idToken } = req.body;

//     if (!idToken) return res.status(400).json({ message: 'ID token required' });

//     // Verify Firebase ID token
//     let decodedToken;
//     try {
//       decodedToken = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//       console.error('ID token verification error:', error);
//       return res.status(401).json({ message: 'Invalid ID token' });
//     }

//     // Normalize phone numbers
//     const inputPhoneNormalized = normalizePhone(phone);
//     const tokenPhoneNormalized = normalizePhone(decodedToken.phone_number);

//     // Ensure phone number matches Firebase verification
//     if (inputPhoneNormalized !== tokenPhoneNormalized) {
//       console.error('Phone number mismatch:', {
//         tokenPhone: decodedToken.phone_number,
//         inputPhone: phone,
//         tokenNormalized: tokenPhoneNormalized,
//         inputNormalized: inputPhoneNormalized
//       });
//       return res.status(400).json({ message: 'Phone number does not match verification' });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ $or: [{ email }, { phone: inputPhoneNormalized }] });
//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: 'User already exists with this email' });
//       } else {
//         return res.status(400).json({ message: 'User already exists with this phone number' });
//       }
//     }

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone: inputPhoneNormalized,
//       address,
//       isPhoneVerified: true
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ message: messages.join(', ') });
//     }
//     res.status(500).json({ message: error.message || 'Error creating user' });
//   }
// });

// module.exports = router;
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/Users');
// const router = express.Router();

// // Helper to generate token safely
// function generateToken(userId) {
//   const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
// }

// // ================== Signup ==================
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, phone, address } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: 'User already exists with this email' });
//       } else {
//         return res.status(400).json({ message: 'User already exists with this phone number' });
//       }
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone,
//       address,
//       isPhoneVerified: false // No longer using phone verification
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ message: messages.join(', ') });
//     }
//     res.status(500).json({ message: error.message || 'Error creating user' });
//   }
// });

// // ================== Password Login ==================
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email }).select('+password');
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({ message: 'Account has been deactivated' });
//     }

//     // Update last login
//     user.lastLogin = Date.now();
//     await user.save();

//     const token = generateToken(user._id);

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: error.message || 'Error logging in' });
//   }
// });

// // ================== Profile ==================
// router.get('/profile', async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.json({ user });
//   } catch (error) {
//     console.error('Profile error:', error);
//     res.status(500).json({ message: error.message || 'Error fetching profile' });
//   }
// });

// module.exports = router;