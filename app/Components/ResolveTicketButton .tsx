"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ResolveTicketButtonProps {
  ticketId: string;
  assignedToId: string | null;
  acceptedById: string | null;
  currentUserId: string;
  currentStatus: string;
  disabled?: boolean;
}

const ResolveTicketButton: React.FC<ResolveTicketButtonProps> = ({
  ticketId,
  assignedToId,
  acceptedById,
  currentUserId,
  currentStatus,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResolve = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/tickets/${ticketId}/resolve`);

      if (response.status === 200) {
        toast.success("Ticket marked as resolved!");
        router.refresh();
      }
    } catch {
      toast.error("Error marking ticket as resolved");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if:
  // 1. Current user is assigned to this ticket
  // 2. Ticket is in IN_PROGRESS status
  const isAssignedToCurrentUser = assignedToId === currentUserId;
  const isAcceptedByCurrentUser = acceptedById === currentUserId;
  const isInProgress = currentStatus === "IN_PROGRESS";
  const shouldShowButton =
    isAssignedToCurrentUser || (isAcceptedByCurrentUser && isInProgress);
  const isDisabled = disabled || isLoading || !shouldShowButton;

  if (!shouldShowButton) {
    return null;
  }

  return (
    <button
      onClick={handleResolve}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-purple-800 hover:bg-purple-900 text-white"
        }
        ${isLoading ? "cursor-wait" : ""}
      `}
      aria-label="Mark ticket as resolved"
    >
      {isLoading ? "Processing..." : "Mark as Resolved"}
    </button>
  );
};

export default ResolveTicketButton;
