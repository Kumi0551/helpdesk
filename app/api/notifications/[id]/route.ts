import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const notification = await prisma.notification.update({
      where: {
        id: resolvedParams.id,
        recipientId: currentUser.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(notification);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
