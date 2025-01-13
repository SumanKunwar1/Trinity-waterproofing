import axios from "axios";

const API_BASE_URL = "/api/privacy-policy";

export const getLatestPrivacyPolicy = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createOrUpdatePrivacyPolicy = async (content: string) => {
  const response = await axios.put(
    API_BASE_URL,
    { content },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  return response.data;
};
