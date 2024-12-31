import { CompanyDetails } from "../models";
import { ICompanyDetail } from "../interfaces";
import { httpMessages } from "../middlewares";

export class CompanyDetailService {
  public async getCompanyDetails() {
    try {
      const companyDetail = await CompanyDetails.findOne();
      if (!companyDetail) {
        return [];
      }
      return companyDetail;
    } catch (error) {
      throw error;
    }
  }

  public async putCompanyDetails(companyDetailData: ICompanyDetail) {
    try {
      const existingCompanyDetail = await CompanyDetails.findOne();

      if (existingCompanyDetail) {
        const updatedCompanyDetail = await CompanyDetails.findOneAndUpdate(
          {},
          { $set: companyDetailData },
          { new: true }
        );
        return updatedCompanyDetail;
      }

      const newCompanyDetail = new CompanyDetails(companyDetailData);
      await newCompanyDetail.save();
      return newCompanyDetail;
    } catch (error) {
      throw error;
    }
  }
}
