//get ticket by id

import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export default async function getTicketById(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
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
        comments: true,
      },
    });

    return ticket;
  } catch {
    throw NextResponse.error;
  }
}
