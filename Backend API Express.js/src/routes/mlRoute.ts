import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getPredict, getRecomendation } from "../controllers/mlControllers";
import multer from 'multer';
const storage = multer.memoryStorage();
// Atur multer untuk menangani satu file dengan nama field 'image'
const upload = multer({ storage: storage });
const mlRoute = express.Router();
mlRoute.post("/predict", upload.single('image'), getPredict)
mlRoute.get('/recomendation', getRecomendation)
export default mlRoute;

