import { Router } from "express";
import { GalleryController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateFolderCreation,
  validateGalleryImageUpload,
  handleResponse,
  handleError,
} from "../middlewares";
import { uploadMiddleware, appendFileDataToBody } from "../config/upload";

const router = Router();
const galleryController = new GalleryController();

router.post(
  "/create-folder",
  isAuthenticated,
  isAuthorized("admin"),
  validateFolderCreation,
  galleryController.createFolder.bind(galleryController),
  handleResponse
);

router.post(
  "/upload",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  validateGalleryImageUpload,
  galleryController.uploadImage.bind(galleryController),
  handleResponse
);

router.get(
  "/",
  galleryController.getFolders.bind(galleryController),
  handleResponse
);

router.get(
  "/images",
  galleryController.getFiles.bind(galleryController),
  handleResponse
);

router.patch(
  "/:FileName",
  isAuthenticated,
  isAuthorized("admin"),
  galleryController.renameFolder.bind(galleryController),
  handleResponse
);

router.delete(
  "/folder",
  isAuthenticated,
  isAuthorized("admin"),
  galleryController.deleteFolder.bind(galleryController),
  handleResponse
);

router.delete(
  "/files",
  isAuthenticated,
  isAuthorized("admin"),
  galleryController.deleteFiles.bind(galleryController),
  handleResponse
);

router.use(handleError);

export default router;
