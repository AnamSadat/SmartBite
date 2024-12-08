import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECRET_KEY = process.env.SECRET_KEY!;

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userHistory?: any[];
    }
  }
}

const historyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: number;
      email: string;
    };

    req.userId = decoded.id;

    // Fetch user history from the database
    const userHistory = await prisma.model_logs.findMany({
      where: { user_id: decoded.id },
      orderBy: { created_at: "desc" },
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
            image_url: true,
          },
        },
      },
    });

    if (!userHistory || userHistory.length === 0) {
      res.status(404).json({ message: "No history found" });
      return;
    }

    req.userHistory = userHistory;

    next();
  } catch (error) {
    console.error("History Middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default historyMiddleware;
