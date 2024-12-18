import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models";
import { httpMessages } from "../middlewares";

export class UserService {
  public async createUser(userData: IUser) {
    try {
      console.log(userData);
      const { email, password } = userData;

      const isPresent = await User.findOne({ email });
      if (isPresent) {
        throw httpMessages.ALREADY_PRESENT;
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

  public async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw httpMessages.NOT_FOUND;
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

      // Return the token
      return { token, user };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
