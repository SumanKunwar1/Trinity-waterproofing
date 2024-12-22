import { Router } from "express";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";
import subCategoryRoutes from "./subCategoryRoutes";
import productRoutes from "./productRoutes";
import imageRouter from "./imageRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/subcategory", subCategoryRoutes);
router.use("/product", productRoutes);
router.use("/image", imageRouter);

export default router;
