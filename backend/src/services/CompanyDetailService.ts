import { CompanyDetails } from "../models";
import { ICompanyDetail } from "../interfaces";

export class CompanyDetailService {
  public async getCompanyDetails() {
    try {
      const companyDetail = await CompanyDetails.findOne();
      if (!companyDetail) {
        return "";
      }
      return companyDetail;
    } catch (error) {
      throw error;
    }
  }

  public async putCompanyDetails(companyDetailData: any) {
    try {
      // Define the allowed fields
      const allowedFields: Array<keyof ICompanyDetail> = [
        "name",
        "description",
        "phoneNumber",
        "location",
        "email",
        "twitter",
        "facebook",
        "google_plus",
        "youtube",
        "linkedin",
        "instagram",
      ];

      // Filter the incoming data to include only allowed fields
      const filteredData: Partial<ICompanyDetail> = Object.keys(
        companyDetailData
      )
        .filter((key) => allowedFields.includes(key as keyof ICompanyDetail))
        .reduce((obj, key) => {
          obj[key as keyof ICompanyDetail] = companyDetailData[key];
          return obj;
        }, {} as Partial<ICompanyDetail>);

      // Check if a company detail record already exists
      const existingCompanyDetail = await CompanyDetails.findOne();

      if (existingCompanyDetail) {
        // Update the existing record
        const updatedCompanyDetail = await CompanyDetails.findOneAndUpdate(
          {},
          { $set: filteredData },
          { new: true }
        );
        return updatedCompanyDetail;
      }

      // Create a new record if none exists
      const newCompanyDetail = new CompanyDetails(filteredData);
      await newCompanyDetail.save();
      return newCompanyDetail;
    } catch (error) {
      throw error;
    }
  }
}
