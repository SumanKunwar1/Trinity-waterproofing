import { CompanyDetails } from "../models";

let cachedSenderEmail: string | null = null;
let cachedSenderName: string | null = null;

const initializeSenderCache = async () => {
  try {
    const companyDetail = await CompanyDetails.findOne({}, "name, email");

    if (companyDetail) {
      cachedSenderEmail = companyDetail.email || "pkharel156@gmail.com";
      cachedSenderName = companyDetail.name || "Pabitra Kharel";

      console.log(`✌ Cached sender email: ${cachedSenderEmail} ✌`);
      console.log(`✌ Cached sender name: ${cachedSenderName} ✌`);
    } else {
      cachedSenderEmail = "pkharel156@gmail.com";
      cachedSenderName = "Pabitra Kharel";
      console.log("No company details found, using default values.");
    }
  } catch (error) {
    console.error("Error initializing sender cache:", error);
  }
};

initializeSenderCache();

export const updateSenderCache = (email: string, name: string) => {
  console.log(`Setting new cache with email: ${email}, name: ${name}`); // Debug log

  cachedSenderEmail = email;
  cachedSenderName = name;

  console.log(`✌ Updated cached sender email: ${cachedSenderEmail} ✌`);
  console.log(`✌ Updated cached sender name: ${cachedSenderName} ✌`);
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
