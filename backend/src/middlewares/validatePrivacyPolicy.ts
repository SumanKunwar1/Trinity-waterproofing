import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from ".";

const validatePrivacyPolicy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    content: Joi.string().required().messages({
      "string.base": "Content must be a string",
      "any.required": "Content is required",
    }),
  });

  console.log(req.body);

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

export { validatePrivacyPolicy };
