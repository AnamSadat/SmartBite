// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;

export const authTokenProfileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    // Menyimpan ID pengguna ke objek request
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
