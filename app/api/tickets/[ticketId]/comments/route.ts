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

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: resolvedParams.ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const isAuthorized =
      ticket.createdById === currentUser.id ||
      ticket.assignedToId === currentUser.id ||
      ticket.acceptedById === currentUser.id ||
      currentUser.role === "ADMIN" ||
      currentUser.role === "SUPER_ADMIN";

    if (!isAuthorized) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: resolvedParams.ticketId,
        createdById: currentUser.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.ticket.update({
      where: { id: resolvedParams.ticketId },
      data: { updatedAt: new Date() },
    });

    const notificationPromises = [];

    // Notify the ticket creator if they are not the current user
    if (ticket.createdById !== currentUser.id) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: "NEW_COMMENT",
            message: `A new comment has been added to your ticket: "${ticket.subject}"`,
            recipientId: ticket.createdById,
            ticketId: resolvedParams.ticketId,
          },
        })
      );
    }

    // Notify the assigned user if they are not the current user
    if (ticket.assignedToId && ticket.assignedToId !== currentUser.id) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: "NEW_COMMENT",
            message: `A new comment has been added to the ticket assigned to you: "${ticket.subject}"`,
            recipientId: ticket.assignedToId,
            ticketId: resolvedParams.ticketId,
          },
        })
      );
    }

    // Notify the accepted user if they are not the current user
    if (ticket.acceptedById && ticket.acceptedById !== currentUser.id) {
      notificationPromises.push(
        prisma.notification.create({
          data: {
            type: "NEW_COMMENT",
            message: `A new comment has been added to the ticket you accepted: "${ticket.subject}"`,
            recipientId: ticket.acceptedById,
            ticketId: resolvedParams.ticketId,
          },
        })
      );
    }

    await Promise.all(notificationPromises);

    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
