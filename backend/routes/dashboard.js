
import express from "express";
import { isAdmin, isAuthenticated, isDeliveryPerson, isRestaurantOwner } from "../middlewares/auth.js";
import { getAdminDashboard, getCustomerDashboard, getDeliveryPersonDashboard, getRestaurantOwnerDashboard } from "../controllers/dashboard.js";

const router = express.Router();

router.get('/customer', isAuthenticated, getCustomerDashboard);
router.get('/delivery-person', isAuthenticated, isDeliveryPerson, getDeliveryPersonDashboard);
router.get('/restaurant-owner', isAuthenticated, isRestaurantOwner, getRestaurantOwnerDashboard);

router.get('/admin', isAuthenticated, isAdmin, getAdminDashboard);


export default router;

