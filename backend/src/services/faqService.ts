import { Faq } from "../models";
import { IFaq } from "../interfaces";
import { httpMessages } from "../middlewares";

export class FaqService {
  public async createFaq(faqData: IFaq) {
    try {
      const { question } = faqData;

      const isPresent = await Faq.findOne({ question });
      if (isPresent) {
        throw httpMessages.ALREADY_PRESENT(`FAQ with question "${question}"`);
      }

      const faq = new Faq(faqData);
      await faq.save();
      return faq;
    } catch (error) {
      throw error;
    }
  }

  public async getFaqs() {
    try {
      const faqs = await Faq.find();
      return faqs || [];
    } catch (error) {
      throw error;
    }
  }

  public async editFaq(faqId: string, updateData: Partial<IFaq>) {
    try {
      const faq = await Faq.findById(faqId);
      if (!faq) {
        throw httpMessages.NOT_FOUND("FAQ");
      }

      const { question, answer } = updateData;
      if (question) faq.question = question;
      if (answer) faq.answer = answer;

      await faq.save();
      return faq;
    } catch (error) {
      throw error;
    }
  }

  public async deleteFaq(faqId: string) {
    try {
      const faq = await Faq.findById(faqId);
      if (!faq) {
        throw httpMessages.NOT_FOUND("FAQ");
      }

      await Faq.deleteOne({ _id: faqId });
      return { message: "FAQ deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
