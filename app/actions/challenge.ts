"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createChallenge(data: {
  description: string;
  charity?: string;
  deadline: Date;
  challengedEmail: string;
}) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    // Find or create the challenged user
    const challengedUser = await prisma.user.upsert({
      where: { email: data.challengedEmail },
      update: {},
      create: {
        email: data.challengedEmail,
        name: data.challengedEmail.split("@")[0], // Default name from email
      },
    });

    // Find the challenger user
    const challengerUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!challengerUser) {
      throw new Error("Challenger user not found");
    }

    // Create the challenge
    const challenge = await prisma.challenge.create({
      data: {
        description: data.description,
        charity: data.charity,
        deadline: data.deadline,
        challengerId: challengerUser.id,
        challengedId: challengedUser.id,
        status: "PENDING",
      },
    });

    // Create a notification for the challenged user
    await prisma.notification.create({
      data: {
        userId: challengedUser.id,
        message: `You have been challenged to: ${data.description}`,
        read: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, challenge };
  } catch (error) {
    console.error("Error creating challenge:", error);
    return { success: false, error: "Failed to create challenge" };
  }
} 