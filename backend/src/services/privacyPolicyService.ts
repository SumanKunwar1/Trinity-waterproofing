import { PrivacyPolicy } from "../models";
import { IPrivacyPolicy } from "../interfaces";
import { httpMessages } from "../middlewares";

export class PrivacyPolicyService {
  public async createPolicy(policyData: IPrivacyPolicy) {
    try {
      const { content } = policyData;

      const isPolicyPresent = await PrivacyPolicy.findOne({ content });
      if (isPolicyPresent) {
        throw httpMessages.ALREADY_PRESENT("Privacy Policy");
      }

      const newPolicy = new PrivacyPolicy(policyData);
      await newPolicy.save();
      return newPolicy;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPolicies() {
    try {
      const policies = await PrivacyPolicy.find().sort({
        version: -1,
        createdAt: -1,
      });
      if (!policies || policies.length === 0) {
        return [];
      }

      return policies;
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

  public async deletePolicyById(privacyPolicyId: string) {
    try {
      const policy = await PrivacyPolicy.findById(privacyPolicyId);

      if (!policy) {
        throw httpMessages.NOT_FOUND("Privacy Policy");
      }

      await PrivacyPolicy.deleteOne({ _id: privacyPolicyId });

      return policy;
    } catch (error) {
      throw error;
    }
  }
}
