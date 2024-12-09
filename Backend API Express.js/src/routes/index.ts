import express from "express";
import authRoute from "./authRoute";
import usersRoute from "./usersRoute";
import historyRoutes from "./historyRoutes";
import usersProfileRouter from "./usersProfileRoute";
import dashboardRouter from "./dashboardRoute";

const router = express.Router();

router.use(authRoute);
router.use(usersRoute);
router.use(historyRoutes);
router.use(usersProfileRouter);
router.use(dashboardRouter);

export default router;
