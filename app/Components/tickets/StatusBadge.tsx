import { Status } from "@prisma/client";
import { cn } from "@/libs/utils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClasses: Record<Status, string> = {
    OPEN: "bg-blue-100 text-blue-800 font-semibold",
    IN_PROGRESS: "bg-purple-100 text-purple-800 font-semibold",
    RESOLVED: "bg-green-100 text-green-800 font-semibold",
    CLOSED: "bg-gray-100 text-gray-800 font-semibold",
    PENDING: "bg-yellow-100 text-yellow-800 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusClasses[status],
        className
      )}
    >
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
