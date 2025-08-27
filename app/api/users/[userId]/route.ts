import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { Role } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();
    const { userId } = resolvedParams;
    const body = await request.json();

    if (
      !currentUser ||
      (currentUser.id !== userId && currentUser.role !== Role.SUPER_ADMIN)
    ) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const { name, email, departmentId, role, currentPassword, newPassword } =
      body;

    if (currentUser.role === Role.SUPER_ADMIN) {
      // Admin updates - require all fields except password
      if (!name || !email || !departmentId || !role) {
        return NextResponse.json({ error: "Missing required fields" });
      }
    } else {
      // Self-updates - only require name
      if (!name) {
        return NextResponse.json({ error: "Name is required" });
      }
    }

    // Password change validation (only for self-updates)
    if (currentPassword && currentUser.id === userId) {
      if (!currentUser.hashedPassword) {
        return NextResponse.json({ error: "Invalid current password" });
      }

      const isValid = await bcrypt.compare(
        currentPassword,
        currentUser.hashedPassword
      );

      if (!isValid) {
        return NextResponse.json({ error: "Invalid current password" });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({
          error: "New password must be at least 6 characters",
        });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      ...(currentUser.role === Role.SUPER_ADMIN && {
        email,
        departmentId,
        role,
      }),
      ...(newPassword && {
        hashedPassword: await bcrypt.hash(newPassword, 10),
      }),
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ error: "An error occurred" });
  }
}
