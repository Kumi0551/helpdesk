"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AcceptTicketButtonProps {
  ticketId: string;
  currentStatus: "OPEN" | "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  currentUserId: string;
  assignedToId: string | null;
  departmentId: string;
  currentUserDepartmentId: string;
  createdById: string;
  ticketSubject: string;
}

const AcceptTicketButton: React.FC<AcceptTicketButtonProps> = ({
  ticketId,
  currentStatus,
  currentUserId,
  assignedToId,
  departmentId,
  currentUserDepartmentId,
  createdById,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isCreator = currentUserId === createdById;
  if (isCreator) {
    return null;
  }

  const canInteract = departmentId === currentUserDepartmentId;
  if (!canInteract) {
    return null;
  }

  const handleAccept = async () => {
    setIsLoading(true);

    axios
      .post(`/api/tickets/${ticketId}/accept`)
      .then(() => {
        toast.success("Ticket accepted successfully!");
        router.refresh();
      })
      .catch(() => toast.error("Failed to accept ticket"))
      .finally(() => setIsLoading(false));
  };

  const getButtonState = () => {
    if (currentStatus === "OPEN" || currentStatus === "PENDING") {
      const isAssignedToSomeoneElse =
        assignedToId && assignedToId !== currentUserId;
      return {
        label: isLoading ? "Processing..." : "Accept Ticket",
        disabled: isLoading || isAssignedToSomeoneElse,
        className: isLoading
          ? "bg-blue-300 text-white cursor-wait"
          : isAssignedToSomeoneElse
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white",
        tooltip: isAssignedToSomeoneElse
          ? "Ticket is already assigned to someone else"
          : undefined,
      };
    }

    return {
      label: currentStatus === "RESOLVED" ? "Resolved" : "Closed",
      disabled: true,
      className: "bg-gray-300 text-gray-500 cursor-not-allowed",
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="relative">
      <button
        onClick={handleAccept}
        //disabled={buttonState.disabled}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${buttonState.className}`}
        title={buttonState.tooltip}
      >
        {buttonState.label}
      </button>
    </div>
  );
};

export default AcceptTicketButton;
