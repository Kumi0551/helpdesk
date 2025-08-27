import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "An error occurred" });
  }
  const body = await request.json();
  const { subject, description, departmentId, priority, assignedToId } = body;

  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      priority,
      createdBy: { connect: { id: currentUser.id } },
      department: { connect: { id: departmentId } },
      ...(assignedToId && { assignedTo: { connect: { id: assignedToId } } }),
    },
  });

  return NextResponse.json(ticket);
}
