"use server";

import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string) {
  if (!query || query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { name: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 5,
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
    },
  });

  return users;
} 