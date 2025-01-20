import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateEditUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Define Joi validation schema
  const schema = Joi.object({
    fullName: Joi.string().optional().messages({
      "string.base": "FullName must be a string",
    }),
    email: Joi.string().email().optional().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email",
    }),
    password: Joi.string().min(6).optional().messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters long",
    }),
    number: Joi.string().optional().messages({
      "string.base": "Phone number must be a string",
      "string.pattern.base": "Invalid phone number format",
    }),
    role: Joi.string().valid("b2b", "b2c").insensitive().optional().messages({
      "string.base": "Role must be a string",
      "string.valid": 'Role must be either "b2b" or "b2c"',
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided to update the user",
    });

  // Validate request body
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

export { validateEditUser };
