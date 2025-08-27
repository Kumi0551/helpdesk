//get department users

import prisma from "@/libs/prismadb";
import { Role } from "@prisma/client";

export interface DepartmentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

export async function getDepartmentUsers(
  departmentId: string
): Promise<DepartmentUser[]> {
  if (!departmentId) return [];

  try {
    const users = await prisma.user.findMany({
      where: {
        departmentId,
        isActive: true, // Only active users
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name || "Unknown",
      email: user.email || "No email",
      role: user.role,
      image: user.image || null,
    }));
  } catch {
    throw new Error();
  }
}
