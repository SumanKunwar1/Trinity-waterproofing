import { NextFunction, Request, Response } from "express";
import { PrivacyPolicyService } from "../services";
import { IPrivacyPolicy } from "../interfaces";

export class PrivacyPolicyController {
  private privacyPolicyService: PrivacyPolicyService;

  constructor() {
    this.privacyPolicyService = new PrivacyPolicyService();
  }

  public async createPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const policyData: IPrivacyPolicy = req.body;
      const result = await this.privacyPolicyService.createPolicy(policyData);
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

  public async getAllPolicies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.privacyPolicyService.getAllPolicies();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deletePolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const privacyPolicyId = req.params.privacyPolicyId;
      const result = await this.privacyPolicyService.deletePolicyById(
        privacyPolicyId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
