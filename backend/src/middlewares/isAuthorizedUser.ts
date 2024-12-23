import { Request, Response, NextFunction } from "express";
import { User } from "../models"; // Import your User model
import { httpMessages } from "../middlewares"; // Assuming this contains your error messages

const isAuthorizedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(httpMessages.NOT_FOUND("User"));
    }
    if (user.email !== req.email && user.role !== req.role) {
      return next(
        httpMessages.FORBIDDEN(
          "You do not have permission to update this user's email"
        )
      );
    }
    next();
  } catch (error) {
    return next(error);
  }
};

export { isAuthorizedUser };
