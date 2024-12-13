// src/controllers/dashboardController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios"
import FormData from "form-data";
const prisma = new PrismaClient();

/**
 * Menampilkan dashboard user dengan data mini profile dan hasil prediksi terbaru.
 */
export const getPredict = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const form = new FormData();
    form.append("image", req.file.buffer, req.file.originalname);
    const response = await axios.post(`${process.env.BASE_URL_ML}/predict`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json(error.response.data);
  }
};
export const getRecomendation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query
    const {data} = await axios.get(`${process.env.BASE_URL_ML}/recomendation?calorie=` + query.calorie);
    res.status(200).json(data)
  } catch (error) {
    res
      .status(500)
      .json(error.response.data);
  }
};