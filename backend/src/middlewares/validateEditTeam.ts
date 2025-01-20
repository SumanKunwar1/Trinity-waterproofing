import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateEditTeam = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().optional().messages({
      "string.base": "Name must be a string",
    }),
    role: Joi.string().optional().messages({
      "string.base": "Role must be a string",
    }),
    image: Joi.string().optional().allow("").messages({
      "string.base": "Image must be a string",
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
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided to update the Team",
    });

  const { error } = schema.validate(req.body);
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

export { validateEditTeam };
