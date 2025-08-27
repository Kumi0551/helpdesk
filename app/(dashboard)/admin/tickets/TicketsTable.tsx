"use client";

import { DateRangeFilter } from "@/app/Components/filters/DateRangeFilter";
import { DepartmentFilter } from "@/app/Components/filters/DepartmentFilter";
import PriorityFilter from "@/app/Components/filters/PriorityFilter";
import StatusFilter from "@/app/Components/filters/StatusFilter";
import PriorityBadge from "@/app/Components/ui/PriorityBadge";
import StatusBadge from "@/app/Components/ui/StatusBadge";
import TableCell from "@/app/Components/ui/TableCell";
import TableHeader from "@/app/Components/ui/TableHeader";
import { Priority, Status } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaComment, FaFilter } from "react-icons/fa";
import { format } from "date-fns";

interface TicketTableProps {
  tickets: Ticket[];
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  acceptedAt: Date | null;
  acceptedById: string | null;
  assignedToId: string | null;
  assignedTo?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  acceptedBy?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  department: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [department, setDepartment] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");

  // Get unique departments
  const departments = Array.from(
    new Set(tickets.map((ticket) => ticket.department.name))
  );

  const formatDate = (date: Date) => format(new Date(date), "MMM dd, yyyy");

  // Filter tickets based on all active filters
  const handleFilterChange = useCallback(() => {
    let result = [...tickets];

    if (department !== "all") {
      result = result.filter((ticket) => ticket.department.name === department);
    }

    // Apply date filter
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
  }, [tickets, department, dateRange, priority, status]);

  // Update filtered tickets when any filter changes
  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  return (
    <div className="mt-8">
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FaFilter className="text-purple-800" />
            Filter Tickets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DepartmentFilter
              options={departments}
              value={department}
              onChange={setDepartment}
            />
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <PriorityFilter value={priority} onChange={setPriority} />
            <StatusFilter value={status} onChange={setStatus} />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="my-4 text-sm text-slate-600">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>

      <div className="bg-white shadow rounded-lg p-6 w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Comments</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Created By</TableHeader>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <TableCell>#{ticket.id.slice(0, 6)}</TableCell>
                <TableCell>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-lg font-medium text-purple-600 hover:text-purple-900 hover:underline"
                  >
                    {ticket.subject.slice(0, 20)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FaComment className="text-slate-400 mr-1" />
                    <span>{ticket._count.comments} comments</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>{ticket.createdBy.name}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
