import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  rate,
  getRatingForEntity,
  getTopRatedRestaurants,
  getTopRatedMenuItems,
} from "../controllers/rating.js";

const router = express.Router();

router.get("/top/restaurants", getTopRatedRestaurants);

router.get("/top/menu-items", getTopRatedMenuItems);

router.put("/:entityType/:entityId", isAuthenticated, rate);

router.get("/:entityType/:entityId", isAuthenticated, getRatingForEntity);


export default router;
