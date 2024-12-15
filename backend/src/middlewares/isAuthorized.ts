import { Request, Response, NextFunction } from 'express';
import { httpMessages } from '../middlewares';

const isAuthorized = (requiredRole: string): void => {
    (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user; 
  
      if (!user) {
        res.status(401).json({ message: httpMessages.UNAUTHORIZED });
        return;
      }
  
      if (user.role !== requiredRole) {
        res.status(403).json({ message: httpMessages.FORBIDDEN });
        return;
      }
  
      next(); 
    };
  };

export { isAuthorized }