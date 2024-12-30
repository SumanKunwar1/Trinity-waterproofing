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

  public async markNotificationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;
      const updatedNotification =
        await NotificationService.markNotificationAsRead(notificationId);
      res.locals.responseData = updatedNotification;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notificationId } = req.params;
      const deletedNotification = await NotificationService.deleteNotification(
        notificationId
      );
      res.locals.responseData = deletedNotification;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async markAllNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const updatedNotifications =
        await NotificationService.markAllNotificationsAsRead(userId);
      res.locals.responseData = updatedNotifications;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async clearAllNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      console.log("IN THE CLEAR ALL NOTIFICATION CONTROLLER", userId);
      await NotificationService.clearAllNotifications(userId);
      res.locals.responseData = { message: "All notifications cleared" };
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
