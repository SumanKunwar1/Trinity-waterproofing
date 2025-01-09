import { Request, Response, NextFunction } from "express";
import { MetaInfoService } from "../services";

export class MetaInfoController {
  private metaInfoService: MetaInfoService;

  constructor() {
    this.metaInfoService = new MetaInfoService();
  }

  public async getAllMetaInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const metaInfos = await this.metaInfoService.getAllMetaInfo();
      res.locals.responseData = metaInfos;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async createMetaInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const metaInfoData = req.body;
      const newMetaInfo = await this.metaInfoService.createMetaInfo(
        metaInfoData
      );
      res.locals.responseData = newMetaInfo;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async updateMetaInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { metaId } = req.params;
      const updatedData = req.body;
      const updatedMetaInfo = await this.metaInfoService.updateMetaInfo(
        metaId,
        updatedData
      );
      res.locals.responseData = updatedMetaInfo;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteMetaInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { metaId } = req.params;
      const deletedMetaInfo = await this.metaInfoService.deleteMetaInfo(metaId);
      res.locals.responseData = deletedMetaInfo;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
