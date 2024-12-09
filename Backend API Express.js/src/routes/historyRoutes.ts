import express from "express";
import { getHistory } from "../controllers/historyController";
import authMiddleware from "../middleware/authMiddleware";

const authRoute = express.Router();

authRoute.get("/history", authMiddleware, getHistory);

export default authRoute;
