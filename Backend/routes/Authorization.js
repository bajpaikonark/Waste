// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/Users');
// const admin = require('../config/firebaseAdmin');
// const router = express.Router();

// // Helper to generate token safely
// function generateToken(userId) {
//   const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
// }

// // ================== Signup with Phone Verification ==================
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, phone, address, idToken } = req.body;

//     // Verify Firebase ID token
//     let decodedToken;
//     try {
//       decodedToken = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//       console.error('ID token verification error:', error);
//       return res.status(401).json({ message: 'Invalid ID token' });
//     }

// // Get verified phone from Firebase
// // Replace the phone number comparison logic with:
// // const tokenPhoneDigits = decodedToken.phone_number.replace(/\D/g, '');
// // const inputPhoneDigits = phone.replace(/\D/g, '');

// // if (tokenPhoneDigits !== inputPhoneDigits) {
// //   console.error('Phone number mismatch:', {
// //     tokenPhone: decodedToken.phone_number,
// //     inputPhone: phone,
// //     tokenDigits: tokenPhoneDigits,
// //     inputDigits: inputPhoneDigits
// //   });
// //   return res.status(400).json({ message: 'Phone number does not match verification' });
// // }



//     // Check if user exists
//     const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: 'User already exists with this email' });
//       } else {
//         return res.status(400).json({ message: 'User already exists with this phone number' });
//       }
//     }

//     // Create user with verified phone (store full E.164 format)
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone,
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

// // ================== OTP Login ==================
// router.post('/login-otp', async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     // Verify Firebase ID token
//     let decodedToken;
//     try {
//       decodedToken = await admin.auth().verifyIdToken(idToken);
//     } catch (error) {
//       console.error('ID token verification error:', error);
//       return res.status(401).json({ message: 'Invalid ID token' });
//     }

//     const phoneNumber = decodedToken.phone_number; // full +91XXXXXXXXXX

//     const user = await User.findOne({ phone: phoneNumber });
//     if (!user) {
//       return res.status(404).json({ message: 'No account found with this phone number' });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({ message: 'Account has been deactivated' });
//     }

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
//     console.error('OTP Login error:', error);
//     res.status(500).json({ message: error.message || 'Error logging in with OTP' });
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
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { admin, auth: firebaseAuth } = require("../config/firebaseAdmin");
const User = require("../models/Users");

const router = express.Router();

// Normalize Indian phone numbers
function normalizePhone(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return "+91" + cleaned;
  if (cleaned.length === 12 && cleaned.startsWith("91")) return "+" + cleaned;
  if (phone.startsWith("+")) return phone;
  return "+" + cleaned;
}

// 🔹 Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, address, idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Missing OTP verification token" });
    }

    // Verify Firebase OTP token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const tokenPhone = normalizePhone(decoded.phone_number);
    const inputPhone = normalizePhone(phone);

    if (tokenPhone !== inputPhone) {
      return res.status(400).json({ message: "Phone number mismatch" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone: inputPhone,
      address,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// 🔹 Login with password
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// });

// 🔹 Login with password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password because it's set to select: false in schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Remove password before sending user data
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


// 🔹 Login with OTP (Firebase idToken)
router.post("/login-otp", async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);

    const phone = normalizePhone(decoded.phone_number);
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "OTP login failed", error: err.message });
  }
});

// 🔹 Profile route (auth middleware required)
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});

module.exports = router;
