import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from ".";
import { deleteImages } from "../config/deleteImages";

const validateAbout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.base": "Title must be a string",
      "any.required": "Title is required",
    }),
    description: Joi.string().required().messages({
      "string.base": "Description must be a string",
      "any.required": "Description is required",
    }),
    image: Joi.string().required().messages({
      "string.base": "Image must be a string",
      "any.required": "Image is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    if (req.body.image) {
      deleteImages([req.body.image]);
    }

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateAbout };
