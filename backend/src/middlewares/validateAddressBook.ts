import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateAddressBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Define Joi validation schema
  const schema = Joi.object({
    street: Joi.string().required().messages({
      "string.base": "Street must be a string",
      "any.required": "Street is required",
    }),
    city: Joi.string().required().messages({
      "string.base": "City must be a string",
      "any.required": "City is required",
    }),
    province: Joi.string().required().messages({
      "string.base": "Province must be a string",
      "any.required": "Province is required",
    }),
    district: Joi.string().required().messages({
      "string.base": "District must be a string",
      "any.required": "District is required",
    }),
    postalCode: Joi.string().pattern(/^\d+$/).required().messages({
      "string.base": "Postal code must be a string",
      "string.pattern.base": "Postal code must be numeric",
      "any.required": "Postal code is required",
    }),
    country: Joi.string().required().messages({
      "string.base": "Country must be a string",
      "any.required": "Country is required",
    }),
    default: Joi.boolean().required().messages({
      "boolean.base": "Default must be a boolean",
      "any.required": "Default is required",
    }),
  });

  // Validate request body
  console.log("validationg ADDRESS", req.body, req.body.formData);
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

export { validateAddressBook };
