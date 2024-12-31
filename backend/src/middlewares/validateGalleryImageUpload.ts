import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";

const validateGalleryImageUpload = (
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
          "Folder name can only contain alphanumeric characters, dashes, and underscores",
        "any.required": "Folder name is required",
      }),
    image: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": "Each image must be a string",
        })
      )
      .max(25)
      .messages({
        "array.base": "Images must be an array",
        "array.max": "You can upload a maximum of 5 images",
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

export { validateGalleryImageUpload };
