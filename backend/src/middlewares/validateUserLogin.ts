import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validateUserLogin = (req: Request, res: Response, next: NextFunction):void => {
  // Define Joi validation schema
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  });

  // Validate request body
  const { error } = schema.validate(req.body);

  if (error) {
    const errors = error.details.map(err => ({
      field: err.context?.key,
      message: err.message,
    }));

    // Send a standardized error response
    res.status(400).json({
      message: errors,
    });
    return;
  }

  next();
};

export { validateUserLogin };
