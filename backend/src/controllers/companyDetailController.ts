import { NextFunction, Request, Response } from "express";
import { CompanyDetailService } from "../services";
import { ICompanyDetail } from "../interfaces";

export class CompanyDetailController {
  private companyDetailService: CompanyDetailService;

  constructor() {
    this.companyDetailService = new CompanyDetailService();
  }

  public async getCompanyDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.companyDetailService.getCompanyDetails();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async putCompanyDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const companyDetailData: ICompanyDetail = req.body;
      const result = await this.companyDetailService.putCompanyDetails(
        companyDetailData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
