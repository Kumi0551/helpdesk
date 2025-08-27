import { Priority } from "@prisma/client";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const priorityMap = {
    [Priority.LOW]: "bg-green-100 text-green-800 font-semibold",
    [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800 font-semibold",
    [Priority.HIGH]: "bg-orange-100 text-orange-800 font-semibold",
    [Priority.CRITICAL]: "bg-red-100 text-red-800 font-semibold",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityMap[priority]}`}
    >
      {priority.toLowerCase()}
    </span>
  );
}
