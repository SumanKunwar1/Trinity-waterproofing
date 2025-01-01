import { Router } from "express";
import { NewsLetterController } from "../controllers";
import {
  validateNewsLetter,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";

const router = Router();
const newsLetterController = new NewsLetterController();

router.post(
  "/",
  validateNewsLetter,
  newsLetterController.createNewsLetter.bind(newsLetterController),
  handleResponse
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  newsLetterController.getNewsLetters.bind(newsLetterController),
  handleResponse
);

router.delete(
  "/:newsLetterId",
  isAuthenticated,
  isAuthorized("admin"),
  newsLetterController.deleteNewsLetter.bind(newsLetterController),
  handleResponse
);

router.use(handleError);

export default router;
