import { isAuthenticated,isRestaurantOwner } from "../middlewares/auth.js";
import { addRestaurant,updateRestaurant,deleteRestaurant ,getAllMineRestaurant,getActiveRestaurants } from "../controllers/restaurant.js";

import express from 'express';

const router = express.Router(); 

router.post('/addRestaurant',isAuthenticated,isRestaurantOwner,addRestaurant); 
 
router.put("/updateRestaurant", isAuthenticated,isRestaurantOwner, updateRestaurant );

router.delete("/deleteRestaurant",isAuthenticated, isRestaurantOwner,deleteRestaurant );

router.get("/getAllMineRestaurant", isAuthenticated,isRestaurantOwner,getAllMineRestaurant);

router.get('/activeRestaurants',isAuthenticated,getActiveRestaurants);
