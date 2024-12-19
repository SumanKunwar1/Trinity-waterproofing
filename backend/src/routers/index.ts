import { Router } from "express";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";
import subCategoryRoutes from "./subCategoryRoutes";
import productRoutes from "./productRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/subcategory", subCategoryRoutes);
router.use("/product", productRoutes);

export default router;
