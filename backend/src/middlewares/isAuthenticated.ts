import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const isAuthenticated = (req: Request, res: Response, next: NextFunction):void => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Unauthorized access' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: string };
    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access' });
    return;
  }
};

export { isAuthenticated };
