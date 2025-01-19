import { Request, Response, NextFunction } from "express";
import sharp, { FormatEnum } from "sharp";
import fs from "fs";
import path from "path";
import { httpMessages } from "../middlewares";
import { deleteProductImages } from "./deleteImages";
import { MAX_IMAGE_SIZE, uploadFolder } from "./uploadConstants";

const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath);
        ////console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }, 100);
  }
};

export const compressAndValidateImage = async (
  filePath: string,
  compressedFilePath: string,
  imageType: string
) => {
  try {
    //console.log("Starting compression and validation...", imageType);

    const validFormats: Record<string, keyof FormatEnum> = {
      ".jpeg": "jpeg",
      ".jpg": "jpeg",
      ".png": "png",
      ".webp": "webp",
      ".tiff": "tiff",
      ".avif": "avif",
      ".heif": "heif",
    };

    const format = validFormats[imageType.toLowerCase()];
    if (!format) {
      throw new Error(`Unsupported image type: ${imageType}`);
    }

    //console.log("Compressing the image...");
    await sharp(filePath)
      .resize()
      .toFormat(format, { quality: 50 })
      .toFile(compressedFilePath);

    //console.log("Compression successful. Validating file size...");
    const compressedStats = fs.statSync(compressedFilePath);

    if (compressedStats.size > MAX_IMAGE_SIZE) {
      throw new Error(
        `Compressed image exceeds maximum allowed size: ${compressedStats.size} bytes`
      );
    }

    //console.log("Image compression/validation completed successfully.");
    return compressedFilePath;
  } catch (err) {
    if (fs.existsSync(compressedFilePath)) {
      fs.unlinkSync(compressedFilePath);
      //console.log(`Deleted compressed file: ${compressedFilePath}`);
    }
    throw new Error(`Image compression/validation failed: ${err}`);
  }
};

export const compressUploadedImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const processImage = async (imageName: string) => {
      const originalFilePath = `${uploadFolder}/${imageName}`;
      const compressedFilePath = `${uploadFolder}/compressed-${imageName}`;
      const imageType = path.extname(imageName);

      const compressedPath = await compressAndValidateImage(
        originalFilePath,
        compressedFilePath,
        imageType
      );

      fs.renameSync(compressedPath, originalFilePath);
    };

    if (req.body.productImage) {
      //console.log("Processing productImage...");
      await processImage(req.body.productImage);
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        //console.log("Processing multiple images in req.body.image...");
        await Promise.all(
          req.body.image.map(async (imageName: string) => {
            await processImage(imageName);
          })
        );
      } else {
        //console.log("Processing single image in req.body.image...");
        await processImage(req.body.image);
      }
    }

    next();
  } catch (error: any) {
    console.error("Error in image compression middleware:", error);
    if (req.body.productImage) {
      deleteFile(`${uploadFolder}/${req.body.productImage}`);
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        req.body.image.forEach((imageName: string) =>
          deleteFile(`${uploadFolder}/${imageName}`)
        );
      } else {
        deleteFile(`${uploadFolder}/${req.body.image}`);
      }
    }
    deleteProductImages(req);
    return next(httpMessages.BAD_REQUEST(error));
  }
};
