import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notification.js';

const router = express.Router();

router.post('/', createNotification);

router.get('/:userId', getUserNotifications);

router.post('/read/:id', markNotificationAsRead);

router.delete('/:id', deleteNotification);

export default router;
