// src/controllers/dashboardController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Menampilkan dashboard user dengan data mini profile dan hasil prediksi terbaru.
 */
export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access." });
      return;
    }

    // Ambil data profil pengguna
    const userProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: {
        name: true,
        age: true,
        gender: true,
        weight: true,
        height: true,
      },
    });

    if (!userProfile) {
      res.status(404).json({ message: "User profile not found." });
      return;
    }

    // Ambil prediksi terbaru dari model_logs
    const latestPredictions = await prisma.model_logs.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      take: 5, // Ambil 5 log prediksi terbaru
      select: {
        image_input_url: true,
        confidence_score: true,
        created_at: true,
        food_items: {
          select: {
            name: true,
            calories: true,
            protein: true,
            carbohydrate: true,
            fat: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        profile: userProfile,
        latestPredictions,
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res
      .status(500)
      .json({ status: "error", message: "An error occurred while fetching dashboard data." });
  }
};
