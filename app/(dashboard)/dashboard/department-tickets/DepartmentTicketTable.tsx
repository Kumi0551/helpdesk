"use client";

import { DateRangeFilter } from "@/app/Components/filters/DateRangeFilter";
import PriorityFilter from "@/app/Components/filters/PriorityFilter";
import StatusFilter from "@/app/Components/filters/StatusFilter";
import { Priority, Status } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";

interface DepartmentTicketTableProps {
  tickets: Ticket[];
}

interface Ticket {
  id: string;
  subject: string;
  priority: Priority;
  status: Status;
  assignedTo: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  createdBy: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  acceptedBy: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  department: {
    name: string;
  };
  _count: {
    comments: number;
  };
  createdAt: Date;
}

const DepartmentTicketTable: React.FC<DepartmentTicketTableProps> = ({
  tickets,
}) => {
  const statusColors: Record<Status, string> = {
    OPEN: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-purple-100 text-purple-800",
    CLOSED: "bg-slate-100 text-slate-800",
  };

  const priorityColors: Record<Priority, string> = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
  };

  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [dateRange, setDateRange] = useState("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFilterChange = useCallback(() => {
    let result = [...tickets];

    const now = new Date();
    if (dateRange === "today") {
      const today = new Date(now.setHours(0, 0, 0, 0));
      result = result.filter((ticket) => new Date(ticket.createdAt) >= today);
    } else if (dateRange === "this-week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      result = result.filter(
        (ticket) => new Date(ticket.createdAt) >= startOfWeek
      );
    } else if (dateRange === "this-month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter(
        (ticket) => new Date(ticket.createdAt) >= startOfMonth
      );
    }

    if (priority !== "all") {
      result = result.filter((ticket) => ticket.priority === priority);
    }

    if (status !== "all") {
      result = result.filter((ticket) => ticket.status === status);
    }

    setFilteredTickets(result);
  }, [tickets, dateRange, priority, status]);

  // Update filtered tickets when any filter changes
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div>
      <div className="my-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <FaFilter className="text-purple-800" />
              Filter Tickets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DateRangeFilter value={dateRange} onChange={setDateRange} />
              <PriorityFilter value={priority} onChange={setPriority} />
              <StatusFilter value={status} onChange={setStatus} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="bg-white hover:bg-slate-100 p-4 rounded-lg shadow border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900">
                {/*   <Link
                  href={`/tickets/${ticket.id}`}
                  className="text-purple-600 hover:text-purple-900 hover:underline"
                > */}
                {ticket.subject}
                {/* </Link> */}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[ticket.status]
                }`}
              >
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-2 text-sm text-slate-500">
              <p>
                <span className="font-medium">Priority:</span>{" "}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[ticket.priority]
                  }`}
                >
                  {ticket.priority}
                </span>
              </p>

              <div>
                {ticket.assignedTo ? (
                  <div className="flex items-center">
                    <p className="text-slate-500">Assigned To</p>
                    <span className="ml-2 text-gray-900">
                      {ticket.assignedTo.name || ticket.assignedTo.email}
                    </span>
                  </div>
                ) : ticket.acceptedBy ? (
                  <div className="flex items-center">
                    <p className="text-slate-500">Accepted By</p>
                    <span className="ml-2 text-gray-900">
                      {ticket.acceptedBy.name || ticket.acceptedBy.email}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-800">Pending</span>
                )}
              </div>

              <p>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(ticket.createdAt)}
              </p>
              <p>
                <span className="font-medium">Comments:</span>{" "}
                {ticket._count.comments}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentTicketTable;
