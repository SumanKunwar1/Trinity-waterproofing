import { Request, Response, NextFunction } from "express";
import { AboutService } from "../services";
import { IAbout } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class AboutController {
  private aboutService: AboutService;

  constructor() {
    this.aboutService = new AboutService();
  }

  // Fetch the About document
  public async getAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const about = await this.aboutService.getAbout();
      res.locals.responseData = about;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Create a new About document
  public async createAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const aboutData: IAbout = req.body;
      console.log("in the create about controller", aboutData);
      const about = await this.aboutService.createAbout(aboutData);
      res.locals.responseData = about;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  // Edit an existing About document
  public async editAbout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const aboutData: Partial<IAbout> = req.body;
      const updatedAbout = await this.aboutService.editAbout(aboutData);
      res.locals.responseData = updatedAbout;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  // ------------------------ Core Methods ------------------------

  public async createCore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coreData: IAbout = req.body;
      const core = await this.aboutService.createCore(coreData);
      res.locals.responseData = core;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  public async getCore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const core = await this.aboutService.getCore();
      res.locals.responseData = core;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editCore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coreId = req.params.coreId;
      const coreData: Partial<IAbout> = req.body;
      const updatedCore = await this.aboutService.editCore(coreId, coreData);
      res.locals.responseData = updatedCore;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  public async deleteCore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coreId = req.params.coreId;
      const result = await this.aboutService.deleteCore(coreId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------ Tab Methods ------------------------

  public async createTab(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tabData: IAbout = req.body;
      const tab = await this.aboutService.createTab(tabData);
      res.locals.responseData = tab;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  public async getTabs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tabs = await this.aboutService.getTabs();
      res.locals.responseData = tabs;
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
      const tabData: Partial<IAbout> = req.body;
      const updatedTab = await this.aboutService.editTab(tabId, tabData);
      res.locals.responseData = updatedTab;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
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
