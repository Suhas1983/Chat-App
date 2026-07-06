import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageControllers.js";

const messageRouter = express.Router();

// Get all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get messages between logged-in user and selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage)
export default messageRouter;