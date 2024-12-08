import express from "express";
import { getHistory } from "../controllers/historyController";

const authRoute = express.Router();

authRoute.get("/history", getHistory);

export default authRoute;
