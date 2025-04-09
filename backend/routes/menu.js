import express from "express";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import { createMenu } from "../controllers/menu.js";


const router = express.Router();




/**
 * @swagger
 * /menu/createMenu/{id}:
 *   post:
 *     summary: Create a new menu
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuName
 *             properties:
 *               menuName:
 *                 type: string
 *                 example: "Lunch Specials"
 *     responses:
 *       '201':
 *         description: Menu created successfully
 *       '404':
 *         description: Restaurant not found
 *       '500':
 *         description: Internal server error
 */


router.post('/createMenu/:id',isAuthenticated,isRestaurantOwner,createMenu);

export default router