import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";
import {
  generateTwoFactorSecret,
  generateTwoFactorQR,
  verifyTwoFactorToken,
  enableTwoFactor,
  disableTwoFactor,
} from "@/libs/twoFactor";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { action, token } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    switch (action) {
      case "setup":
        const secret = generateTwoFactorSecret();
        const qrCode = await generateTwoFactorQR(user.email!, secret);

        // Store secret temporarily (you might want to use a temporary storage solution)
        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorSecret: secret },
        });

        return NextResponse.json({ qrCode });

      case "verify":
        if (!user.twoFactorSecret) {
          return new NextResponse("2FA not set up", { status: 400 });
        }

        const isValid = verifyTwoFactorToken(token, user.twoFactorSecret);
        if (!isValid) {
          return new NextResponse("Invalid token", { status: 400 });
        }

        await enableTwoFactor(user.id, user.twoFactorSecret);
        return NextResponse.json({ success: true });

      case "disable":
        await disableTwoFactor(user.id);
        return NextResponse.json({ success: true });

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error: unknown) {
    console.error("2FA error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
