import { Router } from "express";
import { PrivacyPolicyController } from "../controllers";
import {
  validatePrivacyPolicy,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";

const router = Router();
const privacyPolicyController = new PrivacyPolicyController();

router.put(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validatePrivacyPolicy,
  privacyPolicyController.createOrUpdatePolicy.bind(privacyPolicyController),
  handleResponse
);

router.get(
  "/",
  privacyPolicyController.getLatestPolicy.bind(privacyPolicyController),
  handleResponse
);

router.use(handleError);

export default router;
