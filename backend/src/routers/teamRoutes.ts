import { Router } from "express";
import { TeamController } from "../controllers";
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
