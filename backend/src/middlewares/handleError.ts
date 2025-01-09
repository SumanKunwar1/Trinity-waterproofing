import { Request, Response, NextFunction } from "express";
import multer from "multer";

function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    const message = err.message || "File upload error";
    console.error("Multer error:", err);
    res.status(400).json({ error: message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err);
  res.status(statusCode).json({ error: message });
}

export { handleError };
