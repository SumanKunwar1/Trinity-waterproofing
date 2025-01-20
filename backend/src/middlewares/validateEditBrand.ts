import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateEditBrand = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().optional().messages({
      "string.base": "Name must be a string",
    }),
    image: Joi.string().optional().allow("").messages({
      "string.base": "Description must be a string",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided to update the brand",
    });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    if (req.body.image && req.body.image !== "") {
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

export { validateEditBrand };
