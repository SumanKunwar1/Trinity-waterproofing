import { NextFunction, Request, Response } from "express";
import { FaqService } from "../services";
import { IFaq } from "../interfaces";

export class FaqController {
  private faqService: FaqService;

  constructor() {
    this.faqService = new FaqService();
  }

  public async createFaq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const faqData: IFaq = req.body;
      const result = await this.faqService.createFaq(faqData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getFaqs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.faqService.getFaqs();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editFaq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const faqId = req.params.faqId;
      const updateData: Partial<IFaq> = req.body;
      const result = await this.faqService.editFaq(faqId, updateData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteFaq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const faqId = req.params.faqId;
      const result = await this.faqService.deleteFaq(faqId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
