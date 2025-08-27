"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CloseTicketButtonProps {
  ticketId: string;
  currentUserId: string;
  createdById: string;
  assignedToId: string | null;
  status: string;
  disabled?: boolean;
}

const CloseTicketButton: React.FC<CloseTicketButtonProps> = ({
  ticketId,
  currentUserId,
  createdById,
  assignedToId,
  status,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/tickets/${ticketId}/close`);

      if (response.status === 200) {
        toast.success("Ticket closed successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Close error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if:
  // 1. Ticket is in RESOLVED status
  // 2. Current user is either the creator or the assigned user
  const isResolved = status === "RESOLVED";
  const isCreatorOrAssigned =
    currentUserId === createdById || currentUserId === assignedToId;
  const shouldShowButton = isResolved && isCreatorOrAssigned;
  const isDisabled = disabled || isLoading || !shouldShowButton;

  if (!shouldShowButton) {
    return null;
  }

  return (
    <button
      onClick={handleClose}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }
        ${isLoading ? "cursor-wait" : ""}
      `}
      aria-label="Close ticket"
    >
      {isLoading ? "Processing..." : "Close Ticket"}
    </button>
  );
};

export default CloseTicketButton;
