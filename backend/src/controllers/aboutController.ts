import { NextFunction, Request, Response } from "express";
import { AboutService } from "../services";
import { ITabAbout } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class AboutController {
  private aboutService: AboutService;

  constructor() {
    this.aboutService = new AboutService();
  }

  public async createTab(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tabData: ITabAbout = req.body;
      const result = await this.aboutService.createTab(tabData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getTabs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.aboutService.getTabs();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editTab(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tabId = req.params.tabId;
      const updateData: Partial<ITabAbout> = req.body;
      const result = await this.aboutService.editTab(tabId, updateData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async uploadTabImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const image = req.body.image;
      const result = await this.aboutService.uploadTabImage(image);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteTab(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tabId = req.params.tabId;
      const result = await this.aboutService.deleteTab(tabId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
