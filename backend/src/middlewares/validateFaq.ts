import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateFaq = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    question: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    answer: Joi.string().required().messages({
      "string.base": "Description must be a string",
      "any.required": "Description is required",
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

export { validateFaq };
