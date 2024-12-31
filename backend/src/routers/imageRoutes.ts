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

    renderImage(filename, res);
  }
);

imageRouter.get(
  "/:folderName/:filename",
  (req: Request, res: Response, next: NextFunction) => {
    const { filename, folderName } = req.params;
    const pathName = path.join(folderName, filename);
    renderImage(pathName, res);
  }
);
export default imageRouter;

function renderImage(
  filename: string,
  res: Response<any, Record<string, any>>
) {
  const filePath = path.join(uploadFolder, filename);
  console.log(filePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: "File not found" });
    }

    const mimeType = mime.lookup(filename);

    if (!mimeType) {
      return res.status(415).json({ error: "Unsupported file type" });
    }

    res.setHeader("Content-Type", mimeType);

    res.sendFile(filePath);
  });
}
