import { Slider } from "../models";
import { ISlider } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class SliderService {
  public async getSliders() {
    try {
      const sliders = await Slider.find();
      return sliders;
    } catch (error) {
      throw error;
    }
  }

  public async displaySlider() {
    try {
      const sliders = await Slider.find({ isvisible: true });
      return sliders;
    } catch (error) {
      throw error;
    }
  }

  public async createSlider(sliderData: ISlider) {
    try {
      const slider = new Slider(sliderData);
      await slider.save();

      return slider;
    } catch (error) {
      throw error;
    }
  }
  public async editSlider(sliderData: ISlider, sliderId: string) {
    try {
      const slider = await Slider.findById(sliderId);
      if (!slider) {
        throw httpMessages.NOT_FOUND("Slider");
      }

      return slider;
    } catch (error) {
      throw error;
    }
  }

  public async deleteSlider(enquiryId: string) {
    try {
      const slider = await Slider.findById(enquiryId);

      if (!slider) {
        throw httpMessages.NOT_FOUND("slider");
      }

      await Slider.deleteOne({ _id: enquiryId });
      return {
        message: "Slider deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
