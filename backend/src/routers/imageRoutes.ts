import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import { uploadFolder } from "../config/upload";

const imageRouter = Router();

imageRouter.get(
  "/:filename",
  (req: Request, res: Response, next: NextFunction) => {
    const { filename } = req.params;

    const filePath = path.join(uploadFolder, filename);
    console.log(filePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ error: "File not found" });
      }

      // Determine the MIME type based on file extension
      const mimeType = mime.lookup(filename);

      if (!mimeType) {
        return res.status(415).json({ error: "Unsupported file type" }); // 415: Unsupported Media Type
      }

      res.setHeader("Content-Type", mimeType); // Set the MIME type for the response

      // Send the file
      res.sendFile(filePath);
    });
  }
);

export default imageRouter;
