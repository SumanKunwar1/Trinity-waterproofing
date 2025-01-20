import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares"; // Assuming this contains your error messages
import { verifyToken } from "../config/tokenUtils";
const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(httpMessages.UNAUTHORIZED_NO_TOKEN);
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded.email) {
      return next(httpMessages.UNAUTHORIZED_NO_DATA);
    }
    if (!decoded.role) {
      return next(httpMessages.UNAUTHORIZED_NO_DATA);
    }
    req.email = decoded.email;
    req.role = decoded.role;
    console.log("User Authenticated!");
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(httpMessages.UNAUTHORIZED_TOKEN_EXPIRED);
    }
    return next(httpMessages.UNAUTHORIZED_INVALID_TOKEN);
  }
};

export { isAuthenticated };
