// validateEditProduct.ts
import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

// Define color schema
const colorSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Color name must be a string",
  }),
  hex: Joi.string().optional().messages({
    "string.base": "Color hex must be a string",
    "string.pattern.base": "Color hex must be a valid hex code",
  }),
});

const schema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
  }),
  description: Joi.string().optional().messages({
    "string.base": "Description must be a string",
  }),
  wholeSalePrice: Joi.number().min(0).optional().messages({
    "number.base": "Variant wholesale price must be a positive number or zero",
  }),
  retailPrice: Joi.number().min(0).optional().messages({
    "number.base": "Variant retail price must be a positive number or zero",
  }),
  retailDiscountedPrice: Joi.number().min(0).optional().messages({
    "number.base": "Retail discounted price must be a positive number or zero",
  }),
  wholeSaleDiscountedPrice: Joi.number().min(0).optional().messages({
    "number.base":
      "Wholesale discounted price must be a positive number or zero",
  }),
  colors: Joi.array().items(colorSchema).optional().messages({
    "array.base":
      "colors must be an array of color objects with 'name' and 'hex'",
  }),
  features: Joi.string().optional().messages({
    "string.base": "Features must be a string",
  }),
  pdfUrl: Joi.string().optional().messages({
    "string.base": "Features must be a string",
  }),
  brand: Joi.string().optional().messages({
    "string.base": "Brand must be a string",
  }),
  inStock: Joi.number().min(0).optional().messages({
    "number.base": "InStock must be a positive number or zero",
  }),
  isFeatured: Joi.boolean().optional().messages({
    "boolean.base": "isFeatured must be boolean",
  }),
  subCategory: Joi.string()
    .pattern(/^[a-f\d]{24}$/i)
    .optional()
    .messages({
      "string.base": "SubCategory ID must be a string",
      "string.pattern.base": "SubCategory ID must be a valid ObjectId",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update the product",
  });

const validateEditProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body.pdfUrl === "") {
    delete req.body.pdfUrl;
  }
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateEditProduct };
