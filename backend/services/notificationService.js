import Notification from '../models/notification.js';

export default class NotificationService {
  static async createNotification(io, userId, message, type = 'general') {
    const notification = await Notification.create({
      userId: userId,
      message,
      type
    });
    
    io.to(userId).emit("new-notification", notification);
    
  }

  static async getUserNotifications(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  static async markAsRead(notificationId) {
    return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }

  static async deleteNotification(notificationId) {
    return Notification.findByIdAndDelete(notificationId);
  }
}


