import { NewsLetter } from "../models";
import { INewsLetter } from "../interfaces";
import { httpMessages } from "../middlewares";

export class NewsLetterService {
  public async createNewsLetter(newsLetterData: INewsLetter) {
    try {
      const { email } = newsLetterData;

      const isPresent = await NewsLetter.findOne({ email });
      if (isPresent) {
        throw httpMessages.ALREADY_PRESENT(
          `Your email "${email}" has already been used to subscribe to the newsletter.`
        );
      }

      const newsLetter = new NewsLetter(newsLetterData);
      await newsLetter.save();
      return newsLetter;
    } catch (error) {
      throw error;
    }
  }

  public async getNewsLetters() {
    try {
      const newsLetters = await NewsLetter.find();
      return newsLetters || [];
    } catch (error) {
      throw error;
    }
  }

  public async deleteNewsLetter(newsLetterId: string) {
    try {
      const newsLetter = await NewsLetter.findById(newsLetterId);
      if (!newsLetter) {
        throw httpMessages.NOT_FOUND("Newsletter");
      }

      await NewsLetter.deleteOne({ _id: newsLetterId });
      return { message: "Newsletter subscription deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
