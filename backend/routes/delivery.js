import express from "express";
import {
  isAuthenticated,
  isAdmin,
  isDeliveryPerson,
} from "../middlewares/auth.js";
import {
  getAllDeliveries,
  getCustomerDeliveries,
  getDeliveryPersonDeliveries,
  updateDeliveryStatus,
} from "../controllers/delivery.js";

const router = express.Router();

router.put(
  "/status/:id",
  isAuthenticated,
  isDeliveryPerson,
  updateDeliveryStatus
);
router.get(
  "/delivery-person",
  isAuthenticated,
  isDeliveryPerson,
  getDeliveryPersonDeliveries
);
router.get("/customer", isAuthenticated, getCustomerDeliveries);
router.get("/all", isAuthenticated, isAdmin, getAllDeliveries);

export default router;
