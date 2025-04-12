import express from "express";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import { createMenu, getMenu } from "../controllers/menu.js";


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

/**
 * @swagger
 * /menu/getMenu/{id}:
 *   get:
 *     summary: Get the menu for a specific restaurant
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     responses:
 *       '200':
 *         description: Successfully retrieved the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 menu:
 *                   type: object
 *                   example:
 *                     _id: "661e5fe1b04efc17484b3e91"
 *                     menuName: "Lunch Specials"
 *                     restaurant: "661e5c80b04efc17484b3e8d"
 *                     menuItems: []
 *       '404':
 *         description: Restaurant not found
 *       '500':
 *         description: Internal server error
 */


router.get('/getMenu/:id',isAuthenticated,getMenu);
export default router