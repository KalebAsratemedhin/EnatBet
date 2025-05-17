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
import { upload } from "../middlewares/fileUpload.js";

const router = express.Router();

router.put("/change-password", isAuthenticated, changePassword);

router.delete("/delete-account", isAuthenticated, deleteAccount);

router.post("/send-verification-email", isAuthenticated, sendVerificationEmail);

router.post("/verify-email", isAuthenticated, verifyEmail);

router.post("/verify-phone", isAuthenticated, verifyPhone);

router.put("/profile", isAuthenticated, upload.single("profilePicture"), updateProfile);

router.get("/all", isAuthenticated, isAdmin, getAllUsers);

router.put("/status/:id", isAuthenticated, isAdmin, updateUserStatus);

export default router;
