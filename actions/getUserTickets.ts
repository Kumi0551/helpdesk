//get user tickets

import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { NextResponse } from "next/server";

export async function getUserTickets() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw NextResponse.error;

    return await prisma.ticket.findMany({
      where: {
        OR: [
          { createdById: currentUser.id },
          { assignedToId: currentUser.id },
          { acceptedById: currentUser.id },
        ],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true, // Add this
          },
        },
        // ... other includes
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    throw NextResponse.error;
  }
}
