import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { ticketId, departmentId } = await request.json();

    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    // Verify ticket and department
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

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json({ error: "An error occurred" });
    }

    // Get all admins in the department
    const admins = await prisma.user.findMany({
      where: {
        departmentId: departmentId,
        role: {
          in: ["ADMIN", "SUPER_ADMIN"],
        },
      },
    });

    // Create notifications for each admin
    const notificationPromises = admins.map((admin) => {
      return prisma.notification.create({
        data: {
          type: "TICKET_TO_DEPARTMENT",
          message: `New ticket "${ticket.subject}" assigned to ${department.name} department`,
          recipientId: admin.id,
          ticketId: ticket.id,
          departmentId: department.id,
        },
      });
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
