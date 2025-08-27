"use client";

import { ReportType, ReportData } from "@/types";
import { format } from "date-fns";
import StatCard from "../Dashboard/StatCard";
//import { Priority, Status } from "@prisma/client";
import TableHeader from "../ui/TableHeader";
import TableCell from "../ui/TableCell";
import StatusBadge from "../ui/StatusBadge";
import PriorityBadge from "../ui/PriorityBadge";

interface ReportResultsProps {
  reportData: ReportData;
  reportType: ReportType;
}

const ReportResults: React.FC<ReportResultsProps> = ({
  reportData,
  reportType,
}) => {
  const formatDate = (date: Date) => format(new Date(date), "MMM dd, yyyy");

  return (
    <div className="shadow rounded-lg w-full flex flex-col overflow-hidden">
      {reportType === "overview" && reportData.stats && (
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Summary Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Tickets" value={reportData.stats.total} />
            <StatCard title="Open Tickets" value={reportData.stats.open} />
            <StatCard
              title="Resolved Tickets"
              value={reportData.stats.resolved}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Subject</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Created By</TableHeader>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.tickets.map((ticket) => (
              <tr key={ticket.id}>
                <TableCell>#{ticket.id.slice(0, 6)}</TableCell>
                <TableCell> {ticket.subject.slice(0, 20)}</TableCell>
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

export default ReportResults;
