import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import "dotenv/config";
import emailService from "../services/emailService.js";
import jwt from "jsonwebtoken";

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

export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `${process.env.SERVER_URL}/user/verify-email?token=${verificationToken}`;

    await emailService.sendVerificationEmail(user.email, verificationLink);

    res.status(200).json({ message: "Check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Verification link expired. Please request a new one.",
      });
    }
    res.status(400).json({ message: "Invalid verification link" });
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
    const imageFile = req.files?.profilePicture;

    if (!imageFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${imageFile.mimetype};base64,${imageFile.data.toString("base64")}`,
      {
        folder: "user_profiles",
        resource_type: "auto",
      }
    );

    const profilePictureUrl = result.secure_url;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.profileImage = profilePictureUrl;

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

    console.log("users ", {
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

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
