import prisma from "@/libs/prismadb";
import { ReportFilters, ReportData } from "@/types";
import { Status } from "@prisma/client";

export async function getReportData(
  filters: ReportFilters
): Promise<ReportData> {
  try {
    const whereClause = {
      ...(filters.startDate && { createdAt: { gte: filters.startDate } }),
      ...(filters.endDate && { createdAt: { lte: filters.endDate } }),
      ...(filters.status &&
        filters.status !== "all" && {
          status: filters.status as Status, // Explicitly cast to Status enum
        }),
      ...(filters.priority &&
        filters.priority !== "all" && { priority: filters.priority }),
      ...(filters.userId && {
        OR: [{ createdById: filters.userId }, { assignedToId: filters.userId }],
      }),
      ...(filters.departmentId && { departmentId: filters.departmentId }),
    };

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        acceptedBy: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        comments: {
          include: { createdBy: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (filters.reportType === "overview") {
      const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "OPEN").length,
        pending: tickets.filter((t) => t.status === "PENDING").length,
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
      return { tickets, stats };
    }

    return { tickets };
  } catch (error) {
    throw error;
  }
}
