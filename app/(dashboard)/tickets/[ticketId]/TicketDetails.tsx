"use client";

import { Ticket, User, Priority, Status } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Button from "@/app/Components/Button";
import { PriorityBadge } from "@/app/Components/tickets/PriorityBadge";
import { StatusBadge } from "@/app/Components/tickets/StatusBadge";
import CommentForm from "./CommentForm";
import Heading from "@/app/Components/Heading";
import AcceptTicketButton from "@/app/Components/AcceptTicketButton";
import ResolveTicketButton from "@/app/Components/ResolveTicketButton ";
import CloseTicketButton from "@/app/Components/CloseTicketButton";
import UserAvatar from "@/app/Components/UserAvatar";
import AssignTicketForm from "@/app/Components/AssignTicketForm";
import CommentsSection from "@/app/Components/tickets/CommentsSection";

interface TicketDetailsProps {
  ticket: Ticket & {
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
      id: string;
      name: string;
    };
    comments: {
      id: string;
      content: string;
      createdAt: Date;
      createdBy: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
      };
    }[];
  };
  currentUser: User;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  currentUser,
}) => {
  const router = useRouter();

  const isAdmin =
    currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN";

  const canAssignTicket =
    isAdmin &&
    ticket.departmentId === currentUser.departmentId &&
    !ticket.assignedTo &&
    !ticket.acceptedBy;

  const canResolveTicket =
    ticket.assignedTo?.id ||
    (ticket.acceptedBy?.id === currentUser.id &&
      ticket.status === "IN_PROGRESS");

  const isInMyDepartment = currentUser.departmentId === ticket.departmentId;
  const canInteractWithTicket =
    isInMyDepartment ||
    currentUser.role === "SUPER_ADMIN" ||
    currentUser.role === "ADMIN";

  return (
    <div className="py-8 sm:px-6 lg:px-8 ">
      <div className="overflow-hidden">
        <div className="py-4">
          <div className="flex justify-between items-start">
            <div className="mb-4 flex items-center space-x-4">
              <PriorityBadge priority={ticket.priority as Priority} />
              <StatusBadge status={ticket.status as Status} />
            </div>
            <div className="w-[72px]">
              <button
                onClick={() => router.push("/tickets")}
                className="cursor-pointer text-white font-semibold py-1 px-2 rounded"
              >
                <span className="text-sm text-gray-900">Back</span>
              </button>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Heading title={ticket.subject} />
          <p className="mt-2 lg:text-lg whitespace-pre-line">
            {ticket.description}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <p className="text-sm font-medium text-slate-800">Created By:</p>
            <div className="flex items-center gap-1">
              <UserAvatar src={ticket.createdBy.image} />
              <span className="text-sm text-gray-900">
                {ticket.createdBy.name || ticket.createdBy.email}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}
          </p>
        </div>

        <div className="py-4 grid gap-4 md:grid-cols-2 border-b border-gray-200 items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <p className="text-sm font-medium text-slate-800">
                Assigned/Accepted By:
              </p>
              <div className="flex items-center gap-1">
                {ticket.assignedTo ? (
                  <>
                    <UserAvatar src={ticket.assignedTo.image} />
                    <span className="text-sm text-gray-900">
                      {ticket.assignedTo.name || ticket.assignedTo.email}
                    </span>
                  </>
                ) : ticket.acceptedBy ? (
                  <>
                    <UserAvatar src={ticket.acceptedBy.image} />
                    <span className="text-sm text-gray-900">
                      {ticket.acceptedBy.name || ticket.acceptedBy.email}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-slate-800">Unassigned</span>
                )}
              </div>
            </div>
            {ticket.acceptedAt && !ticket.assignedTo && (
              <p className="text-xs text-gray-500">
                Accepted:{" "}
                {format(new Date(ticket.acceptedAt), "MMM d, yyyy h:mm a")}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
            <span className="text-sm font-medium text-slate-800">
              Department:
            </span>
            <span className="text-sm text-slate-900">
              {ticket.department.name}
            </span>
          </div>
        </div>

        {/* Action Buttons Section */}
        {canInteractWithTicket && (
          <div className="py-4 border-b border-gray-200 flex flex-wrap gap-4">
            <AcceptTicketButton
              ticketId={ticket.id}
              currentStatus={ticket.status}
              currentUserId={currentUser.id}
              assignedToId={ticket.assignedTo?.id || null}
              departmentId={ticket.departmentId}
              currentUserDepartmentId={currentUser.departmentId}
              createdById={ticket.createdBy.id}
              ticketSubject={ticket.subject}
            />

            {canResolveTicket && (
              <ResolveTicketButton
                ticketId={ticket.id}
                assignedToId={ticket.assignedTo?.id || null}
                acceptedById={ticket.acceptedBy?.id || null}
                currentUserId={currentUser.id}
                currentStatus={ticket.status}
                disabled={!canResolveTicket}
              />
            )}

            <CloseTicketButton
              ticketId={ticket.id}
              currentUserId={currentUser.id}
              createdById={ticket.createdBy.id}
              assignedToId={ticket.assignedTo?.id || null}
              status={ticket.status}
            />
          </div>
        )}

        <AssignTicketForm
          ticketId={ticket.id}
          currentUserDepartmentId={currentUser.departmentId}
          canAssignTicket={canAssignTicket}
        />

        <div className="py-4">
          <CommentsSection comments={ticket.comments} />
          <CommentForm ticketId={ticket.id} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
