import { NextFunction, Request, Response } from "express";
import { NewsLetterService } from "../services";
import { INewsLetter } from "../interfaces";

export class NewsLetterController {
  private newsLetterService: NewsLetterService;

  constructor() {
    this.newsLetterService = new NewsLetterService();
  }

  public async createNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newsLetterData: INewsLetter = req.body;
      const result = await this.newsLetterService.createNewsLetter(
        newsLetterData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getNewsLetters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.newsLetterService.getNewsLetters();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newsLetterId = req.params.newsLetterId;
      const result = await this.newsLetterService.deleteNewsLetter(
        newsLetterId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
