import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.js"; // Adjust path if needed

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log(" uri ", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        phoneNumber: "0912345678",
        address: "Admin HQ",
      },
    ];

    await User.insertMany(users);
    process.exit();
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
