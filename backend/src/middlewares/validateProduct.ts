import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteProductImages } from "../config/deleteImages";

const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const colorSchema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Color name must be a string",
      "any.required": "Color name is required",
    }),
    hex: Joi.string().required().messages({
      "string.base": "Color hex must be a string",
      "string.pattern.base": "Color hex must be a valid hex code ",
      "any.required": "Color hex is required",
    }),
  });
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string",
    }),
    wholeSalePrice: Joi.number().required().messages({
      "number.base": "Variant wholesale price must be a number",
      "any.required": "Variant wholesale price is required",
    }),
    retailPrice: Joi.number().required().messages({
      "number.base": "Variant retail price must be a number",
      "any.required": "Variant retail price is required",
    }),
    productImage: Joi.string().required().messages({
      "string.base": "Product Image must be a valid URL",
      "any.required": "Product Image is required",
    }),
    image: Joi.array().items(Joi.string()).max(10).optional().messages({
      "array.base": "Images must be an array of valid filenames",
      "array.max": "You can upload a maximum of 10 images",
    }),

    colors: Joi.array().items(colorSchema).optional().messages({
      "array.base":
        "colors must be an array of color objects with 'name' and 'hex'",
    }),
    features: Joi.string().required().messages({
      "string.base": "Features must be a string",
      "any.required": "Features is required",
    }),
    brand: Joi.string().required().messages({
      "string.base": "Brand must be a string",
      "any.required": "Brand is required",
    }),
    inStock: Joi.number().required().messages({
      "number.base": "InStock must be a number",
      "any.required": "InStock is required",
    }),
    subCategory: Joi.string()
      .pattern(/^[a-f\d]{24}$/i)
      .required()
      .messages({
        "string.base": "SubCategory ID must be a string",
        "string.pattern.base": "SubCategory ID must be a valid ObjectId",
        "any.required": "SubCategory ID is required",
      }),
    created_at: Joi.date().optional().messages({
      "date.base": "Created_at must be a valid date",
    }),
    updated_at: Joi.date().optional().messages({
      "date.base": "Updated_at must be a valid date",
    }),
  });
  console.log(req.body);
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    deleteProductImages(req);

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateProduct };
