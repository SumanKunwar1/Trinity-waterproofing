import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services";
import { INotification } from "../interfaces";

export class NotificationController {
  public async createNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const notificationData: INotification = req.body;

      const notification = await NotificationService.createNotification(
        notificationData
      );

      res.locals.responseData = notification;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getNotificationsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const notifications = await NotificationService.getNotificationsByUserId(
        userId
      );

      res.locals.responseData = notifications;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
