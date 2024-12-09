// src/controllers/userProfileController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id ? Number(req.user?.id) : undefined; // assuming you have a middleware that adds userId from the token
  try {
    const userProfile = await prisma.profile.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        age: true,
        gender: true,
        weight: true,
        height: true,
      }
    });

    if (!userProfile) {
      res.status(404).json({status: "fail", message: "Profile not found" });
      return;
    }

    res.status(200).json({status: "success", data: userProfile});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "An error occurred while fetching the profile" });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId; // Get userId from JWT
  const { name, age, gender, weight, height } = req.body;

  try {
    // Validasi input
    if (!name || !age || !gender || !weight || !height) {
      res.status(400).json({ status: "fail", message: "All profile fields are required" });
      return;
    }

    const updatedProfile = await prisma.profile.update({
      where: { user_id: userId },
      data: {
        name,
        age,
        gender,
        weight,
        height,
      },
    });

    res.status(200).json({status : "success", data: updatedProfile});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
