import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateCompanyDetails = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    description: Joi.string().required().messages({
      "string.base": "Description must be a string",
      "any.required": "Description is required",
    }),
    phoneNumber: Joi.string().required().messages({
      "string.base": "Phone number must be a string",
      "any.required": "Phone number is required",
    }),
    location: Joi.string().required().messages({
      "string.base": "Location must be a string",
      "any.required": "Location is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    twitter: Joi.string().optional().allow(null).messages({
      "string.base": "Twitter must be a string",
    }),
    facebook: Joi.string().optional().allow(null).messages({
      "string.base": "Facebook must be a string",
    }),
    google_plus: Joi.string().optional().allow(null).messages({
      "string.base": "Google Plus must be a string",
    }),
    youtube: Joi.string().optional().allow(null).messages({
      "string.base": "YouTube must be a string",
    }),
    linkedin: Joi.string().optional().allow(null).messages({
      "string.base": "LinkedIn must be a string",
    }),
    instagram: Joi.string().optional().allow(null).messages({
      "string.base": "Instagram must be a string",
    }),
  }).unknown(true);

  console.log("company details put validation", req.body);

  const { error } = schema.validate(req.body, { abortEarly: false });

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

export { validateCompanyDetails };
