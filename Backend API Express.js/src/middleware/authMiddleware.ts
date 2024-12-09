import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client/index";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY!;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    const decode = jwt.verify(token, SECRET_KEY) as {
      id: number;
      email: string;
    };
    prisma.active_tokens.findUnique({
      where: {
        user_id: decode.id
      },
    }).then((checkToken) => {
      if (checkToken) {
        req.user = decode;
        next();
      }else {
        res.status(401).json({ status: "unauthorized", message: "Invalid or expired token" });
      }
    })
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
