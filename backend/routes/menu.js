import express from "express";
import {
  createMenu,
  getMenusByRestaurant,
  updateMenu,
  deleteMenu,
  getMenuById,
} from "../controllers/menu.js";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
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
 *       201:
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
 * /menu/{id}:
 *   put:
 *     summary: Update an entire menu and its items
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the menu to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menuName:
 *                 type: string
 *                 example: "Updated Menu"
 *               menuItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Salad"
 *                     description:
 *                       type: string
 *                       example: "Fresh green salad"
 *                     price:
 *                       type: number
 *                       example: 7.99
 *                     itemPicture:
 *                       type: string
 *                       example: "/images/salad.jpg"
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Server error
 */
router.put("/:id", 
    isAuthenticated, 
    isRestaurantOwner,
    upload.array("itemPictures"),
    updateMenu);

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the menu to delete
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Server error
 */

 
router.get('/getMenu/:id',isAuthenticated, getMenusByRestaurant);


router.get('/:id',isAuthenticated, getMenuById);

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