const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};
// Create or update admin user
const createAdminUser = async (email, password, name, phone) => {
  try {
    const User = require('./models/Users');
    
    let adminUser = await User.findOne({ email });
    
    if (adminUser) {
      console.log(`Admin user ${email} already exists. Updating details...`);
      adminUser.password = password; // plain text, pre-save hook will hash
      adminUser.role = 'admin';
      adminUser.isActive = true;
      if (name) adminUser.name = name;
      if (phone) adminUser.phone = phone;

      await adminUser.save();
      console.log(`Admin user ${email} updated successfully`);
    } else {
      adminUser = new User({
        name: name || 'EcoWaste Administrator',
        email,
        password, // plain text, pre-save hook will hash
        role: 'admin',
        isActive: true,
        phone: phone || '1234567890'
      });

      await adminUser.save();
      console.log(`Admin user ${email} created successfully`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('Please change this password after first login!');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const runScript = async () => {
  const conn = await connectDB();
  
  if (process.argv.length > 3) {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'EcoWaste Administrator';
    const phone = process.argv[5] || '1234567890';
    
    await createAdminUser(email, password, name, phone);
  } else {
    await createAdminUser(
      'admin@ecowaste.com', 
      'Admin123!', 
      'EcoWaste Administrator',
      '1234567890'
    );
  }
  
  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
};

runScript();
