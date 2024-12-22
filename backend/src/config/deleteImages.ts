import fs from "fs/promises";
import { Request } from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

console.log("image upload folder name", process.env.IMAGE_UPLOAD);
const UPLOADS = process.env.IMAGE_UPLOAD || "uploads";
const uploadFolder = path.join(__dirname, "../../../", UPLOADS);

export const deleteImages = async (images: string[]): Promise<void> => {
  const filesToDelete: string[] = images.map((image) =>
    path.join(uploadFolder, image)
  );

  try {
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((file) => fs.unlink(file)));
      console.log("Successfully deleted files:", filesToDelete);
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

export const deleteProductImages = async (req: Request): Promise<void> => {
  const filesToDelete: string[] = [];

  if (req.body.productImage) {
    filesToDelete.push(req.body.productImage);
  }

  if (req.body.images && Array.isArray(req.body.images)) {
    req.body.images.forEach((image: string) => {
      filesToDelete.push(image);
    });
  }

  await deleteImages(filesToDelete);
};
