import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

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

export { validateEditReview };
