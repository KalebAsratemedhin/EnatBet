import express from "express";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import { cancelOrder, createOrder, getAllOrders, getCustomerOrders, getOrderById, getRestaurantOrders, updateOrderStatus } from "../controllers/order.js";

const router = express.Router();

router.post('/',isAuthenticated, createOrder);

router.put("/status/:id", isAuthenticated, isRestaurantOwner, updateOrderStatus)

router.put("/cancel/:id", isAuthenticated, cancelOrder)

router.get('/',isAuthenticated, getAllOrders);

router.get('/customer',isAuthenticated, getCustomerOrders);

router.get('/restaurant/:id',isAuthenticated, getRestaurantOrders);

router.get('/:id',isAuthenticated, getOrderById);

export default router