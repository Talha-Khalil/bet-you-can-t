"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getMyChallenges() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.email) {
    return { error: "Not authenticated" };
  }

  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        challenger: {
          email: user.email
        }
      },
      include: {
        challenger: true,
        challenged: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return { challenges };
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return { error: "Failed to fetch challenges" };
  }
} 