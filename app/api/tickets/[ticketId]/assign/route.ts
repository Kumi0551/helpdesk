import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

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

    const { assignedToId } = await request.json();
    const { ticketId } = resolvedParams;

    if (!assignedToId) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "An error occurred" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: true,
        department: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (ticket.assignedToId) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (ticket.departmentId !== currentUser.departmentId) {
      return NextResponse.json({ error: "An error occurred" });
    }

    // Update the ticket with the assigned user
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedToId,
        assignedAt: new Date(),
        status: "IN_PROGRESS",
      },
      include: {
        assignedTo: true,
        createdBy: true,
        department: true,
      },
    });

    // Create notifications
    const notificationPromises = [];

    // Notify the assigned user
    notificationPromises.push(
      prisma.notification.create({
        data: {
          type: "TICKET_ASSIGNED",
          message: `You've been assigned to ticket "${ticket.subject}"`,
          recipientId: assignedToId,
          ticketId: ticket.id,
          departmentId: ticket.departmentId,
        },
      })
    );

    // Notify the ticket creator (if not the same as assigned user)
    if (ticket.createdById !== assignedToId) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: "TICKET_ASSIGNED",
            message: `Your ticket "${ticket.subject}" has been assigned to ${
              updatedTicket.assignedTo?.name || "a user"
            }`,
            recipientId: ticket.createdById,
            ticketId: ticket.id,
            departmentId: ticket.departmentId,
          },
        })
      );
    }

    await Promise.all(notificationPromises);

    return NextResponse.json(updatedTicket);
  } catch {
    return NextResponse.error();
  }
}
