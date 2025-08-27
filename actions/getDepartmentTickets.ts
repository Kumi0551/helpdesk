//get department tickets

import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export async function getDepartmentTickets() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.departmentId) return null;

    return await prisma.ticket.findMany({
      where: {
        OR: [
          { departmentId: currentUser.departmentId },
          { assignedToId: currentUser.id },
          { createdById: currentUser.id },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        acceptedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}
