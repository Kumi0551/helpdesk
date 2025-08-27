"use client";

import Link from "next/link";
import { TicketWithDetails } from "@/types";
import TableHeader from "../ui/TableHeader";
import TableCell from "../ui/TableCell";
import StatusBadge from "../ui/StatusBadge";
import PriorityBadge from "../ui/PriorityBadge";

interface RecentTicketsProps {
  tickets: TicketWithDetails[];
}

const RecentTickets: React.FC<RecentTicketsProps> = ({ tickets }) => {
  if (tickets.length === 0) {
    return <p className="text-gray-500 py-4">No recent tickets found</p>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full ">
      <div className="overflow-x-auto">
        {" "}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Created</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.slice(0, 4).map((ticket) => (
              <tr key={ticket.id}>
                <TableCell>#{ticket.id.substring(0, 6)}</TableCell>
                <TableCell>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-purple-600 hover:text-purple-900 hover:underline"
                  >
                    {ticket.subject.length > 40
                      ? `${ticket.subject.substring(0, 40)}...`
                      : ticket.subject}
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        href="/tickets"
        className="inline-flex w-full items-center justify-center px-4 py-2 lg:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-900 mt-2"
      >
        View all tickets...
      </Link>
    </div>
  );
};

export default RecentTickets;
