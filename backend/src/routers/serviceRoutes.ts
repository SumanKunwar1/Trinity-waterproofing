import { Router } from "express";
import { ServiceController } from "../controllers";
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
  serviceController.editService.bind(serviceController),
  handleResponse
);

// ------------------------ Card Routes ------------------------

router.post(
  "/cards",
  isAuthenticated,
  isAuthorized("admin"),
  validateService,
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
  validateEditService,
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

router.use(handleError);

export default router;
