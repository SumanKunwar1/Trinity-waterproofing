import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models";
import { httpMessages } from "../middlewares";

export class UserService {
  // Create a new user
  public async createUser(userData: IUser) {
    try {
      const { email, password } = userData;

      const isPresent = await User.findOne({ email });
      if (isPresent) {
        throw httpMessages.ALREADY_PRESENT("User");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userWithHashedPassword = { ...userData, password: hashedPassword };

      const user = new User(userWithHashedPassword);
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Login user and return a token
  public async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw httpMessages.INVALID_CREDENTIALS;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return { token, user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get user details
  public async getUsers() {
    try {
      const users = await User.find({}, "fullName email role createdAt number");
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Edit user details
  public async editUser(userId: string, updatedData: Partial<IUser>) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const { fullName, email, number, role } = updatedData;

      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (number) user.number = number;
      if (role) user.role = role;
      console.log(user);

      await user.save();

      return {
        name: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        number: user.number,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Edit user password
  public async editPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw httpMessages.INVALID_CREDENTIALS;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;

      await user.save();

      return {
        message: "Password updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // public async forgotPassword(
  //   userId: string,
  //   email: string,
  //   newPassword: string
  // ) {
  //   try {
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       throw httpMessages.NOT_FOUND("User");
  //     }

  //     const isMatch = email === user.email;
  //     if (!isMatch) {
  //       throw httpMessages.INVALID_CREDENTIALS;
  //     }

  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(newPassword, salt);

  //     user.password = hashedPassword;

  //     await user.save();

  //     return {
  //       message: "Password updated successfully",
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // Delete a user
  public async deleteUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }
      if (user.role === "admin") {
        throw httpMessages.BAD_REQUEST("Cannot Delete Admin");
      }

      await User.deleteOne({ _id: userId });

      return {
        message: "User deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
