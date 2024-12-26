import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateCart = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
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
      "number.base": "Quantity must be a number",
      "any.required": "Quantity is required",
    }),
  });
  console.log(req.body);
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

export { validateCart };
