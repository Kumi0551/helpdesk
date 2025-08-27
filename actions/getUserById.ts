//get user by id

import prisma from "@/libs/prismadb";

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
            ticketsAccepted: true,
          },
        },
      },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}
