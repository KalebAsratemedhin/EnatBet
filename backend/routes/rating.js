import express from "express";
import {isAuthenticated, isAdmin, isRestaurantOwner} from "../middlewares/auth.js"
import { rate, updateRating , getRatingForEntity } from "../controllers/rating.js";
const router = express.Router();


router.post('/:entityType/:entityId',isAuthenticated, rate);

router.put('/:entityType/:entityId', isAuthenticated,updateRating);

router.get('/:entityType/:entityId', isAuthenticated,getRatingForEntity);


  
export default router