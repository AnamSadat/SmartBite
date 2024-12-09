import { PrismaClient } from "@prisma/client/index";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data sebelumnya (opsional)
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("password456", 10);

  // Buat beberapa data pengguna
  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      password: hashedPassword1,
      profile: {
        create: [
          {
            name: "John Doe",
            age: 30,
            gender: "Laki-laki",
            weight: 75.5,
            height: 175.0,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.doe@example.com",
      password: hashedPassword2,
      profile: {
        create: [
          {
            name: "Jane Doe",
            age: 25,
            gender: "Perempuan",
            weight: 55.5,
            height: 170.0,
          },
        ],
      },
    },
  });

  console.log("Seeding completed:");
  console.log(user1);
  console.log(user2);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
