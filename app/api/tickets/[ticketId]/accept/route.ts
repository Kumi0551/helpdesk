import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (!resolvedParams.ticketId) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: resolvedParams.ticketId },
      include: {
        department: true,
        createdBy: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (currentUser.departmentId !== ticket.departmentId) {
      return NextResponse.json({ error: "An error occurred" });
    }

    let updateData: {
      status: "IN_PROGRESS" | "RESOLVED";
      acceptedAt?: Date;
      acceptedById?: string;
      resolvedAt?: Date;
    };

    if (ticket.status === "OPEN" || ticket.status === "PENDING") {
      updateData = {
        status: "IN_PROGRESS",
        acceptedAt: new Date(),
        acceptedById: currentUser.id,
      };
    } else if (ticket.status === "IN_PROGRESS") {
      if (ticket.assignedToId && ticket.assignedToId !== currentUser.id) {
        return NextResponse.json({ error: "An error occurred" });
      }

      updateData = {
        status: "RESOLVED",
        resolvedAt: new Date(),
      };
    } else {
      return NextResponse.json({ error: "An error occurred" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: resolvedParams.ticketId },
      data: updateData,
      include: {
        assignedTo: true,
        createdBy: true,
        acceptedBy: true,
        department: true,
      },
    });

    if (
      updateData.status === "IN_PROGRESS" &&
      ticket.createdById !== currentUser.id
    ) {
      await prisma.notification.create({
        data: {
          type: "TICKET_ACCEPTED",
          message: `Your ticket "${ticket.subject}" has been accepted by ${
            currentUser.name || "a user"
          }`,
          recipientId: ticket.createdById,
          ticketId: ticket.id,
          departmentId: ticket.departmentId,
        },
      });
    }

    return NextResponse.json(updatedTicket);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
