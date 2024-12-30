import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Define Joi validation schema
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      "string.base": "FullName must be a string",
      "any.required": "FullName is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    number: Joi.string().required().messages({
      "string.base": "Phone number must be a string",
      "string.pattern.base": "Invalid phone number format",
      "any.required": "Phone number is required",
    }),
    role: Joi.string().valid("b2b", "b2c").insensitive().required().messages({
      "string.base": "Role must be a string",
      "any.required": "Role is required",
      "string.valid": 'Role must be either "b2b" or "b2c"',
    }),
  });

  // Validate request body
  console.log("validationg user");
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

export { validateUser };
