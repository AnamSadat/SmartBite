import express from "express";
import { login, logout, register } from "../controllers/auth";
import authMiddleware from "../middleware/authMiddleware";

const authRoute = express.Router();

authRoute.post("/auth/login", login);
authRoute.post("/auth/register", register);
authRoute.get("/auth/logout", authMiddleware, logout) 

export default authRoute;
