// debugUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const debugUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Import User model
    const User = require('./models/Users');
    
    // Find the user
    const user = await User.findOne({ email: 'custom@example.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:');
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Is Active:', user.isActive);
    console.log('Password (hashed):', user.password);
    
    // Test password comparison
    const passwordToTest = 'CustomPass123';
    const isMatch = await bcrypt.compare(passwordToTest, user.password);
    console.log(`Password "${passwordToTest}" matches:`, isMatch);
    
    // Test the correctPassword method from your User model
    if (user.correctPassword) {
      const isCorrect = await user.correctPassword(passwordToTest, user.password);
      console.log('Using correctPassword method:', isCorrect);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
};

debugUser();