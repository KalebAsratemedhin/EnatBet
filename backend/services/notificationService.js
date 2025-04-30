import Notification from '../models/notification.js';

export default class NotificationService {
  static async createNotification(io, userId, title, body, type = 'general') {
    const notification = await Notification.create({
      userId,
      title,
      body,
      type,
    });
 
    // Emit notification via socket
    io.to(userId.toString()).emit('new_notification', notification);

    return notification;
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


