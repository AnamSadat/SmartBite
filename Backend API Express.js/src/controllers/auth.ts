import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY!;

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      res.status(400).json({ error: true, message: "Email and password are required" });
      return;
    }

    // Cari pengguna berdasarkan username
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: true, message: "Email not found" });
      return;
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: true, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user.id_user, username: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    const findToken = await prisma.active_tokens.findUnique({
      where: {
        user_id: user.id_user,
      },
    })
    if(!findToken){
      await prisma.active_tokens.create({
        data: {
          user_id: user.id_user,
          token,
        },
      })
    }else{
      await prisma.active_tokens.update({
        where: {
          user_id: user.id_user,
        },
        data: {
          token,
        },
      })
    }
    res.status(200).json({ error: false, message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "An error occurred during login" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, age, gender, weight, height } = req.body;

  try {
    // Validasi input sederhana
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: true, message: "Name, email, and password are required" });
      return;
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: true, message: "Email already in use" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: [
            {
              name,
              age,
              gender,
              weight,
              height,
            },
          ],
        },
      },
    });

    // Kirim respons tanpa password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({error: false, message: "User registered successfully" });
  } catch (error) {                               
    console.error(error);
    res.status(500).json({error: true, message: "Failed to register user" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try{
    const userId = req.user?.id ? Number(req.user?.id) : undefined; // assuming you have a middleware that adds userId from the token
    await prisma.active_tokens.deleteMany({
      where: { user_id: userId },
    });
    res.status(200).json({error: false, message: "Logout successful" });
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "An error occurred during logout" });
  }
}