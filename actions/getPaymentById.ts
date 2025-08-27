import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export default async function getPaymentById(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        initiatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        rejectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        completedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!payment) return null;

    return payment;
  } catch {
    throw NextResponse.error;
  }
}
