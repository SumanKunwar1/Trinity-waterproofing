import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateFolderCreation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    folderName: Joi.string()
      .regex(/^[a-zA-Z0-9-_ ]+$/)
      .required()
      .messages({
        "string.base": "Folder name must be a string",
        "string.pattern.base":
          "Folder name can only contain alphanumeric characters, dashes, spaces and underscores",
        "any.required": "Folder name is required",
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

export { validateFolderCreation };
