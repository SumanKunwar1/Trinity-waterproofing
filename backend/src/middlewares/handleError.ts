import { Request, Response, NextFunction } from 'express';

function handleError(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || 500;  
  const message = err.message || "Internal Server Error"; 
  
  res.status(statusCode).json({ error: message }); 
}

export { handleError };
