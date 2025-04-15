import express from "express";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import { createMenu, deleteMenu, getMenuByRestaurant, updateMenu } from "../controllers/menu.js";
import { upload } from "../middlewares/fileUpload.js";

const router = express.Router();


/**
 * @swagger
 * /menu/createMenu/{restaurantId}:
 *   post:
 *     summary: Create a menu with embedded items (send item data as JSON and images as files)
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               menuName:
 *                 type: string
 *                 example: "Breakfast Menu"
 *               menuItems:
 *                 type: string
 *                 example: '[{"name":"Pancakes","description":"With syrup","price":5.99},{"name":"Omelette","description":"Cheese omelette","price":6.49}]'
 *               itemPictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '201':
 *         description: Menu created successfully
 *       '400':
 *         description: Invalid input
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */


router.post('/createMenu/:id',isAuthenticated,isRestaurantOwner,upload.fields([{name:"itemPictures"}]),createMenu);
/**
 * @swagger
 * /menu/updateMenu/{id}:
 *   put:
 *     summary: Update an existing menu and its items (with image upload)
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               menuName:
 *                 type: string
 *                 example: "Updated Breakfast Menu"
 *               menuItems:
 *                 type: string
 *                 example: '[{"_id":"67fe320af00344bfc85a83ea", "name":"Updated Pancakes", "description":"New desc", "price":6.99}]'
 *               itemPictures:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Menu updated successfully
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: Menu not found
 *       '500':
 *         description: Internal server error
 */


router.put("/updateMenu/:id",isAuthenticated,isRestaurantOwner,upload.fields([{name:"itemPictures"}]),updateMenu)
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


router.get('/getMenu/:id',isAuthenticated,getMenuByRestaurant);
/**
 * @swagger
 * /menu/deleteMenu/{restaurantId}:
 *   delete:
 *     summary: Delete a menu by its restaurant ID (only accessible by the restaurant owner)
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant whose menu is to be deleted
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Menu deleted successfully
 *       '403':
 *         description: Access denied (user is not the restaurant owner)
 *       '404':
 *         description: Menu not found
 *       '500':
 *         description: Server error
 */

router.delete('/deleteMenu/:id',isAuthenticated,isRestaurantOwner,deleteMenu);
export default router