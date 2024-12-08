// src/routes/dashboardRoute.ts
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { validateHistoryAccess } from "../middleware/historyMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const dashboardRouter = Router();

// Dashboard route
dashboardRouter.get(
  "/dashboard",
  authMiddleware,
  validateHistoryAccess,
  getDashboard
);

export default dashboardRouter;
