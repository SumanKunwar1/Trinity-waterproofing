import { Router } from "express";
import { CompanyDetailController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateCompanyDetails,
  handleResponse,
  handleError,
} from "../middlewares";

const router = Router();
const companyDetailController = new CompanyDetailController();

router.get(
  "/",
  companyDetailController.getCompanyDetails.bind(companyDetailController),
  handleResponse
);

router.put(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validateCompanyDetails,
  companyDetailController.putCompanyDetails.bind(companyDetailController),
  handleResponse
);

router.use(handleError);

export default router;
