// app/api/users/department/[departmentId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    const { departmentId } = resolvedParams;

    const users = await prisma.user.findMany({
      where: { departmentId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
