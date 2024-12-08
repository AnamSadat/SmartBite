import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { authTokenProfileMiddleware } from "../middleware/userProfileMiddleware";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController";

const usersProfileRouter = express.Router();

// Gunakan middleware sesuai kebutuhan
usersProfileRouter.get("/profile", authMiddleware, getUserProfile);
usersProfileRouter.put(
  "/profile",
  authTokenProfileMiddleware,
  updateUserProfile
);

export default usersProfileRouter;
