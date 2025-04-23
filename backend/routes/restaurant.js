import { isAdmin, isAuthenticated,isRestaurantOwner } from "../middlewares/auth.js";
import { upload } from "../middlewares/fileUpload.js";
import { 
    addRestaurant,updateRestaurant,deleteRestaurant,
    getAllMineRestaurant,getActiveRestaurants,getAllRestaurant, getRestaurantById,
    updateRestaurantStatus
} from "../controllers/restaurant.js";
import express from 'express';

const router = express.Router(); 
    
router.post('/',isAuthenticated,isRestaurantOwner, upload.single("logo"), addRestaurant); 

router.put("/:id", isAuthenticated,isRestaurantOwner, upload.single("logo"), updateRestaurant );

router.delete("/:id",isAuthenticated, isRestaurantOwner,deleteRestaurant );

router.get("/mine", isAuthenticated,isRestaurantOwner,getAllMineRestaurant);

router.get('/active',isAuthenticated,getActiveRestaurants);

router.get('/all',isAuthenticated,getAllRestaurant);

router.get('/:id',isAuthenticated,getRestaurantById);

router.patch('/status/:id',isAuthenticated,isAdmin,updateRestaurantStatus);

export default router;
