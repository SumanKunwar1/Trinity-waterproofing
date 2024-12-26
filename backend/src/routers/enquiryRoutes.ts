import { Router } from "express";
import { EnquiryController } from "../controllers";
import {
  handleError,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  validateEnquiry,
} from "../middlewares";

const router = Router();
const enquiryController = new EnquiryController();

router.post(
  "/",
  validateEnquiry,
  enquiryController.createEnquiry.bind(enquiryController),
  handleResponse
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  enquiryController.getEnquiries.bind(enquiryController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  enquiryController.deleteEnquiry.bind(enquiryController),
  handleResponse
);

router.use(handleError);
export default router;
