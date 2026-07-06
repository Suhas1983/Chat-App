import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRoutes = express.Router();

// Authentication
userRoutes.post("/signup", signup);
userRoutes.post("/login", login);

// Update Profile
userRoutes.put("/update-profile", protectRoute, updateProfile);

// Check Authentication
userRoutes.get("/check", protectRoute, checkAuth);

export default userRoutes;