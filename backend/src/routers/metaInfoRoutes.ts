import { Router } from "express";
import { MetaInfoController } from "../controllers";
import { handleResponse, handleError } from "../middlewares";

const router = Router();
const metaInfoController = new MetaInfoController();

router.get(
  "/",
  metaInfoController.getAllMetaInfo.bind(metaInfoController),
  handleResponse
);

router.post(
  "/",
  metaInfoController.createMetaInfo.bind(metaInfoController),
  handleResponse
);

router.patch(
  "/:metaId",
  metaInfoController.updateMetaInfo.bind(metaInfoController),
  handleResponse
);

router.delete(
  "/:metaId",
  metaInfoController.deleteMetaInfo.bind(metaInfoController),
  handleResponse
);

router.use(handleError);

export default router;
