const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to DB
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-blog');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if admin exists
    const adminEmail = 'admin@techpixe.com';
    let userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log('Admin user exists. Deleting to recreate...');
      await User.deleteOne({ email: adminEmail });
    }

    console.log('Creating admin user...');
    await User.create({
      username: 'admin',
      email: adminEmail,
      password: 'password123',
      role: 'admin'
    });
    console.log('Admin user created/reset with password "password123"');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
