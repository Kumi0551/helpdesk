import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { Priority, Status } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "An error occurred" });
    }

    const { searchParams } = new URL(request.url);

    const validStatuses = [
      "OPEN",
      "PENDING",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];
    const statusParam = searchParams.get("status");
    const status =
      statusParam && statusParam !== "all"
        ? validStatuses.includes(statusParam)
          ? (statusParam as Status)
          : undefined
        : undefined;

    // 2. Same for priority
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const priorityParam = searchParams.get("priority");
    const priority =
      priorityParam && priorityParam !== "all"
        ? validPriorities.includes(priorityParam)
          ? (priorityParam as Priority)
          : undefined
        : undefined;

    // Build the where clause
    const whereClause = {
      ...(searchParams.get("start") && {
        createdAt: { gte: new Date(searchParams.get("start")!) },
      }),
      ...(searchParams.get("end") && {
        createdAt: { lte: new Date(searchParams.get("end")!) },
      }),
      ...(status && { status }), // Now guaranteed to be valid Status enum
      ...(priority && { priority }), // Guaranteed valid Priority enum
      ...(searchParams.get("user") && {
        OR: [
          { createdById: searchParams.get("user")! },
          { assignedToId: searchParams.get("user")! },
        ],
      }),
      ...(searchParams.get("department") && {
        departmentId: searchParams.get("department")!,
      }),
    };

    // Rest of your implementation...
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        // ... your existing includes
      },
      orderBy: { createdAt: "desc" },
    });

    if (searchParams.get("type") === "overview") {
      const stats = {
        // ... your existing stats calculation
      };
      return NextResponse.json({ tickets, stats });
    }

    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
