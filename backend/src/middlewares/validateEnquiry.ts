import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateEnquiry = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      "string.base": "Full Name must be a string.",
      "any.required": "Full Name is required.",
    }),
    number: Joi.string().required().messages({
      "string.base": "Phone Number must be a string.",
      "any.required": "Phone Number is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    message: Joi.string().min(5).max(500).required().messages({
      "string.base": "Message must be a string.",
      "string.min": "Message must be at least 5 characters long.",
      "string.max": "Message must be at most 500 characters long.",
      "any.required": "Message is required.",
    }),
  });
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

export { validateEnquiry };
