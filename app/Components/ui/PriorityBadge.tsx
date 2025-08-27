import React from "react";
import { Priority } from "@prisma/client";
import { priorityColors } from "@/types";

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[priority]}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
