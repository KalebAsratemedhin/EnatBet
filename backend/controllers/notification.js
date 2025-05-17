import Notification from "../models/notification.js";

import mongoose from "mongoose";
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsSeen = async (req, res) => {
  const { id } = req.params;  

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: req.user.id },
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create and emit a new notification (for backend/internal use)
export const createNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  
  try {
    const notification = new Notification({ userId, message, type });
    await notification.save();

    // Emit to socket.io
    const io = req.app.get("io");
    io.to(userId.toString()).emit("new-notification", notification);

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};
