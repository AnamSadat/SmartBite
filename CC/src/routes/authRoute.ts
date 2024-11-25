import express from "express";
import { login, register } from "../controllers/auth";

const authRoute = express.Router();

authRoute.post("/auth/login", login);
authRoute.post("/auth/register", register);

export default authRoute;
