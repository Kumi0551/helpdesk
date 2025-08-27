import React from "react";
import { PaymentStatus } from "@prisma/client";
import { paymentStatusColors } from "@/types";

const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({
  status,
}) => {
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default PaymentStatusBadge;
