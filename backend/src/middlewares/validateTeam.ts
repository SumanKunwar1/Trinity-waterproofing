import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateTeam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    role: Joi.string().optional().messages({
      "string.base": "Role must be a string",
    }),
    image: Joi.string().required().messages({
      "string.base": "Image must be a string",
      "any.required": "Image is required",
    }),
    isvisible: Joi.boolean().optional().messages({
      "boolean.base": "isvisible must be a boolean",
    }),
    facebook: Joi.string().optional().messages({
      "string.base": "Facebook must be a string",
    }),
    twitter: Joi.string().optional().messages({
      "string.base": "Twitter must be a string",
    }),
    instagram: Joi.string().optional().messages({
      "string.base": "Instagram must be a string",
    }),
    linkedin: Joi.string().optional().messages({
      "string.base": "LinkedIn must be a string",
    }),
  });

  console.log(req.body);
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

export { validateTeam };
