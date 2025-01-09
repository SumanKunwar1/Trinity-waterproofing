import { Router } from "express";
import { ReturnPolicyController } from "../controllers";
import {
  validatePolicy,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
  validateEditPolicy,
} from "../middlewares";

const router = Router();
const returnPolicyController = new ReturnPolicyController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validatePolicy,
  returnPolicyController.createPolicy.bind(returnPolicyController),
  handleResponse
);

router.get(
  "/",
  returnPolicyController.getPolicies.bind(returnPolicyController),
  handleResponse
);

router.patch(
  "/:returnPolicyId",
  isAuthenticated,
  isAuthorized("admin"),
  validateEditPolicy,
  returnPolicyController.editPolicy.bind(returnPolicyController),
  handleResponse
);

router.delete(
  "/:returnPolicyId",
  isAuthenticated,
  isAuthorized("admin"),
  returnPolicyController.deletePolicy.bind(returnPolicyController),
  handleResponse
);

router.use(handleError);

export default router;
