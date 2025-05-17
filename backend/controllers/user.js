import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import "dotenv/config";
import emailService from "../services/emailService.js";
import crypto from "crypto";

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// 1. SEND OTP TO EMAIL
export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save hashed OTP to DB with expiry (5 minutes)
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    user.emailVerificationOTP = otpHash;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    // Send the plain OTP via email
    await emailService.sendVerificationEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. VERIFY OTP FROM EMAIL
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;


  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user.emailVerificationOTP || !user.otpExpires) {
      return res.status(400).json({ message: "No OTP found, please request a new one." });
    }

    // Check if OTP is expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Hash the provided OTP and compare
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (otpHash !== user.emailVerificationOTP) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.isPhoneVerified = true;
    await user.save();

    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;
    const imageFile = req.file?.path;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.profileImage = imageFile || null;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();

    const users = await User.find().skip(skip).limit(limit).select("-password");

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    await User.findByIdAndUpdate(id, { isActive });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch role requests", error });
  }
};
