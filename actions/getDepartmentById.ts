//get department by id

import prisma from "@/libs/prismadb";
//import { NextResponse } from "next/server";

export async function getDepartmentById(departmentId: string) {
  try {
    if (!departmentId) {
      throw new Error("Department ID is required");
    }

    return await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            hashedPassword: true,
            departmentId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        tickets: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
