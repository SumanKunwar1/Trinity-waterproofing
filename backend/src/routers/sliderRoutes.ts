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
import {
  sliderUploadMiddleware,
  appendSliderDataToBody,
} from "../config/upload";

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
  sliderUploadMiddleware,
  appendSliderDataToBody,
  validateSlider,
  sliderController.createSlider.bind(sliderController),
  handleResponse
);

router.patch(
  "/:sliderId",
  isAuthenticated,
  isAuthorized("admin"),
  sliderUploadMiddleware,
  appendSliderDataToBody,
  validateEditSlider,
  sliderController.editSlider.bind(sliderController),
  handleResponse
);

router.delete(
  "/:sliderId",
  isAuthenticated,
  isAuthorized("admin"),
  sliderController.deleteSlider.bind(sliderController),
  handleResponse
);

router.use(handleError);
export default router;
