import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    content: Joi.string().required().messages({
      "string.base": "content must be a string",
      "any.required": "content is required",
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "any.required": "Rating is required",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    productId: Joi.string().required().messages({
      "string.base": "product ID must be a string",
      "any.required": "product ID is required",
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

export { validateReview };
