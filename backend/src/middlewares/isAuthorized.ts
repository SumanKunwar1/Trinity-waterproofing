import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const isAuthorized = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.email) {
      return next(httpMessages.UNAUTHORIZED());
    }

    if (req.role !== requiredRole) {
      return next(
        httpMessages.FORBIDDEN(`Access to this resource by ${req.role}`)
      );
    }
    next();
  };
};

export { isAuthorized };
