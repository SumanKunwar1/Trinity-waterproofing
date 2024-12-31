import { Router } from "express";
import { SliderController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateSlider,
  validateEditSlider,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const sliderController = new SliderController();

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  sliderController.getSliders.bind(sliderController),
  handleResponse
);

router.get(
  "/user",
  sliderController.displaySlider.bind(sliderController),
  handleResponse
);

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  validateSlider,
  sliderController.createSlider.bind(sliderController)
);

router.patch(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditSlider,
  sliderController.editSlider.bind(sliderController),
  handleResponse
);

router.delete(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  sliderController.deleteSlider.bind(sliderController),
  handleResponse
);

router.use(handleError);
export default router;
