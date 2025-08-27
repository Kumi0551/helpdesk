import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { TicketWithDetails } from "@/types";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const tickets = (await prisma.ticket.findMany({
      where: {
        OR: [{ createdById: currentUser.id }, { assignedToId: currentUser.id }],
      },
      include: {
        createdBy: true,
        assignedTo: true,
        acceptedBy: true,
        department: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })) as TicketWithDetails[];

    // Calculate statistics
    const stats = {
      total: tickets.length,
      pending: tickets.filter((t) => t.status === "PENDING").length,
      open: tickets.filter((t) => t.status === "OPEN").length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,
      byPriority: {
        low: tickets.filter((t) => t.priority === "LOW").length,
        medium: tickets.filter((t) => t.priority === "MEDIUM").length,
        high: tickets.filter((t) => t.priority === "HIGH").length,
        critical: tickets.filter((t) => t.priority === "CRITICAL").length,
      },
    };

    return NextResponse.json({
      stats,
      recentTickets: tickets.slice(0, 5),
    });
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
