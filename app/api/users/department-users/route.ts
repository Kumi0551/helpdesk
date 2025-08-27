import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    if (!currentUser) {
      return NextResponse.json({ error: "An error occurred" });
    }

    if (departmentId) {
      if (
        currentUser.role !== "SUPER_ADMIN" &&
        currentUser.departmentId !== departmentId
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const users = await prisma.user.findMany({
        where: { departmentId },
        select: { id: true, name: true, email: true, departmentId: true },
      });
      return NextResponse.json(users);
    }

    if (currentUser.role === "SUPER_ADMIN") {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, departmentId: true },
      });
      return NextResponse.json(users);
    }

    if (currentUser.role === "ADMIN" && currentUser.departmentId) {
      const users = await prisma.user.findMany({
        where: { departmentId: currentUser.departmentId },
        select: { id: true, name: true, email: true, departmentId: true },
      });
      return NextResponse.json(users);
    }

    return NextResponse.json({ error: "An error occurred" });
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
