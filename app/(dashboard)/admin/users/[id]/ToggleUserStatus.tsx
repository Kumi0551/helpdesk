"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ToggleUserStatusProps {
  userId: string;
  isActive: boolean;
  isCurrentUser: boolean;
}

const ToggleUserStatus = ({
  userId,
  isActive,
  isCurrentUser,
}: ToggleUserStatusProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = async () => {
    if (isCurrentUser) {
      toast.error("Cannot deactivate your own account");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to toggle user status");
      }

      toast.success(
        `User ${isActive ? "deactivated" : "activated"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={isLoading || isCurrentUser}
      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }
        ${(isLoading || isCurrentUser) && "opacity-50 cursor-not-allowed"}
      `}
    >
      {isActive ? (
        <FaToggleOn className="mr-2" size={16} />
      ) : (
        <FaToggleOff className="mr-2" size={16} />
      )}
      {isLoading
        ? "Processing..."
        : isActive
        ? "Deactivate User"
        : "Activate User"}
    </button>
  );
};

export default ToggleUserStatus;
