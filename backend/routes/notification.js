import express from "express";
import {
  getNotifications,
  markAsSeen,
} from "../controllers/notification.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

router.put("/mark-as-seen/:id", isAuthenticated, markAsSeen);


export default router;
