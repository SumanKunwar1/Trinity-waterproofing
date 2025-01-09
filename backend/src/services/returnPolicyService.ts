import { ReturnPolicy } from "../models";
import { IPolicy } from "../interfaces";
import { httpMessages } from "../middlewares";

export class ReturnPolicyService {
  public async createPolicy(policyData: IPolicy) {
    try {
      const { title } = policyData;

      const isPolicyPresent = await ReturnPolicy.findOne({ title });
      if (isPolicyPresent) {
        throw httpMessages.ALREADY_PRESENT("Return Policy");
      }

      const newPolicy = new ReturnPolicy(policyData);
      await newPolicy.save();
      return newPolicy;
    } catch (error) {
      throw error;
    }
  }

  public async editPolicy(
    returnPolicyId: string,
    policyData: Partial<IPolicy>
  ) {
    try {
      const { title, description } = policyData;

      const existingPolicy = await ReturnPolicy.findById(returnPolicyId);
      if (!existingPolicy) {
        throw httpMessages.NOT_FOUND("Return Policy");
      }

      if (title) existingPolicy.title = title;
      if (description) existingPolicy.description = description;

      await existingPolicy.save();
      return existingPolicy;
    } catch (error) {
      throw error;
    }
  }

  public async getPolicies() {
    try {
      const policies = await ReturnPolicy.find();
      if (!policies || policies.length === 0) {
        return [];
      }

      return policies;
    } catch (error) {
      throw error;
    }
  }

  public async deletePolicyById(returnPolicyId: string) {
    try {
      const policy = await ReturnPolicy.findById(returnPolicyId);

      if (!policy) {
        throw httpMessages.NOT_FOUND("Return Policy");
      }

      await ReturnPolicy.deleteOne({ _id: returnPolicyId });

      return policy;
    } catch (error) {
      throw error;
    }
  }
}
