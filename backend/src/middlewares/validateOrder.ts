import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const orderItemSchema = Joi.object({
    productId: Joi.string().required().messages({
      "string.base": "productId must be a string",
      "any.required": "productId is required",
    }),
    color: Joi.string().optional().allow(null).messages({
      "string.base": "Color must be a string",
    }),
    quantity: Joi.number().required().messages({
      "number.base": "Quantity must be a number",
      "any.required": "Quantity is required",
    }),
    price: Joi.number().required().messages({
      "number.base": "Price must be a number",
      "any.required": "Price is required",
    }),
  });

  const schema = Joi.object({
    products: Joi.array().items(orderItemSchema).min(1).required().messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required in the order",
      "any.required": "Items are required",
    }),
    addressId: Joi.string().required().messages({
      "string.base": "productId must be a string",
      "any.required": "productId is required",
    }),
  });
  const { error } = schema.validate(req.body);
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

export { validateOrder };
