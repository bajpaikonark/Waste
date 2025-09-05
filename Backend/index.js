// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');
// require('dotenv').config();

// const authRoutes = require('./routes/Authorization');
// const uploadRoutes = require('./routes/upload');
// const reportRoutes = require('./routes/reports');
// const profileRoutes = require('./routes/profile');
// const dashboardRoutes = require('./routes/dashboard');
// // Removed: otpRoutes import

// connectDB();
// const app = express();
// const PORT = process.env.PORT || 8000;

// app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
// app.use(express.json({ limit: '10mb' }));

// app.use('/api/auth', authRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// // In your Express server (index.js)
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; " +
//     "script-src 'self' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://www.google-analytics.com; " +
//     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//     "font-src 'self' https://fonts.gstatic.com; " +
//     "frame-src 'self' https://www.google.com; " +
//     "connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; " +
//     "img-src 'self' data: https://www.google.com https://www.google-analytics.com;"
//   );
//   next();
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // install if not already: npm install node-fetch
const connectDB = require('./config/database');
require('dotenv').config();

const authRoutes = require('./routes/Authorization');
const uploadRoutes = require('./routes/upload');
const reportRoutes = require('./routes/reports');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');

connectDB();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 🔹 New proxy route for Nominatim
app.get('/api/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your_email@example.com)' // OSM requires a User-Agent
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

// Content Security Policy (still optional for your case)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "frame-src 'self' https://www.google.com; " +
    "connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; " +
    "img-src 'self' data: https://www.google.com https://www.google-analytics.com;"
  );
  next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
