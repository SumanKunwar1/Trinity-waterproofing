import { Router } from "express";
import { FaqController } from "../controllers";
import {
  validateFaq,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";

const router = Router();
const faqController = new FaqController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validateFaq,
  faqController.createFaq.bind(faqController),
  handleResponse
);

router.get("/", faqController.getFaqs.bind(faqController), handleResponse);

router.patch(
  "/:faqId",
  isAuthenticated,
  isAuthorized("admin"),
  validateFaq,
  faqController.editFaq.bind(faqController),
  handleResponse
);

router.delete(
  "/:faqId",
  isAuthenticated,
  isAuthorized("admin"),
  faqController.deleteFaq.bind(faqController),
  handleResponse
);

router.use(handleError);

export default router;
