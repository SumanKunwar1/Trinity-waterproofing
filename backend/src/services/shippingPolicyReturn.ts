import { ShippingPolicy } from "../models";
import { IPolicy } from "../interfaces";
import { httpMessages } from "../middlewares";

export class ShippingPolicyService {
  public async createPolicy(policyData: IPolicy) {
    try {
      const { title } = policyData;

      const isPolicyPresent = await ShippingPolicy.findOne({ title });
      if (isPolicyPresent) {
        throw httpMessages.ALREADY_PRESENT("Shipping Policy");
      }

      const newPolicy = new ShippingPolicy(policyData);
      await newPolicy.save();
      return newPolicy;
    } catch (error) {
      throw error;
    }
  }

  public async editPolicy(
    shippingPolicyId: string,
    policyData: Partial<IPolicy>
  ) {
    try {
      const { title, description } = policyData;

      const existingPolicy = await ShippingPolicy.findById(shippingPolicyId);
      if (!existingPolicy) {
        throw httpMessages.NOT_FOUND("Shipping Policy");
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
      const policies = await ShippingPolicy.find();
      if (!policies || policies.length === 0) {
        return [];
      }

      return policies;
    } catch (error) {
      throw error;
    }
  }

  public async deletePolicyById(shippingPolicyId: string) {
    try {
      const policy = await ShippingPolicy.findById(shippingPolicyId);

      if (!policy) {
        throw httpMessages.NOT_FOUND("Shipping Policy");
      }

      await ShippingPolicy.deleteOne({ _id: shippingPolicyId });

      return policy;
    } catch (error) {
      throw error;
    }
  }
}
