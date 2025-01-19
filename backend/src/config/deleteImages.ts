import { Request } from "express";
import fs from "fs/promises";
import path from "path";
import { uploadFolder } from "./uploadConstants";

interface FilesField {
  [key: string]: Express.Multer.File[];
}

export const deleteImages = async (images: string[]): Promise<void> => {
  //console.log("Files to delete:", images);
  const filesToDelete: string[] = images.map((image) =>
    path.join(uploadFolder, image)
  );

  try {
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((file) => fs.unlink(file)));
      ////console.log("Successfully deleted files:", filesToDelete);
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

  if (req.body.image && Array.isArray(req.body.image)) {
    req.body.image.forEach((image: string) => {
      filesToDelete.push(image);
    });
  }

  await deleteImages(filesToDelete);
};

export const DeleteFileFromFiles = async (req: Request): Promise<void> => {
  const filesToDelete: string[] = [];

  const files = req.files as FilesField;
  //console.log(files, "uploaded by multer");
  if (files) {
    Object.keys(files).forEach((key) => {
      const fileArray = files[key];
      if (Array.isArray(fileArray)) {
        fileArray.forEach((file) => {
          filesToDelete.push(file.filename);
        });
      }
    });
  }

  await deleteImages(filesToDelete);
};
