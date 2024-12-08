import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware untuk memvalidasi akses ke history
 */
export const validateHistoryAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const historyId = req.params.historyId; // Pastikan ID history ada di parameter
    const userId = req.userId; // userId yang diambil dari middleware autentikasi

    // Validasi awal
    if (!historyId) {
      res.status(400).json({ message: "History ID is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Periksa apakah history dengan ID tersebut ada dan dimiliki oleh user
    const history = await prisma.model_logs.findUnique({
      where: { id_log: Number(historyId) },
    });

    if (!history) {
      res.status(404).json({ message: "History not found" });
      return;
    }

    if (history.user_id !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Jika valid, lanjutkan ke handler berikutnya
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
