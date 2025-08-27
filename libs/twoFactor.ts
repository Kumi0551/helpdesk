import { authenticator } from "otplib";
import qrcode from "qrcode";
import prisma from "./prismadb";

export const generateTwoFactorSecret = () => {
  return authenticator.generateSecret();
};

export const generateTwoFactorQR = async (email: string, secret: string) => {
  const service = "Loyalty Helpdesk";
  const otpauth = authenticator.keyuri(email, service, secret);
  return await qrcode.toDataURL(otpauth);
};

export const verifyTwoFactorToken = (token: string, secret: string) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    return false;
  }
};

export const enableTwoFactor = async (userId: string, secret: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    },
  });
};

export const disableTwoFactor = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });
};
