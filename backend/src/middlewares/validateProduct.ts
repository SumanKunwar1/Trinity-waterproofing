import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "name must be a string",
      "any.required": "name is required",
    }),
    retailPrice: Joi.number().required().messages({
      "number.base": "Retail Price must be a number",
      "any.required": "Retail Price is required",
    }),
    wholeSalePrice: Joi.number().required().messages({
      "number.base": "Wholesale Price must be a number",
      "any.required": "Wholesale Price is required",
    }),
    review: Joi.string().optional().messages({
      "string.base": "Review must be a string",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string",
    }),
    productImage: Joi.string().required().messages({
      "string.base": "Product Image must be a string",
      "any.required": "Product Image is required",
    }),
    images: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Images must be an array of strings",
    }),
    features: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Features must be an array of strings",
    }),
    brand: Joi.string().required().messages({
      "string.base": "Brand must be a string",
      "any.required": "Brand is required",
    }),
    variants: Joi.array()
      .items(
        Joi.object({
          color: Joi.string().required().messages({
            "string.base": "Variant color must be a string",
            "any.required": "Variant color is required",
          }),
          volume: Joi.string().required().messages({
            "string.base": "Variant volume must be a string",
            "any.required": "Variant volume is required",
          }),
          price: Joi.number().required().messages({
            "number.base": "Variant price must be a number",
            "any.required": "Variant price is required",
          }),
        })
      )
      .required()
      .messages({
        "array.base": "Variants must be an array",
        "any.required": "Variants are required",
      }),
    instock: Joi.number().required().messages({
      "number.base": "Instock must be a number",
      "any.required": "Instock is required",
    }),
    subCategoryId: Joi.string().required().messages({
      "string.base": "SubCategory ID must be a string",
      "any.required": "SubCategory ID is required",
    }),
    created_at: Joi.date().optional().messages({
      "date.base": "Created_at must be a valid date",
    }),
    updated_at: Joi.date().optional().messages({
      "date.base": "Updated_at must be a valid date",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    deleteImages(req);

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateProduct };
