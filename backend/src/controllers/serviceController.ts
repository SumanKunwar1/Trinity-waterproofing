import { NextFunction, Request, Response } from "express";
import { ServiceService } from "../services";
import { IService } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  // ------------------------ Service CRUD ------------------------

  public async createService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const serviceData: IService = req.body;
      const result = await this.serviceService.createService(serviceData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  public async getService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.serviceService.getService();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updateData: Partial<IService> = req.body;
      const result = await this.serviceService.editService(updateData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      next(error);
    }
  }

  // ------------------------ Card CRUD ------------------------

  public async createCard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cardData: IService = req.body;
      const result = await this.serviceService.createCard(cardData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getCardsForService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.serviceService.getCardsForService();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editCard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cardId = req.params.cardId;
      const updateData: Partial<IService> = req.body;
      const result = await this.serviceService.editCard(cardId, updateData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteCard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cardId = req.params.cardId;
      const result = await this.serviceService.deleteCard(cardId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // ------------------------ Section CRUD ------------------------
  public async createSection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sectionData: IService = req.body;
      const result = await this.serviceService.createSection(sectionData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getSectionsForService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.serviceService.getSectionsForService();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editSection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sectionId = req.params.sectionId;
      const updateData: Partial<IService> = req.body;
      const result = await this.serviceService.editSection(
        sectionId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteSection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sectionId = req.params.sectionId;
      const result = await this.serviceService.deleteSection(sectionId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
