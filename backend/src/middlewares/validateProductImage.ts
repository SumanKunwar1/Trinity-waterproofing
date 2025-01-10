import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { httpMessages } from "../middlewares";
import { deleteProductImages } from "../config/deleteImages";

const validateProductImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    productImage: Joi.string().optional().messages({
      "string.base": "Product Image must be a valid URL",
      "any.required": "Product Image is required",
    }),
    image: Joi.array().items(Joi.string()).optional().messages({
      "array.base": "Images must be an array of valid filename",
    }),
  });
  console.log(req.body);
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    }));

    deleteProductImages(req);

    return next(
      httpMessages.BAD_REQUEST(
        `${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`
      )
    );
  }

  next();
};

export { validateProductImage };
