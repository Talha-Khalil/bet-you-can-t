const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure Users exist first
  const user1 = await prisma.user.upsert({
    where: { email: "challenger@example.com" },
    update: {},
    create: {
      email: "challenger@example.com",
      name: "Challenger User",
      profilePic: "https://example.com/challenger-pic.jpg",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "challenged@example.com" },
    update: {},
    create: {
      email: "challenged@example.com",
      name: "Challenged User",
      profilePic: "https://example.com/challenged-pic.jpg",
    },
  });

  // Now, create a Challenge
  await prisma.challenge.create({
    data: {
      description: "30-Day Coding Challenge",
      charity: "Code for Good",
      deadline: new Date("2024-12-31"),
      status: "PENDING",
      challengerId: user1.id, // Now user1 exists
      challengedId: user2.id, // Now user2 exists
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

