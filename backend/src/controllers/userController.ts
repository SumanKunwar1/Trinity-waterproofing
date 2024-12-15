import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services';  

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();  
  }

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;  
      console.log(userData);
      const result = await this.userService.createUser(userData); 
      res.locals.responseData =  result;
      next();
    } catch (error:any) {
            const responseError = {
              statusCode: error.statusCode || 500,
              message: error.message || "An unexpected error occurred",
          };
      
          res.locals.responseData = { error: responseError };
            next();
          }
    }

    public async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const {email, password} = req.body; 
        const result = await this.userService.loginUser(email, password); 
        res.locals.responseData =  result;
        next();
      } catch (error:any) {
              const responseError = {
                statusCode: error.statusCode || 500,
                message: error.message || "An unexpected error occurred",
            };
        
            res.locals.responseData = { error: responseError };
              next();
            }
      }
}
