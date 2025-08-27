import {
  User,
  Ticket,
  Department,
  Comment,
  Priority,
  Status,
  Role,
} from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: Date | null;
};

export type FullTicket = Ticket & {
  createdBy: Pick<User, "id" | "name" | "email">;
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  acceptedBy: Pick<User, "id" | "name" | "email"> | null;
  department: Pick<Department, "id" | "name">;
  comments: (Comment & {
    createdBy: Pick<User, "id" | "name">;
  })[];
};

export interface TicketWithDetails extends Ticket {
  createdBy: User;
  assignedTo: User | null;
  acceptedBy: User | null;
  department?: { id: string; name: string };
  comments: Comment[];
}

export interface DashboardData {
  stats: {
    total: number;
    pending: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    byPriority: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  };
  recentTickets: TicketWithDetails[];
}

export interface ReportFilters {
  reportType: ReportType;
  departmentId?: string;
  userId?: string;
  status?: FilterStatus;
  priority?: FilterPriority;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface ReportData {
  tickets: FullTicket[];
  stats?: ReportStats;
}

export interface ReportStats {
  total: number;
  open: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export const statusColors: Record<Status, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export const priorityColors: Record<Priority, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

export type ReportType = "overview" | "department" | "user";
export type FilterStatus = Status | "all";
export type FilterPriority = Priority | "all";
export type StatusColorsType = Record<Status, string>;
export type PriorityColorsType = Record<Priority, string>;
