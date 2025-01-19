import jwt from "jsonwebtoken";
import { httpMessages } from "../middlewares";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = "1d"; // Access token expiry
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token expiry

export const generateAccessToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Generate Refresh Token
export const generateRefreshToken = (
  userId: string,
  email: string,
  role: string
): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw httpMessages.UNAUTHORIZED_INVALID_TOKEN;
  }
};

export const generatePasswordResetToken = (
  userId: string,
  email: string,
  role: string
): string => {
  const RESET_TOKEN_EXPIRY = "1h";
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRY,
  });
};
