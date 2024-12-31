import { NextFunction, Request, Response } from "express";
import { GalleryService } from "../services";
import { deleteImages } from "../config/deleteImages";

export class GalleryController {
  private galleryService: GalleryService;

  constructor() {
    this.galleryService = new GalleryService();
  }

  public async createFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { folderName } = req.body;
      const result = await this.galleryService.createFolder(folderName);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { folderName, image } = req.body;
      console.log(folderName, image);
      const result = await this.galleryService.uploadImage(folderName, image);

      res.locals.responseData = result;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages(req.body.image);
      }
      next(error);
    }
  }

  public async getFolders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.galleryService.getFolders();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { folderName } = req.body;
      const result = await this.galleryService.getFiles(folderName);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { path } = req.body;
      const result = await this.galleryService.deleteItem(path);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
