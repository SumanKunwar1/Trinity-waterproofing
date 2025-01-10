import { NextFunction, Request, Response } from "express";
import { ShippingPolicyService } from "../services";
import { IPolicy } from "../interfaces";

export class ShippingPolicyController {
  private shippingPolicyService: ShippingPolicyService;

  constructor() {
    this.shippingPolicyService = new ShippingPolicyService();
  }

  // Create a new shipping policy
  public async createPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const policyData: IPolicy = req.body;
      const result = await this.shippingPolicyService.createPolicy(policyData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Get all shipping policies
  public async getPolicies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.shippingPolicyService.getPolicies();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Edit an existing shipping policy
  public async editPolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const shippingPolicyId = req.params.shippingPolicyId;
      const updateData: Partial<IPolicy> = req.body;
      const result = await this.shippingPolicyService.editPolicy(
        shippingPolicyId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // Delete a shipping policy
  public async deletePolicy(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const shippingPolicyId = req.params.shippingPolicyId;
      const result = await this.shippingPolicyService.deletePolicyById(
        shippingPolicyId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
