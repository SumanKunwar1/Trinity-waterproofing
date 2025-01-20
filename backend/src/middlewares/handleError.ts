import { Request, Response, NextFunction } from "express";
import { DeleteFileFromFiles } from "../config/deleteImages";
import multer from "multer";

function handleError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(`Error while ✌ ${req.originalUrl} ✌`);
  if (err instanceof multer.MulterError) {
    const message = err.field || "File upload error";
    DeleteFileFromFiles(req);
    res.status(400).json({ error: message });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
}

export { handleError };
