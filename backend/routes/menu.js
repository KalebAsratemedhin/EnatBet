import express from "express";
import {
  createMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.js";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import { upload } from "../middlewares/fileUpload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu management for restaurants
 */

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menu]
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
 *               - restaurant
 *             properties:
 *               menuName:
 *                 type: string
 *                 example: "Lunch Specials"
 *               restaurant:
 *                 type: string
 *                 example: "661e5c80b04efc17484b3e8d"
 *               menuItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Burger"
 *                     description:
 *                       type: string
 *                       example: "Juicy grilled beef burger"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     itemPicture:
 *                       type: string
 *                       example: "/images/burger.jpg"
 *     responses:
 *       201:
 *         description: Menu created successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post(
    "/",
    isAuthenticated,
    isRestaurantOwner,
    upload.array("itemPictures"), // same name as frontend field
    createMenu
  );
/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get a menu by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu
 *     responses:
 *       200:
 *         description: Menu retrieved successfully
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Server error
 */
router.get("/:id", isAuthenticated, getMenuById);

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
router.delete("/:id", isAuthenticated, isRestaurantOwner, deleteMenu);

export default router;
