import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { validatePassword } from "@/libs/password";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, password, role, departmentId } = body;

  // Validate password complexity
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return NextResponse.json(
      { error: passwordValidation.message },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
      department: { connect: { id: departmentId } },
    },
  });

  return NextResponse.json(user);
}
