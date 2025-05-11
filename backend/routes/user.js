import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  changePassword,
  deleteAccount,
  verifyEmail,
  verifyPhone,
  updateProfile,
  sendVerificationEmail,
  getAllUsers,
  updateUserStatus,
} from "../controllers/user.js";

const router = express.Router();

router.post("/change-password", isAuthenticated, changePassword);

router.delete("/delete", isAuthenticated, deleteAccount);

router.get("/send-verification-email", isAuthenticated, sendVerificationEmail);

router.get("/verify-email", verifyEmail);

router.get("/verify-phone", isAuthenticated, verifyPhone);

router.put("/profile", isAuthenticated, updateProfile);

router.get("/all", isAuthenticated, isAdmin, getAllUsers);

router.put("/status/:id", isAuthenticated, isAdmin, updateUserStatus);

export default router;
