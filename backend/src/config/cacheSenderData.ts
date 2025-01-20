import { CompanyDetails } from "../models";

let cachedSenderEmail: string | null = null;
let cachedSenderName: string | null = null;

export const initializeSenderCache = async () => {
  try {
    const companyDetail = await CompanyDetails.findOne({}, "name email");

    if (companyDetail) {
      cachedSenderEmail = companyDetail.email || "pkharel156@gmail.com";
      cachedSenderName = companyDetail.name || "Pabitra Kharel";
    } else {
      cachedSenderEmail = "pkharel156@gmail.com";
      cachedSenderName = "Pabitra Kharel";
    }
  } catch (error) {
    console.error("Error initializing sender cache:", error);
  }
};

export const updateSenderCache = (email: string, name: string) => {
  cachedSenderEmail = email;
  cachedSenderName = name;
};

export const getCachedSenderDetails = (): {
  email: string | null;
  name: string | null;
} => {
  return {
    email: cachedSenderEmail,
    name: cachedSenderName,
  };
};
