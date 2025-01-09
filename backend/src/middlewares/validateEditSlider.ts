import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

const validateEditSlider = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string().optional().messages({
      "string.base": "Title must be a string",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a string",
    }),
    image: Joi.string().optional().allow("").messages({
      "string.base": "Image must be a string",
    }),
    video: Joi.string().optional().allow("").messages({
      "string.base": "Video must be a string",
    }),
    isvisible: Joi.bool().optional().messages({
      "bool.base": "isVisible must be a boolean",
    }),
  })
    .custom((value, helpers) => {
      // If both image and video are provided, return an error
      if (value.image && value.video) {
        return helpers.error("object.xor");
      }
      return value;
    })
    .messages({
      "object.xor": "You cannot provide both 'image' and 'video'.",
    })
    .min(1)
    .messages({
      "object.min":
        "At least one field must be provided to update the product image",
    });

  console.log(req.body);

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    // If image is provided and invalid, delete the image
    if (req.body.image && req.body.image !== "") {
      deleteImages([req.body.image]);
    }

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateEditSlider };
