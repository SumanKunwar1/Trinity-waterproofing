import { NextFunction, Request, Response } from "express";
import { ReturnPolicyService } from "../services";
import { IPolicy } from "../interfaces";

export class ReturnPolicyController {
  private returnPolicyService: ReturnPolicyService;

  constructor() {
    this.returnPolicyService = new ReturnPolicyService();
  }

  // Create a new return policy
  public async createPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const policyData: IPolicy = req.body;
      const result = await this.returnPolicyService.createPolicy(policyData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Get all return policies
  public async getPolicies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.returnPolicyService.getPolicies();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Edit an existing return policy
  public async editPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const returnPolicyId = req.params.returnPolicyId;
      const updateData: Partial<IPolicy> = req.body;
      const result = await this.returnPolicyService.editPolicy(
        returnPolicyId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Delete a return policy
  public async deletePolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const returnPolicyId = req.params.returnPolicyId;
      const result = await this.returnPolicyService.deletePolicyById(
        returnPolicyId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
