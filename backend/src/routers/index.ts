import { Router } from "express";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";
import subCategoryRoutes from "./subCategoryRoutes";
import productRoutes from "./productRoutes";
import imageRoutes from "./imageRoutes";
import wishListRoutes from "./wishListRoutes";
import brandRoutes from "./brandRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import enquiryRoutes from "./enquiryRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/subcategory", subCategoryRoutes);
router.use("/product", productRoutes);
router.use("/image", imageRoutes);
router.use("/brand", brandRoutes);
router.use("/wishlist", wishListRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/enquiry", enquiryRoutes);

export default router;
