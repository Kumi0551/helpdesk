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

    // Prepare update data
    type UpdateUserData = {
      name?: string;
      email?: string;
      departmentId?: string;
      role?: Role;
      hashedPassword?: string;
      passwordLastChanged?: Date;
    };

    const updateData: UpdateUserData = {};

    // Handle name update
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" });
      }
      updateData.name = name.trim();
    }

    // Handle admin updates (only SUPER_ADMIN can update these)
    if (currentUser.role === Role.SUPER_ADMIN) {
      if (email !== undefined) {
        if (!email.trim()) {
          return NextResponse.json({ error: "Email cannot be empty" });
        }
        updateData.email = email.trim();
      }

      if (departmentId !== undefined) {
        updateData.departmentId = departmentId;
      }

      if (role !== undefined) {
        updateData.role = role;
      }
    }

    // Handle password changes
    if (currentPassword !== undefined || newPassword !== undefined) {
      if (currentUser.id !== userId) {
        return NextResponse.json({
          error: "Cannot change another user's password",
        });
      }

      // Both password fields must be provided
      if (!currentPassword || !newPassword) {
        return NextResponse.json({
          error: "Both current and new password are required",
        });
      }

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

      if (newPassword.length < 6) {
        return NextResponse.json({
          error: "New password must be at least 6 characters",
        });
      }

      updateData.hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.passwordLastChanged = new Date();
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No changes provided" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Don't return the hashed password
    const { hashedPassword, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
