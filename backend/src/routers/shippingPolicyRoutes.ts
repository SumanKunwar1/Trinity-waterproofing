import { Router } from "express";
import { ShippingPolicyController } from "../controllers";
import {
  validatePolicy,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
  validateEditPolicy,
} from "../middlewares";

const router = Router();
const shippingPolicyController = new ShippingPolicyController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validatePolicy,
  shippingPolicyController.createPolicy.bind(shippingPolicyController),
  handleResponse
);

router.get(
  "/",
  shippingPolicyController.getPolicies.bind(shippingPolicyController),
  handleResponse
);

router.patch(
  "/:shippingPolicyId",
  isAuthenticated,
  isAuthorized("admin"),
  validateEditPolicy,
  shippingPolicyController.editPolicy.bind(shippingPolicyController),
  handleResponse
);

router.delete(
  "/:shippingPolicyId",
  isAuthenticated,
  isAuthorized("admin"),
  shippingPolicyController.deletePolicy.bind(shippingPolicyController),
  handleResponse
);

router.use(handleError);

export default router;
