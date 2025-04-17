import express from 'express'
import { isAuthenticated, isDeliveryPerson, isAdmin } from '../middlewares/auth.js';
import { changePassword, deleteAccount, verifyEmail, verifyPhone, updateProfile } from '../controllers/user.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change password for authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid request or password
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', isAuthenticated, changePassword);

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete a user's account
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete', isAuthenticated, deleteAccount);

/**
 * @swagger
 * /user/verify-email:
 *   get:
 *     summary: Verify user email
 *     description: Verify the email of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/verify-email', isAuthenticated, verifyEmail);

/**
 * @swagger
 * /user/verify-phone:
 *   get:
 *     summary: Verify user phone number
 *     description: Verify the phone number of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/verify-phone', isAuthenticated, verifyPhone);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile information of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request or image upload failed
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', isAuthenticated, updateProfile);

export default router;