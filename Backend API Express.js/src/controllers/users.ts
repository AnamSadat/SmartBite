import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/index";

const prisma = new PrismaClient();

const users = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  res.status(200).json(usersWithoutPassword);
};

export default users;
