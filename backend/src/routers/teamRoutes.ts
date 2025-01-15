import { Router } from "express";
import { TeamController } from "../controllers";
import { compressUploadedImages } from "../config/fileCompress";
import {
  isAuthenticated,
  isAuthorized,
  validateTeam,
  validateEditTeam,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const teamController = new TeamController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateTeam,
  compressUploadedImages,
  teamController.createTeamMember.bind(teamController),
  handleResponse
);

router.get(
  "/",
  teamController.getTeamMembers.bind(teamController),
  handleResponse
);

router.get(
  "/:teamMemberId",
  teamController.getTeamMemberById.bind(teamController),
  handleResponse
);

router.patch(
  "/:teamMemberId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditTeam,
  compressUploadedImages,
  teamController.editTeamMember.bind(teamController),
  handleResponse
);

router.delete(
  "/:teamMemberId",
  isAuthenticated,
  isAuthorized("admin"),
  teamController.deleteTeamMember.bind(teamController),
  handleResponse
);

router.use(handleError);

export default router;
