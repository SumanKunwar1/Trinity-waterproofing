import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
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
    image: Joi.array()
      .items(
        Joi.string().uri().messages({
          "string.base": "Each image must be a string",
          "string.uri": "Each image must be a valid URI",
        })
      )
      .max(5)
      .messages({
        "array.base": "Images must be an array",
        "array.max": "You can upload a maximum of 5 images",
      }),
    productId: Joi.string().required().messages({
      "string.base": "product ID must be a string",
      "any.required": "product ID is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));
    if (req.body.image) {
      deleteImages(req.body.image);
    }

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateReview };
