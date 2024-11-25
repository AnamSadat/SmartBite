import express from "express";
import authRoute from "./authRoute";
import usersRoute from "./usersRoute";

const router = express.Router();

router.use(authRoute);
router.use(usersRoute);

export default router;
