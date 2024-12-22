import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { uploadFolder } from "../config/upload"; // Path to your upload folder

const imageRouter = Router();

imageRouter.get(
  "/:filename",
  (req: Request, res: Response, next: NextFunction) => {
    const { filename } = req.params;

    const imagePath = path.join(uploadFolder, filename);
    console.log(imagePath);

    fs.stat(imagePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.sendFile(imagePath);
    });
  }
);

export default imageRouter;
