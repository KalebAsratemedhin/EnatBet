import express from 'express';
import { createTest, getAllTests } from '../controllers/testController.js';

const router = express.Router();

/**
 * @swagger
 * /api/test/:
 *   post:
 *     summary: Create a test document
 *     description: Adds a new test document to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               age:
 *                 type: number
 *                 example: 25
 *     responses:
 *       201:
 *         description: Document created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', createTest);

/**
 * @swagger
 * /api/test/all:
 *   get:
 *     summary: Get all test documents
 *     description: Retrieves all test documents from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved all documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoDB ObjectId
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   age:
 *                     type: number
 *                     example: 25
 *       500:
 *         description: Internal server error
 */
router.get('/all', getAllTests);

export default router;
