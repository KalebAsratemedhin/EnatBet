import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config();


export const changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });
  
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const deleteAccount = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.user.id);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const verifyEmail = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      user.isEmailVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const verifyPhone = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      user.isPhoneVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const updateProfile = async (req, res) => {
    try {
      const { name, phoneNumber, address } = req.body;
      const imageFile = req.files?.profilePicture;
  
      if (!imageFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Upload to Cloudinary using the file buffer
      const result = await cloudinary.uploader.upload(
        `data:${imageFile.mimetype};base64,${imageFile.data.toString('base64')}`,
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