import { NextFunction, Request, Response } from "express";
import { EnquiryService } from "../services";
import { IEnquiry } from "../interfaces";

export class EnquiryController {
  private enquiryService: EnquiryService;

  constructor() {
    this.enquiryService = new EnquiryService();
  }

  public async createEnquiry(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enquiryData: IEnquiry = req.body;
      const result = await this.enquiryService.createEnquiry(enquiryData);
      res.locals.responseData = result;
    } catch (error) {
      next(error);
    }
  }

  public async getEnquiries(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.enquiryService.getEnquiries();
      res.locals.responseData = result;
    } catch (error) {
      next(error);
    }
  }

  public async deleteEnquiry(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const enquiryId = req.params.enquiryId;
      const result = await this.enquiryService.deleteEnquiry(enquiryId);
      res.locals.responseData = result;
    } catch (error) {
      next(error);
    }
  }
}
