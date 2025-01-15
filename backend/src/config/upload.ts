import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { httpMessages } from "../middlewares";
import dotenv from "dotenv";
import { NextFunction } from "express";
dotenv.config();

console.log("image upload folder name:", process.env.IMAGE_UPLOAD);
const UPLOADS = process.env.IMAGE_UPLOAD || "uploads";

export const uploadFolder = path.join(__dirname, "../../../", UPLOADS);
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
const allowedVideoTypes = [
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/quicktime",
];
const MAX_IMAGE_SIZE = process.env.IMAGE_SIZE_LIMIT
  ? parseInt(process.env.IMAGE_SIZE_LIMIT) * 1024 * 1024
  : 1 * 1024 * 1024;
const MAX_VIDEO_SIZE = process.env.VIDEO_SIZE_LIMIT
  ? parseInt(process.env.VIDEO_SIZE_LIMIT) * 1024 * 1024
  : 10 * 1024 * 1024;
console.log(MAX_IMAGE_SIZE, MAX_VIDEO_SIZE);

const compressAndValidateImage = async (
  filePath: string,
  compressedFilePath: string
) => {
  try {
    console.log("Starting compression and validation...");
    console.log(`Original file path: ${filePath}`);
    console.log(`Compressed file path: ${compressedFilePath}`);
    console.log("Fetching image metadata...");
    await sharp(filePath)
      .toBuffer()
      .then((data) => {
        console.log("File is valid for compression");
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    console.log("Compressing the image...since it is correct metadata");
    await sharp(filePath)
      .resize()
      .jpeg({ quality: 50 })
      .toFile(compressedFilePath);

    console.log("Image compression completed. Checking file size...");
    const originalStats = fs.statSync(filePath);
    const compressedStats = fs.statSync(compressedFilePath);

    console.log(`Original file size: ${originalStats.size} bytes`);
    console.log(`Compressed file size: ${compressedStats.size} bytes`);

    if (compressedStats.size > MAX_IMAGE_SIZE) {
      console.error(
        `Compressed image exceeds maximum allowed size of ${
          MAX_IMAGE_SIZE / (1024 * 1024)
        } MB. Deleting compressed file...`
      );
      fs.unlinkSync(compressedFilePath); // Delete compressed file if too large
      throw httpMessages.BAD_REQUEST(
        `Compressed image exceeds the maximum size of ${
          MAX_IMAGE_SIZE / (1024 * 1024)
        } MB.`
      );
    }

    console.log("Deleting original uncompressed file...");

    console.log("Compression and validation completed successfully.");
    return compressedFilePath;
  } catch (err) {
    throw httpMessages.BAD_REQUEST(
      `Image compression/validation failed: ${err || "Unknown error"}`
    );
  }
};

// Add fileFilter to enforce file type restrictions
const fileFilter = (req: any, file: any, cb: any) => {
  console.log("Received file:", file);

  if (file.fieldname === "productImage" || file.fieldname === "image") {
    if (allowedImageTypes.includes(file.mimetype)) {
      console.log(`Allowed file type: ${file.mimetype}`);
      cb(null, true);
    } else {
      console.error(
        `Invalid file type for ${file.fieldname}: ${file.mimetype}`
      );
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          `${file.fieldname}: Invalid file type. Allowed types are JPEG, PNG, JPG.`
        )
      );
    }
  } else if (file.fieldname === "video") {
    if (allowedVideoTypes.includes(file.mimetype)) {
      console.log(`Allowed video file type: ${file.mimetype}`);
      cb(null, true);
    } else {
      console.error(
        `Invalid video file type for ${file.fieldname}: ${file.mimetype}`
      );
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          `${file.fieldname}: Invalid video file type. Allowed types are MP4, AVI, MOV, QUICKTIME`
        )
      );
    }
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Unexpected field name ${file.fieldname}.`
      )
    );
  }
};

const storage: multer.StorageEngine = multer.diskStorage({
  destination: async (req: any, file: any, cb: any) => {
    try {
      console.log("Uploading file...");
      console.log("Upload folder path:", uploadFolder);
      cb(null, uploadFolder); // Save to the upload folder
    } catch (err) {
      console.error("Error in destination callback:", err);
      cb(err);
    }
  },
  filename: async (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalFilePath = path.join(
      uploadFolder,
      uniqueSuffix + path.extname(file.originalname)
    );
    const compressedFilePath = path.join(
      uploadFolder,
      "compressed-" + uniqueSuffix + path.extname(file.originalname)
    );

    console.log("Generated file paths:");
    console.log(`Original file path: ${originalFilePath}`);
    console.log(`Compressed file path: ${compressedFilePath}`);

    // Save the file temporarily
    cb(null, uniqueSuffix + path.extname(file.originalname));

    // Add a delay to ensure the file is completely written
    process.nextTick(async () => {
      console.log("Initiating compression/validation for the uploaded file...");

      try {
        // Check if the original file exists before proceeding
        if (!fs.existsSync(originalFilePath)) {
          throw new Error(`Input file is missing: ${originalFilePath}`);
        }

        console.log("File exists. Starting compression and validation...");
        await compressAndValidateImage(originalFilePath, compressedFilePath);

        console.log("Compression completed. Renaming compressed file...");
        fs.renameSync(compressedFilePath, originalFilePath);
        console.log(
          `Successfully renamed compressed file to original: ${originalFilePath}`
        );
      } catch (err) {
        console.error("Error during file compression/validation:", err);

        // Delete temporary files on error
        if (fs.existsSync(originalFilePath)) {
          console.log(`Deleting original file: ${originalFilePath}`);
          fs.unlinkSync(originalFilePath);
        }
        if (fs.existsSync(compressedFilePath)) {
          console.log(`Deleting compressed file: ${compressedFilePath}`);
          fs.unlinkSync(compressedFilePath);
        }

        // Propagate the error to multer
        cb(
          new multer.MulterError(
            "LIMIT_FILE_SIZE",
            `Compression/Validation failed: ${err}`
          )
        );
      }
    });
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// This middleware exclusively for product file uploads
export const uploadMiddleware = upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "image", maxCount: 25 },
]);

// This one for all other images
export const imageUploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
]);

export const sliderUploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export const appendSliderDataToBody = (req: any, res: any, next: Function) => {
  // Handle image files
  if (req.files && req.files["image"]) {
    // If there's an image uploaded, assign the filename to req.body.image
    console.log("Added image to body:", req.files["image"][0].filename); // Log the image file added
    req.body.image = req.files["image"][0].filename;
  }

  // Handle video files
  if (req.files && req.files["video"]) {
    // If there's a video uploaded, assign the filename to req.body.video
    console.log("Added video to body:", req.files["video"][0].filename); // Log the video file added
    req.body.video = req.files["video"][0].filename;
  }

  console.log("Updated Request Body (appendSliderDataToBody):", req.body); // Log final request body
  next();
};

export const appendFileDataToBody = (req: any, res: any, next: Function) => {
  console.log(
    "product image to append in here:",
    req.files["productImage"] && req.files["productImage"].length
  );
  console.log(req.files["image"]);
  if (req.files["productImage"] && req.files["productImage"].length > 0) {
    const productImageFile = req.files["productImage"][0];
    console.log("Added product image to body:", productImageFile.filename); // Log the image file added
    req.body.productImage = productImageFile.filename;
  }

  if (req.files["image"]) {
    const imageFiles = req.files["image"];
    console.log(
      "Added images to body:",
      imageFiles.map((file: any) => file.filename)
    ); // Log all images added
    req.body.image = imageFiles.map((file: any) => file.filename);
  } else {
    req.body.image = [];
  }

  if (req.files["video"] && req.files["video"].length > 0) {
    const video = req.files["video"][0];
    console.log("Added video to body:", video.filename); // Log video added
    req.body.video = video.filename;
  }

  console.log("Updated Request Body (appendFileDataToBody):", req.body); // Log final request body
  next();
};

export const appendImageDataToBody = (req: any, res: any, next: Function) => {
  if (req.files && req.files["image"]) {
    const imageFiles = req.files["image"];
    // If there's at least one image uploaded, assign the filename as a string
    if (imageFiles.length > 0) {
      console.log("Added single image to body:", imageFiles[0].filename); // Log the image file added
      req.body.image = imageFiles[0].filename;
    } else {
      // If no images were uploaded, set it to an empty string
      req.body.image = "";
    }
  } else {
    // If the 'image' field is missing in req.files
    req.body.image = "";
  }

  console.log("Updated Request Body (appendImageDataToBody):", req.body); // Log final request body
  next();
};

export const parseColorsMiddleware = (req: any, res: any, next: Function) => {
  if (req.body.colors && typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return next(httpMessages.BAD_REQUEST("Invalid JSON format for colors"));
    }
  }
  next();
};

export const parseExistingImageMiddleware = (
  req: any,
  res: any,
  next: Function
) => {
  if (req.body.existingImages && typeof req.body.existingImages === "string") {
    try {
      req.body.existingImages = JSON.parse(req.body.existingImages);
    } catch (error) {
      return next(
        httpMessages.BAD_REQUEST("Invalid JSON format for existingImages")
      );
    }
  }
  next();
};
