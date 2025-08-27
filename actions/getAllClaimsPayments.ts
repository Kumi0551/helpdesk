import prisma from "@/libs/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { NextResponse } from "next/server";

export async function getAllClaimsPayments() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw NextResponse.error;
  }
  try {
    const payments = await prisma.payment.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments;
  } catch {
    return null;
  }
}
