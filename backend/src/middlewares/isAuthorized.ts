import { Request, Response, NextFunction } from 'express';
import { httpMessages } from '../middlewares';

const isAuthorized = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.email) {
      res.status(401).json({ message: httpMessages.UNAUTHORIZED });
      return;
    }

    if (req.role !== requiredRole) {
      res.status(403).json({ message: httpMessages.FORBIDDEN });
      return;
    }

    next();
  };
};

export { isAuthorized };
