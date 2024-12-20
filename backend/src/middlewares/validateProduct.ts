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
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string",
    }),
    retailPrice: Joi.number().required().messages({
      "number.base": "Retail Price must be a number",
      "any.required": "Retail Price is required",
    }),
    wholeSalePrice: Joi.number().required().messages({
      "number.base": "Wholesale Price must be a number",
      "any.required": "Wholesale Price is required",
    }),
    productImage: Joi.string().required().messages({
      "string.base": "Product Image must be a valid URL",
      "any.required": "Product Image is required",
    }),
    image: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Images must be an array of valid URLs",
    }),
    features: Joi.string().required().messages({
      "string.base": "Features must be a string",
      "any.required": "Features is required",
    }),
    brand: Joi.string().required().messages({
      "string.base": "Brand must be a string",
      "any.required": "Brand is required",
    }),
    variants: Joi.array()
      .items(
        Joi.object({
          color: Joi.string().optional().messages({
            "string.base": "Variant color must be a string",
          }),
          volume: Joi.string().optional().messages({
            "string.base": "Variant volume must be a string",
          }),
<<<<<<< HEAD
          label: Joi.string().required().messages({
            "string.base": "Variant label must be a string",
            "any.required": "Variant label is required",
          }),
          value: Joi.string().required().messages({
            "string.base": "Variant value must be a string",
            "any.required": "Variant value is required",
=======
          label: Joi.string().optional().messages({
            "string.base": "Variant label must be a string",
          }),
          value: Joi.string().optional().messages({
            "string.base": "Variant value must be a string",
>>>>>>> 120f5cdd05761dd17d0d93a2ae548aeb9d7dce72
          }),
          price: Joi.number().required().messages({
            "number.base": "Variant price must be a number",
            "any.required": "Variant price is required",
          }),
          isColorChecked: Joi.boolean().optional().default(false).messages({
            "boolean.base": "isColorChecked must be a boolean",
          }),
          isVolumeChecked: Joi.boolean().optional().default(false).messages({
            "boolean.base": "isVolumeChecked must be a boolean",
          }),
        })
      )
      .optional()
      .messages({
        "array.base": "Variants must be an array",
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
