// actions/getUsers.ts
import prisma from "@/libs/prismadb";

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      include: {
        department: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
            ticketsAccepted: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}
