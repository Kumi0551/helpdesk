import prisma from "./prismadb";
import { hashPassword, verifyPassword } from "./auth";

const PASSWORD_HISTORY_LIMIT = 5; // Number of previous passwords to check
const MIN_PASSWORD_LENGTH = 6;
const PASSWORD_EXPIRY_DAYS = 90;

export const validatePassword = (
  password: string
): { isValid: boolean; message: string } => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  // Check for complexity requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }

  return { isValid: true, message: "Password meets requirements" };
};

export const checkPasswordHistory = async (
  userId: string,
  newPassword: string
): Promise<boolean> => {
  const passwordHistory = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: PASSWORD_HISTORY_LIMIT,
  });

  for (const record of passwordHistory) {
    if (await verifyPassword(newPassword, record.hashedPassword)) {
      return false;
    }
  }

  return true;
};

export const updatePassword = async (userId: string, newPassword: string) => {
  const hashedNew = await hashPassword(newPassword);

  // Add new password to history
  await prisma.passwordHistory.create({
    data: {
      userId,
      hashedPassword: hashedNew,
    },
  });

  // Update user's password
  await prisma.user.update({
    where: { id: userId },
    data: {
      hashedPassword: hashedNew,
      passwordLastChanged: new Date(),
    },
  });
};

export const isPasswordExpired = (lastChanged: Date | null): boolean => {
  if (!lastChanged) return true;

  const expiryDate = new Date(lastChanged);
  expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);

  return new Date() > expiryDate;
};
