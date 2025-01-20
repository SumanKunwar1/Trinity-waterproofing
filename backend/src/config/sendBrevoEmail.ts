import dotenv from "dotenv";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { getCachedSenderDetails } from "./cacheSenderData";

dotenv.config();

const API_KEY = process.env.SENDINBLUE_API_KEY;

if (!API_KEY) {
  throw new Error("SENDINBLUE_API_KEY is not defined in the .env file");
}

const client = new TransactionalEmailsApi();
client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, API_KEY);

export const sendBrevoEmail = async (
  receiver: { name: string; email: string },
  subject: string,
  content: { html: string; text: string }
): Promise<void> => {
  try {
    const { email: senderEmail, name: senderName } = getCachedSenderDetails();
    if (!senderEmail || !senderName) {
      return;
    }
    const emailData = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: receiver.email, name: receiver.name }],
      subject,
      htmlContent: content.html,
      textContent: content.text,
    };

    const response = await client.sendTransacEmail(emailData);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
