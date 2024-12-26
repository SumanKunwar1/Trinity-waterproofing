import { Brand, Product } from "../models";
import { IBrand } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class BrandService {
  public async createBrand(brandData: IBrand) {
    try {
      const { name } = brandData;

      const isBrandPresent = await Brand.findOne({ name });
      if (isBrandPresent) {
        throw httpMessages.ALREADY_PRESENT("Brand");
      }

      const newBrand = new Brand(brandData);
      await newBrand.save();
      return newBrand;
    } catch (error) {
      throw error;
    }
  }

  public async editBrand(brandId: string, brandData: Partial<IBrand>) {
    try {
      const { name, image } = brandData;

      const existingBrand = await Brand.findById(brandId);
      if (!existingBrand) {
        throw httpMessages.NOT_FOUND("Brand");
      }
      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (existingBrand.image && existingBrand.image !== image) {
          filesToDelete.push(existingBrand.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        existingBrand.image = image;
      }

      if (name) existingBrand.name = name;
      await existingBrand.save();
      return existingBrand;
    } catch (error) {
      throw error;
    }
  }

  public async getBrands() {
    try {
      const brands = await Brand.find();
      if (!brands || brands.length === 0) {
        return [];
      }
      const brandResponse = brands.map((brand) => ({
        _id: brand._id,
        name: brand.name,
        image: `/api/image/${brand.image}`,
      }));
      return brandResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getBrandById(brandId: string) {
    try {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return null;
      }
      const brandResponse = {
        name: brand.name,
        image: `/api/image/${brand.image}`,
      };
      return brand;
    } catch (error) {
      throw error;
    }
  }

  public async deleteBrandById(brandId: string) {
    try {
      const brand = await Brand.findById(brandId);

      if (!brand) {
        throw httpMessages.NOT_FOUND("Brand");
      }

      const filesToDelete: string[] = [];
      if (brand.image) {
        filesToDelete.push(brand.image);
      }

      if (filesToDelete.length > 0) {
        await deleteImages(filesToDelete);
      }
      const productsToDelete = await Product.find({ brand: brandId });

      if (productsToDelete.length > 0) {
        // Collect image files associated with products for deletion
        const filesToDelete: string[] = [];

        // Iterate over products to gather image files for deletion
        productsToDelete.forEach((product) => {
          if (product.productImage) {
            filesToDelete.push(product.productImage); // Add product image
          }

          // If there are additional images for the product
          if (product.image && product.image.length > 0) {
            filesToDelete.push(...product.image); // Add additional images
          }
        });

        // Delete images from file system
        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }

        // Delete products from the database
        await Product.deleteMany({ brand: brandId });
      }

      await Brand.deleteOne({ _id: brandId });

      return {
        message: "Brand deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
