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

router.post('/createMenu/:id',isAuthenticated,isRestaurantOwner,upload.fields([{name:"itemPictures"}]),createMenu);

router.put(
  "/updateMenu/:id",
  isAuthenticated,
  isRestaurantOwner,
  upload.any(),
  updateMenu
);

router.get('/getMenu/:id', getMenusByRestaurant);

router.get('/:id',isAuthenticated, getMenuById);

router.delete('/deleteMenu/:id',isAuthenticated,isRestaurantOwner,deleteMenu);
export default router