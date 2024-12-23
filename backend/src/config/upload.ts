import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

console.log("image upload fol;der name", process.env.IMAGE_UPLOAD);
const UPLOADS = process.env.IMAGE_UPLOAD || "uploads";

export const uploadFolder = path.join(__dirname, "../../../", UPLOADS);
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("====== Request Data ======");

    const body = Object.assign({}, req.body);
    console.log("Request Body:", JSON.stringify(body, null, 2));

    if (req.files) {
      console.log("Uploaded Files:", JSON.stringify(req.files, null, 2));
    } else {
      console.log("No files uploaded.");
    }

    console.log("===========================");
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//this middleware exclusively for product file uploads
export const uploadMiddleware = upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "image", maxCount: 10 },
]);
//this one for all other images
export const imageUploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
]);

export const appendFileDataToBody = (req: any, res: any, next: Function) => {
  if (req.files["productImage"] && req.files["productImage"].length > 0) {
    const productImageFile = req.files["productImage"][0];
    req.body.productImage = productImageFile.filename;
  }

  if (req.files["image"]) {
    const imageFiles = req.files["image"];
    req.body.image = imageFiles.map((file: any) => file.filename);
  } else {
    req.body.image = [];
  }

  console.log("Updated Request Body:", req.body);
  next();
};

export const appendImageDataToBody = (req: any, res: any, next: Function) => {
  if (req.files && req.files["image"]) {
    const imageFiles = req.files["image"];

    // If there's at least one image uploaded, assign the filename as a string
    if (imageFiles.length > 0) {
      req.body.image = imageFiles[0].filename;
    } else {
      // If no images were uploaded, set it to an empty string
      req.body.image = "";
    }
  } else {
    // If the 'image' field is missing in req.files
    req.body.image = "";
  }

  console.log("Updated Request Body (imageUploadMiddleware):", req.body);
  next();
};

export const parseColorsMiddleware = (req: any, res: any, next: Function) => {
  if (req.body.colors && typeof req.body.colors === "string") {
    try {
      req.body.colors = JSON.parse(req.body.colors);
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON format for colors" });
    }
  }
  next();
};
