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
        assignedTo: true,
        acceptedBy: true,
        createdBy: true,
        department: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const isAuthorized =
      ticket.assignedTo?.id === currentUser.id ||
      ticket.acceptedBy?.id === currentUser.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (ticket.status !== "IN_PROGRESS") {
      return NextResponse.json({ error: "An error occurred" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: resolvedParams.ticketId },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
      include: {
        assignedTo: true,
        acceptedBy: true,
        createdBy: true,
        department: true,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
