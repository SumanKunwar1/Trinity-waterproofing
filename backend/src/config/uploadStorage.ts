import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { uploadFolder } from "./upload";
dotenv.config();

export const imageSizeLimit =
  parseInt(process.env.IMAGE_SIZE_LIMIT || "10") * 1024 * 1024;
export const videoSizeLimit =
  parseInt(process.env.VIDEO_SIZE_LIMIT || "50") * 1024 * 1024;

export const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Uploading file to:", uploadFolder); // Log the destination folder
    cb(null, uploadFolder); // Save to the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log(`Saving file: ${filename}`); // Log the file name being saved
    cb(null, filename); // Save the file with the new unique name
  },
});
