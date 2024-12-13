import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ambil user_id dari query atau autentikasi JWT (opsional)
    const userId = req.user?.id ? Number(req.user?.id) : null;
    if (!userId) {
      res.status(400).json({ error: false, message: "User ID is required" });
      return;
    }

    // Query ke database
    const history = await prisma.model_logs.findMany({
      where: { user_id: userId },
      select: {
        id_log: true,
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
            serving_size: true,
            image_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" }, // Urutkan dari yang terbaru
    });

    // Jika tidak ada riwayat
    if (!history || history.length === 0) {
      res.status(404).json({error: true, message: "No scan history found for the user" });
      return;
    }

    // Kirim response
    res.status(200).json({error: false, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Failed to fetch scan history"});
  }
};
