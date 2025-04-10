import express from 'express'
import { signup, signin,logout, updateRoleRequest ,
       createRoleRequest, cancelRoleRequest, 
       getAllRoleRequests,
       getMyRoleRequests,
       getCurrentUser} from '../controllers/auth.js';
import { isAuthenticated, isDeliveryPerson, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phoneNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 trim: true
 *                 maxLength: 50
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "Password123!"
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^(?:(?:\+251|251|0)?9\d{8}|(?:\+251|251|0)?1[1-9]\d{6})$'
 *                 example: "+251912345678"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Addis Ababa"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: ObjectId
 *                   example: "65d5fcb5e4b0af2d8c7f8f8f"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 role:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["customer"]
 *                 phoneNumber:
 *                   type: string
 *                   example: "+251912345678"
 *                 address:
 *                   type: string
 *                   example: "123 Main St, Addis Ababa"
 *                 isEmailVerified:
 *                   type: boolean
 *                   example: false
 *                 isPhoneVerified:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Phone number must be a valid Ethiopian number"
 *       500:
 *         description: Internal server error
 */
router.post('/signup',signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate user and get access token
 *     description: |
 *       Returns a JWT token for valid credentials.
 *       Email must be verified for successful login.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "65d5fcb5e4b0af2d8c7f8f8f"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     role:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["customer"]
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - "Invalid credentials"
 *                     - "Email not verified"
 *                   example: "Email not verified"
 *       429:
 *         description: Too many attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Too many login attempts. Try again in 15 minutes"
 *       500:
 *         description: Internal server error
 */
router.post('/signin',signin);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (invalidates token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - "Authentication failed: No token provided"
 *                     - "Authentication failed: Token invalidated"
 *                     - "Authentication failed: Invalid token"
 *                     - "Authentication failed: JWT expired"
 *       500:
 *         description: Server error
 */
router.post('/logout', isAuthenticated, logout)


/**
 * @swagger
 * /auth/current-user:
 *   get:
 *     summary: Get current user
 *     description: Retrieves the currently authenticated user's information.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "660b2d3483c6b5b3d95e6b5d"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 role:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [admin, customer, restaurant_owner, delivery_person]
 *                   example: ["customer"]
 *                 phoneNumber:
 *                   type: string
 *                   example: "+251911223344"
 *                 address:
 *                   type: string
 *                   example: "Addis Ababa"
 *                 isEmailVerified:
 *                   type: boolean
 *                   example: false
 *                 isPhoneVerified:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-01T10:00:00.000Z"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */


router.get('/current-user', isAuthenticated, getCurrentUser);


/**
 * @swagger
 * /auth/role-request:
 *   post:
 *     summary: Submit a role upgrade request
 *     tags: [Role Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestedRole:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [restaurant_owner, delivery_person, customer]
 *                 example: ["restaurant_owner"]
 *               remark:
 *                 type: string
 *                 maxLength: 500
 *             required:
 *               - requestedRole
 *     responses:
 *       201:
 *         description: Request submitted
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.post('/role-request',isAuthenticated, createRoleRequest);

/**
 * @swagger
 * /auth/role-request/cancelled/{requestId}:
 *   post:
 *     summary: Cancel user's pending role request
 *     description: Cancels the authenticated user's most recent pending role request
 *     tags: [Role Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the role request to cancel
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Role request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Role request cancelled"
 *                 status:
 *                   type: string
 *                   enum: [cancelled]
 *                   example: "cancelled"
 *       400:
 *         description: No pending request found or invalid operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No pending request to cancel"
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */
router.put('/role-request/cancelled/:requestId', isAuthenticated, cancelRoleRequest);

/**
 * @swagger
 * /auth/role-request:
 *   put:
 *     summary: Update role request status (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               status:
 *                 type: string
 *                 enum: [approved, disapproved]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Request not found
 */
router.put('/role-request/:requestId',isAuthenticated, isAdmin,updateRoleRequest)

/**
 * @swagger
 * /auth/role-request/mine:
 *   get:
 *     summary: Get current user's role requests
 *     description: Retrieves all role requests submitted by the authenticated user.
 *     tags: [Role Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected, cancelled]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized (missing/invalid token)
*/
router.get('/role-request/mine', isAuthenticated, getMyRoleRequests);

/**
 * @swagger
 * /auth/role-request/all:
 *   get:
 *     summary: Get all role requests
 *     description: Retrieves all role requests submitted by users (admin access required).
 *     tags: [Role Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All role requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected, cancelled]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Forbidden – Only accessible by admins
 */
router.get('/role-request/all', isAuthenticated, isAdmin, getAllRoleRequests);

export default router;