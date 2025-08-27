import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json([]);
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to 20 most recent notifications
    });

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
