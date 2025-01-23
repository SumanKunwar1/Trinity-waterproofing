import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const UPLOADS = process.env.IMAGE_UPLOAD || "uploads";

export const uploadFolder = path.join(__dirname, "../../../", UPLOADS);
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

export const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
export const allowedVideoTypes = [
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/quicktime",
];

export const MAX_IMAGE_SIZE = process.env.IMAGE_SIZE_LIMIT
  ? parseInt(process.env.IMAGE_SIZE_LIMIT) * 1024 * 1024
  : 1 * 1024 * 1024;
export const MAX_VIDEO_SIZE = process.env.VIDEO_SIZE_LIMIT
  ? parseInt(process.env.VIDEO_SIZE_LIMIT) * 1024 * 1024
  : 10 * 1024 * 1024;

export const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export const environment = process.env.NODE_ENV || "development";
