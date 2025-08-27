//get all tickets in the system

import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { NextResponse } from "next/server";

export async function getAllTickets() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    throw NextResponse.error;
  }

  try {
    return await prisma.ticket.findMany({
      include: {
        department: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true, // Add this
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}
