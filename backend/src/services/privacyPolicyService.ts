import { PrivacyPolicy } from "../models";
import { IPrivacyPolicy } from "../interfaces";
import { httpMessages } from "../middlewares";

export class PrivacyPolicyService {
  public async createOrUpdatePolicy(policyData: IPrivacyPolicy) {
    try {
      const existingPolicy = await PrivacyPolicy.findOne();

      if (existingPolicy) {
        existingPolicy.content = policyData.content;
        await existingPolicy.save();
        return existingPolicy; // Returning the updated policy
      } else {
        const newPolicy = new PrivacyPolicy(policyData);
        await newPolicy.save();
        return newPolicy;
      }
    } catch (error) {
      throw error;
    }
  }

  public async getLatestPolicy() {
    try {
      const latestPolicy = await PrivacyPolicy.findOne().sort({
        version: -1,
        createdAt: -1,
      });
      if (!latestPolicy) {
        return "";
      }

      return latestPolicy;
    } catch (error) {
      throw error;
    }
  }
}
