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

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validatePrivacyPolicy,
  privacyPolicyController.createPolicy.bind(privacyPolicyController),
  handleResponse
);

router.get(
  "/latest",
  privacyPolicyController.getLatestPolicy.bind(privacyPolicyController),
  handleResponse
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  privacyPolicyController.getAllPolicies.bind(privacyPolicyController),
  handleResponse
);

router.delete(
  "/:privacyPolicyId",
  isAuthenticated,
  isAuthorized("admin"),
  privacyPolicyController.deletePolicy.bind(privacyPolicyController),
  handleResponse
);

router.use(handleError);

export default router;
