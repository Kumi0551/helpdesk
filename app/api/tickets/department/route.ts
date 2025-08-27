import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        departmentId: currentUser.departmentId,
      },
      include: {
        department: true,
        createdBy: true,
        assignedTo: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ error: "An error occurred" });
    }

    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
