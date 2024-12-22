import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { IUser } from "../interfaces";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IUser = req.body;
      const result = await this.userService.createUser(userData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.userService.loginUser(email, password);
      res.locals.responseData = result;
      console.log("we got the result");
      next();
    } catch (error: any) {
      console.log("we got the error");
      next(error);
    }
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const result = await this.userService.getUsers();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const updatedData: Partial<IUser> = req.body;
      const result = await this.userService.editUser(userId, updatedData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;
      const result = await this.userService.editPassword(
        userId,
        oldPassword,
        newPassword
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const result = await this.userService.deleteUser(userId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async addAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const addressData = req.body;
      const result = await this.userService.addAddress(userId, addressData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const addressBookId = req.params.addressBookId;
      const addressData = req.body;
      const result = await this.userService.editAddress(
        userId,
        addressData,
        addressBookId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editDefaultAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const addressBookId = req.params.addressBookId;
      const result = await this.userService.editDefaultAddress(
        userId,
        addressBookId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
  public async deleteAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const addressBookId = req.params.addressBookId;
      const result = await this.userService.deleteAddress(
        userId,
        addressBookId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
