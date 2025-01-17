import multer from "multer";
import path from "path";
import { httpMessages } from "../middlewares";
import {
  uploadFolder,
  allowedImageTypes,
  allowedVideoTypes,
  MAX_VIDEO_SIZE,
} from "./uploadConstants";

// Add fileFilter to enforce file type restrictions
const fileFilter = (req: any, file: any, cb: any) => {
  //console.log("Received file:", file);

  if (file.fieldname === "productImage" || file.fieldname === "image") {
    if (allowedImageTypes.includes(file.mimetype)) {
      //console.log(`Allowed file type: ${file.mimetype}`);
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
      //console.log(`Allowed video file type: ${file.mimetype}`);
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
      //console.log("Uploading file...");
      //console.log("Upload folder path:", uploadFolder);
      cb(null, uploadFolder); // Save to the upload folder
    } catch (err) {
      console.error("Error in destination callback:", err);
      cb(err);
    }
  },
  filename: async (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const imageType = path.extname(file.originalname);
    cb(null, uniqueSuffix + imageType);
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
    //console.log("Added image to body:", req.files["image"][0].filename); // Log the image file added
    req.body.image = req.files["image"][0].filename;
  }

  // Handle video files
  if (req.files && req.files["video"]) {
    // If there's a video uploaded, assign the filename to req.body.video
    //console.log("Added video to body:", req.files["video"][0].filename); // Log the video file added
    req.body.video = req.files["video"][0].filename;
  }

  //console.log("Updated Request Body (appendSliderDataToBody):", req.body); // Log final request body
  next();
};

export const appendFileDataToBody = (req: any, res: any, next: Function) => {
  //console.log(req.files["image"]);
  if (req.files["productImage"] && req.files["productImage"].length > 0) {
    const productImageFile = req.files["productImage"][0];
    //console.log("Added product image to body:", productImageFile.filename); // Log the image file added
    req.body.productImage = productImageFile.filename;
  }

  if (req.files["image"]) {
    const imageFiles = req.files["image"];
    req.body.image = imageFiles.map((file: any) => file.filename);
  } else {
    req.body.image = [];
  }

  if (req.files["video"] && req.files["video"].length > 0) {
    const video = req.files["video"][0];
    //console.log("Added video to body:", video.filename); // Log video added
    req.body.video = video.filename;
  }

  //console.log("Updated Request Body (appendFileDataToBody):", req.body); // Log final request body
  next();
};

export const appendImageDataToBody = (req: any, res: any, next: Function) => {
  if (req.files && req.files["image"]) {
    const imageFiles = req.files["image"];
    // If there's at least one image uploaded, assign the filename as a string
    if (imageFiles.length > 0) {
      //console.log("Added single image to body:", imageFiles[0].filename); // Log the image file added
      req.body.image = imageFiles[0].filename;
    } else {
      // If no images were uploaded, set it to an empty string
      req.body.image = "";
    }
  } else {
    // If the 'image' field is missing in req.files
    req.body.image = "";
  }

  //console.log("Updated Request Body (appendImageDataToBody):", req.body); // Log final request body
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
