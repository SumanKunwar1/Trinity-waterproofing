import { NextFunction, Request, Response } from "express";
import { PrivacyPolicyService } from "../services";
import { IPrivacyPolicy } from "../interfaces";

export class PrivacyPolicyController {
  private privacyPolicyService: PrivacyPolicyService;

  constructor() {
    this.privacyPolicyService = new PrivacyPolicyService();
  }

  public async createOrUpdatePolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const policyData: IPrivacyPolicy = req.body;
      const result = await this.privacyPolicyService.createOrUpdatePolicy(
        policyData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getLatestPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.privacyPolicyService.getLatestPolicy();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
