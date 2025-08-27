"use client";

import { Priority, Status } from "@prisma/client";
import { format } from "date-fns";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "../Button";
//import UserAvatar from "../UserAvatar";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  assignedTo: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  acceptedBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  department: {
    name: string;
  };
  comments: {
    createdAt: Date;
  }[];
}

interface TicketCardProps {
  ticket: Ticket;
  currentUserId: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, currentUserId }) => {
  const router = useRouter();
  //const lastUpdated = ticket.comments[0]?.createdAt || ticket.createdAt;

  const canOpenTicket =
    ticket.status === "PENDING" && ticket.createdBy.id !== currentUserId;

  const handleOpenTicket = async () => {
    try {
      if (!canOpenTicket) {
        toast.error("You can only open tickets created by others");
        return;
      }

      await axios.patch(`/api/tickets/${ticket.id}/status`, {
        status: "OPEN",
      });

      toast.success("Ticket opened successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to open ticket");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              {ticket.department.name}
            </span>
          </div>
        </div>

        <div className="mt-2 block">
          <h3 className="text-lg font-medium text-gray-900">
            {ticket.subject}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {ticket.description}
          </p>
        </div>

        <div className="mt-4 pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-300">
          {/* <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-2">
                Created by:
              </span>
              <UserAvatar src={ticket.createdBy.image} />
              <span className="ml-2 text-sm text-gray-900">
                {ticket.createdBy.name || ticket.createdBy.email}
              </span>
            </div>

            {ticket.acceptedBy ? (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">
                  Accepted by:
                </span>
                <UserAvatar src={ticket.acceptedBy.image} />
                <span className="ml-2 text-sm text-gray-900">
                  {ticket.acceptedBy.name || ticket.acceptedBy.email}
                </span>
              </div>
            ) : ticket.assignedTo ? (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">
                  Assigned to:
                </span>
                <UserAvatar src={ticket.assignedTo.image} />
                <span className="ml-2 text-sm text-gray-900">
                  {ticket.assignedTo.name || ticket.assignedTo.email}
                </span>
              </div>
            ) : null}
          </div> */}

          <div className="flex items-center space-x-4">
            {/* <span className="text-sm text-gray-500">
              Last updated: {format(new Date(lastUpdated), "MMM d, yyyy")}
            </span> */}
            <span className="text-sm text-gray-500">
              {" "}
              Created at:
              {format(new Date(ticket.createdAt), "MMM d, yyyy")}
            </span>
            {canOpenTicket ? (
              <Button onClick={handleOpenTicket} label="Open Ticket" />
            ) : (
              <Link
                href={`/tickets/${ticket.id}`}
                className="px-4 py-1 lg:py-3 text-xs border border-purple-800 text-purple-800 rounded-md hover:bg-purple-50 md:text-sm font-normal"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
