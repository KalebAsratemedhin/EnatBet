import express from "express";
import { isAuthenticated, isRestaurantOwner } from "../middlewares/auth.js";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getOrderById,
  payForOrder,
  getRestaurantOrders,
  updateOrderStatus,
  paymentSuccess,
} from "../controllers/order.js";

const router = express.Router();

router.put(
  "/status/:id",
  isAuthenticated,
  isRestaurantOwner,
  updateOrderStatus
);

router.get("/payment-success", paymentSuccess);

router.put("/cancel/:id", isAuthenticated, cancelOrder);

router.get("/customer", isAuthenticated, getCustomerOrders);

router.get("/restaurant/:id", isAuthenticated, getRestaurantOrders);

router.get("/:id", isAuthenticated, getOrderById);

router.post("/pay", isAuthenticated, payForOrder);

router.post("/", isAuthenticated, createOrder);

router.get("/", isAuthenticated, getAllOrders);

export default router;
