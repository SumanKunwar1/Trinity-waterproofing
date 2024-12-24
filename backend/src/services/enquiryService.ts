import { Enquiry } from "../models";
import { IEnquiry } from "../interfaces";
import { httpMessages } from "../middlewares";

export class EnquiryService {
  public async getEnquiries() {
    try {
      const enquiries = await Enquiry.find();
      return enquiries;
    } catch (error) {
      throw error;
    }
  }

  public async deleteEnquiry(enquiryId: string) {
    try {
      const enquiry = await Enquiry.findById(enquiryId);

      if (!enquiry) {
        throw httpMessages.NOT_FOUND("enquiry");
      }

      await Enquiry.deleteOne({ _id: enquiryId });
      return {
        message: "Enquiry deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
