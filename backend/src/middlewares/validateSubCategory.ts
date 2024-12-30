import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateSubCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name must be a string",
      "any.required": "Name is required",
    }),
    categoryId: Joi.string().required().messages({
      "string.base": "categoryId must be a string",
      "any.required": "categoryId is required",
    }),
    description: Joi.string().required().messages({
      "string.base": "Description must be a string",
      "any.required": "Description is required",
    }),
    created_at: Joi.date().optional().messages({
      "date.base": "Created_at must be a valid date",
    }),
    updated_at: Joi.date().optional().messages({
      "date.base": "Updated_at must be a valid date",
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

export { validateSubCategory };
