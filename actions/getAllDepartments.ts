import prisma from "@/libs/prismadb";

export async function getAllDepartments() {
  return await prisma.department.findMany({
    include: {
      _count: {
        select: {
          users: { where: { isActive: true } }, // Only count active users
          tickets: true,
        },
      },
      users: {
        // Add this to include active users
        where: { isActive: true },
        select: { id: true, name: true },
      },
      tickets: {
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });
}
