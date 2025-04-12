import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // Adjust path if needed

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: ['admin'],
        phoneNumber: '0912345678',
        address: 'Admin HQ'
      },
      {
        name: 'Test User One',
        email: 'user1@example.com',
        password: hashedPassword,
        role: ['customer'],
        phoneNumber: '0923456789',
        address: 'User Street 1'
      },
      {
        name: 'Test User Two',
        email: 'user2@example.com',
        password: hashedPassword,
        role: ['restaurant_owner'],
        phoneNumber: '0934567890',
        address: 'Restaurant Road 2'
      },
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
