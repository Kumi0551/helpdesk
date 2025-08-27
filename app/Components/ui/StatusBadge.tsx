import React from "react";
import { Status } from "@prisma/client";
import { statusColors } from "@/types";

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;
