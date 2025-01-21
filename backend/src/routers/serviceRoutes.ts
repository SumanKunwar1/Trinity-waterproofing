import { Router } from "express";
import { ServiceController } from "../controllers";
import { compressUploadedImages } from "../config/fileCompress";
import {
  isAuthenticated,
  isAuthorized,
  validateService,
  validateEditService,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const serviceController = new ServiceController();

// ------------------------ Service Routes ------------------------

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateService,
  compressUploadedImages,
  serviceController.createService.bind(serviceController),
  handleResponse
);

router.get(
  "/",
  serviceController.getService.bind(serviceController),
  handleResponse
);

router.patch(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditService,
  compressUploadedImages,
  serviceController.editService.bind(serviceController),
  handleResponse
);

// ------------------------ Card Routes ------------------------

router.post(
  "/cards",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateService,
  compressUploadedImages,
  serviceController.createCard.bind(serviceController),
  handleResponse
);

router.get(
  "/cards",
  serviceController.getCardsForService.bind(serviceController),
  handleResponse
);

router.patch(
  "/cards/:cardId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditService,
  compressUploadedImages,
  serviceController.editCard.bind(serviceController),
  handleResponse
);

router.delete(
  "/cards/:cardId",
  isAuthenticated,
  isAuthorized("admin"),
  serviceController.deleteCard.bind(serviceController),
  handleResponse
);

// ------------------------ Section Routes ------------------------

router.post(
  "/sections",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateService,
  compressUploadedImages,
  serviceController.createSection.bind(serviceController),
  handleResponse
);

router.get(
  "/sections",
  serviceController.getSectionsForService.bind(serviceController),
  handleResponse
);

router.patch(
  "/sections/:sectionId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditService,
  compressUploadedImages,
  serviceController.editSection.bind(serviceController),
  handleResponse
);

router.delete(
  "/sections/:sectionId",
  isAuthenticated,
  isAuthorized("admin"),
  serviceController.deleteSection.bind(serviceController),
  handleResponse
);

router.use(handleError);

export default router;
