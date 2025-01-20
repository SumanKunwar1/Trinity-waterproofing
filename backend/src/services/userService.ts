import bcrypt from "bcryptjs";
import { User } from "../models";
import { IUser, IAddress } from "../interfaces";
import { httpMessages } from "../middlewares";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generatePasswordResetToken,
} from "../config/tokenUtils";
import { sendBrevoEmail } from "../config/sendBrevoEmail";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;
export class UserService {
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

  public async loginUser(email: string, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password as string);

      if (!isMatch) {
        throw httpMessages.INVALID_CREDENTIALS;
      }

      const token = generateAccessToken(
        user._id.toString(),
        user.email,
        user.role
      );

      const refreshToken = generateRefreshToken(
        user._id.toString(),
        user.email,
        user.role
      );

      return { token, user, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(refreshToken: string) {
    try {
      const decoded: any = verifyToken(refreshToken);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const newAccessToken = generateAccessToken(
        user._id.toString(),
        user.email,
        user.role
      );

      const newRefreshToken = generateRefreshToken(
        user._id.toString(),
        user.email,
        user.role
      );

      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async getUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  public static async getUserById(userId: string) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async editUser(userId: string, updatedData: Partial<IUser>) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const { fullName, email, number, role, password } = updatedData;

      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (number) user.number = number;
      if (role) user.role = role;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }

      await user.save();

      return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        number: user.number,
      };
    } catch (error) {
      throw error;
    }
  }

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

      const isMatch = bcrypt.compare(oldPassword, user.password as string);
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

  public async forgotPasswordRequest(email: string): Promise<any> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw httpMessages.NOT_FOUND(`User with email:${email}`);
      }

      const resetToken = generatePasswordResetToken(
        user._id.toString(),
        user.email,
        user.role
      );

      await sendPasswordResetEmail(user, resetToken);
      return {
        message:
          "Password reset email sent successfully. Please check your inbox.",
      };
    } catch (error) {
      throw error;
    }
  }

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

  public async addAddress(userId: string, addressData: IAddress) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      if (addressData.default) {
        user.addressBook.forEach((address) => {
          address.default = false;
        });
      }

      user.addressBook.push(addressData);
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async editAddress(
    userId: string,
    addressData: IAddress,
    addressBookId: string
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }

      const addressIndex = user.addressBook.findIndex(
        (address) => address._id.toString() === addressBookId
      );

      if (addressIndex === -1) {
        throw httpMessages.NOT_FOUND("AddressBook not found");
      }

      if (addressData.default) {
        user.addressBook.forEach((address) => {
          address.default = false;
        });
      }

      user.addressBook[addressIndex] = {
        ...user.addressBook[addressIndex],
        ...addressData,
      };

      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async editDefaultAddress(userId: string, addressBookId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }
      const addressBookIndex = user.addressBook.findIndex(
        (address) => address._id.toString() === addressBookId
      );

      if (addressBookIndex === -1) {
        throw httpMessages.NOT_FOUND("Address not found");
      }

      // Step 1: Set the specified address as the default
      user.addressBook.forEach((address, index) => {
        if (index === addressBookIndex) {
          address.default = true; // Set the current address as the default
        } else {
          address.default = false; // Set all other addresses to not be default
        }
      });
      await user.save();
      return { message: "AddressBook deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  public async getAddress(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }
      return { addressBook: user.addressBook };
    } catch (error) {
      throw error;
    }
  }
  public async deleteAddress(userId: string, addressBookId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }

      const addressIndex = user.addressBook.findIndex(
        (address) => address._id.toString() === addressBookId
      );

      if (addressIndex === -1) {
        throw httpMessages.NOT_FOUND("Address not found");
      }

      user.addressBook.splice(addressIndex, 1);
      await user.save();
      return { message: "AddressBook deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

export const sendPasswordResetEmail = async (
  user: any,
  resetToken: string
): Promise<void> => {
  const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <div style="font-family: sans-serif; background-color: #f3f4f6; padding: 2rem; color: #111827;">
      <div style="max-width: 32rem; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 0.5rem; padding: 1.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; text-align: center; color: #2563eb;">
          Password Reset Request
        </h2>
        <p style="color: #4b5563; text-align: center; margin-top: 0.5rem;">
          You have requested to reset your password. Click the button below to set a new password.
        </p>

        <div style="margin-top: 1.5rem; text-align: center;">
          <a href="${resetLink}" 
             style="background-color: #2563eb; color: white; padding: 0.75rem 2rem; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; text-decoration: none; display: inline-block;">
            Reset Your Password
          </a>
        </div>

        <div style="margin-top: 1.5rem; color: #4b5563;">
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p style="margin-top: 0.5rem; text-align: center;">
            For further assistance, contact our support team at 
            <a href="mailto:info@trinitywaterproofing.com.np" style="color: #2563eb; font-weight: 600;">
              info@trinitywaterproofing.com.np
            </a>
          </p>
        </div>

        <div style="margin-top: 2rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
          <p>This link will expire in 1 hour for security reasons.</p>
          <p style="margin-top: 0.5rem;">Thank you for using <strong>Trinity Waterproofing</strong>.</p>
        </div>

        <div style="margin-top: 1.5rem; font-size: 0.75rem; color: #6b7280; text-align: center;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Trinity Waterproofing, All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
    Password Reset Request

    We received a password reset request for your account. 
    Please visit the following link to reset your password: ${resetLink}

    This link will expire in 1 hour for security reasons.

    If you didn't request this reset, please ignore this email.

    For assistance, contact: info@trinitywaterproofing.com.np

    Thank you for using Trinity Waterproofing.
  `;

  await sendBrevoEmail(
    { name: user.fullName, email: user.email },
    "Password Reset Request",
    { html: htmlContent, text: textContent }
  );
};
