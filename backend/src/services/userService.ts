import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { IUser, IAddress } from "../interfaces";
import { httpMessages } from "../middlewares";

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

      const isMatch = bcrypt.compare(password, user.password as string);
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

  public async getUsers() {
    try {
      const users = await User.find({}, "fullName email role createdAt number");
      return users;
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

      const { fullName, email, number, role } = updatedData;

      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (number) user.number = number;
      if (role) user.role = role;
      console.log(user);

      await user.save();

      return {
        fullName: user.fullName,
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
      console.log(error);
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
      console.error(error);
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
      console.error(error);
      throw error;
    }
  }

  public async getAddress(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }
      console.log(user.addressBook);
      return { addressBook: user.addressBook };
    } catch (error) {
      console.error(error);
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
      console.error(error);
      throw error;
    }
  }
}
