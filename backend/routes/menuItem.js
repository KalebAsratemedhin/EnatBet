import express from 'express';
import {isAuthenticated,isRestaurantOwner} from "../middlewares/auth.js";
import {upload} from "../middlewares/fileUpload.js";
import {addMenuItem, updateMenuItem} from '../controllers/menuItem.js';

const router = express.Router();

/** 
* @swagger
*   /menuItem/addMenuItem/{id}:
*     post:
*       summary: Create a menu item with image
*       tags:
*         - Menu Items
*       parameters:
*         - name: id
*           in: path
*           required: true
*           schema:
*             type: string
*           description: Menu ID
*       requestBody:
*         required: true
*         content:
*           multipart/form-data:
*             schema:
*               type: object
*               properties:
*                 name:
*                   type: string
*                 description:
*                   type: string
*                 price:
*                   type: number
*                 image:
*                   type: string
*                   format: binary
*       responses:
*         '201':
*           description: Menu item created successfully
*         '400':
*           description: Bad request
*         '401':
*           description: Unauthorized
*/
router.post('/addMenuItem/:id',isAuthenticated,isRestaurantOwner,upload.single("image"),addMenuItem);



/** 
* @swagger
*   /menuItem/updateMenuItem/{id}:
*     put:
*       summary: Update a menu item
*       tags:
*         - Menu Items
*       parameters:
*         - name: id
*           in: path
*           required: true
*           schema:
*             type: string
*           description: Menu item ID
*       requestBody:
*         required: true
*         content:
*           multipart/form-data:
*             schema:
*               type: object
*               properties:
*                 name:
*                   type: string
*                 description:
*                   type: string
*                 price:
*                   type: number
*                 image:
*                   type: string
*                   format: binary
*       responses:
*         '200':
*           description: Menu item updated successfully
*         '400':
*           description: Bad request
*         '401':
*           description: Unauthorized
*         '403':
*           description: Forbidden - Access denied
*         '404':
*           description: Menu item not found
*         '500':
*           description: Internal server error
*/
router.put("/updateMenuItem/:id",isAuthenticated,isRestaurantOwner,upload.single("image"),updateMenuItem)
export default router