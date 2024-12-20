import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateEditReview = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    content: Joi.string().optional().messages({
      "string.base": "content must be a string",
    }),
    rating: Joi.number().optional().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
    }),
    productId: Joi.string().optional().messages({
      "string.base": "product ID must be a string",
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

export { validateEditReview };
