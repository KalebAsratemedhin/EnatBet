import { isAdmin, isAuthenticated,isRestaurantOwner } from "../middlewares/auth.js";
import { upload } from "../middlewares/fileUpload.js";
import { 
    addRestaurant,updateRestaurant,deleteRestaurant,
    getAllMineRestaurant,getActiveRestaurants,getAllRestaurant, 
    updateRestaurantStatus
} from "../controllers/restaurant.js";
import express from 'express';

const router = express.Router(); 

/**
 * @swagger
 * /restaurant/addRestaurant/:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                   address:
 *                     type: string
 *               deliveryAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *               promotion:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     discount:
 *                       type: number
 *                     validuntil:
 *                       type: string
 *                       format: date
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       500:
 *         description: Failed to create restaurant 
 */
    
router.post('/addRestaurant',isAuthenticated,isRestaurantOwner, upload.single("logo"), addRestaurant); 

/**
 * @swagger
 * /restaurant/updateRestaurant/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                   address:
 *                     type: string
 *               deliveryAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *               promotion:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     discount:
 *                       type: number
 *                     validuntil:
 *                       type: string
 *                       format: date
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 *       403:
 *         description: Unauthorized to update restaurant
 *       500:
 *         description: Server error
 */


    
router.put("/updateRestaurant/:id", isAuthenticated,isRestaurantOwner, upload.single("logo"), updateRestaurant );

/**
 * @swagger
 * /restaurant/deleteRestaurant/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags:
 *       - Restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the restaurant to delete
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurant deleted successfully
 *       403:
 *         description: Unauthorized to delete this restaurant
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */


router.delete("/deleteRestaurant/:id",isAuthenticated, isRestaurantOwner,deleteRestaurant );

/**
 * @swagger
 * /restaurant/getAllMineRestaurant:
 *   get:
 *     summary: Get all restaurants created by the current user
 *     tags:
 *       - Restaurant
 *     security:
 *       - bearerAuth: []  # This should match the security scheme defined above
 *     responses:
 *       200:
 *         description: Successfully fetched restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurants fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       name: { type: string }
 *                       location:
 *                         type: object
 *                         properties:
 *                           type: { type: string, example: "Point" }
 *                           coordinates: { type: array, items: { type: number }, example: [0, 0] }
 *                           address: { type: string }
 *                       ownerId: { type: string }
 *                       promotion:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title: { type: string }
 *                             description: { type: string }
 *                             discount: { type: number }
 *                             validuntil: { type: string, format: date-time }
 *       500:
 *         description: Failed to fetch restaurants
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch restaurants
 */


router.get("/getAllMineRestaurant", isAuthenticated,isRestaurantOwner,getAllMineRestaurant);

/**
 * @swagger
 * /restaurant/activeRestaurants:
 *   get:
 *     summary: Get all restaurants created by the current user
 *     tags:
 *       - Restaurant
 *     security:
 *       - bearerAuth: []  # This should match the security scheme defined above
 *     responses:
 *       200:
 *         description: Successfully fetched restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurants fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       name: { type: string }
 *                       location:
 *                         type: object
 *                         properties:
 *                           type: { type: string, example: "Point" }
 *                           coordinates: { type: array, items: { type: number }, example: [0, 0] }
 *                           address: { type: string }
 *                       ownerId: { type: string }
 *                       promotion:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title: { type: string }
 *                             description: { type: string }
 *                             discount: { type: number }
 *                             validuntil: { type: string, format: date-time }
 *       500:
 *         description: Failed to fetch restaurants
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch restaurants
 */

router.get('/activeRestaurants',isAuthenticated,getActiveRestaurants);

/**
 * @swagger
 * /restaurant/getAllRestaurant:
 *   get:
 *     summary: Get all restaurants created by the current user
 *     tags:
 *       - Restaurant
 *     security:
 *       - bearerAuth: []  # This should match the security scheme defined above
 *     responses:
 *       200:
 *         description: Successfully fetched restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurants fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       name: { type: string }
 *                       location:
 *                         type: object
 *                         properties:
 *                           type: { type: string, example: "Point" }
 *                           coordinates: { type: array, items: { type: number }, example: [0, 0] }
 *                           address: { type: string }
 *                       ownerId: { type: string }
 *                       promotion:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             title: { type: string }
 *                             description: { type: string }
 *                             discount: { type: number }
 *                             validuntil: { type: string, format: date-time }
 *       500:
 *         description: Failed to fetch restaurants
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch restaurants
 */

router.get('/getAllRestaurant',isAuthenticated,getAllRestaurant);


/**
 * @swagger
 * /restaurant/approveRestaurant/{id}:
 *   patch:
 *     summary: Approve a restaurant (Admin only)
 *     tags:
 *       - Restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the restaurant to approve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurant approved successfully
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */
 
router.patch('/updateRestaurantStatus/:id',isAuthenticated,isAdmin,updateRestaurantStatus);

export default router;
