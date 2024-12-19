import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

console.log("image upload fol;der name", process.env.IMAGE_UPLOAD);
const UPLOADS = process.env.IMAGE_UPLOAD || "uploads";

const uploadFolder = path.join(__dirname, "../../../", UPLOADS);

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Set up multer storage engine
const storage: multer.StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("====== Request Data ======");

    // Convert req.body to a regular object if it's a "null prototype" object
    const body = Object.assign({}, req.body);
    console.log("Request Body:", JSON.stringify(body, null, 2)); // Pretty print with indentation

    // Check if files are present
    if (req.files) {
      console.log("Uploaded Files:", JSON.stringify(req.files, null, 2)); // Pretty print files
    } else {
      console.log("No files uploaded.");
    }

    console.log("===========================");
    cb(null, uploadFolder); // Set the destination for the files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Set unique filename
  },
});

const upload = multer({ storage: storage });

// Upload middleware using multer fields
export const uploadMiddleware = upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Custom middleware to append filenames to req.body after multer processes the files
export const appendFileDataToBody = (req: any, res: any, next: Function) => {
  // After multer processes files, append filenames to req.body
  if (req.files["productImage"] && req.files["productImage"].length > 0) {
    const productImageFile = req.files["productImage"][0]; // Get the product image file
    req.body.productImage = productImageFile.filename; // Add the filename to req.body
  }

  // Process other images (if any)
  if (req.files["images"]) {
    const imageFiles = req.files["images"];
    req.body.images = imageFiles.map((file: any) => file.filename); // Add filenames of other images to req.body
  } else {
    req.body.images = []; // If no images, set it to an empty array
  }

  console.log("Updated Request Body:", req.body);
  next(); // Continue to the next middleware (e.g., validation, product creation)
};
