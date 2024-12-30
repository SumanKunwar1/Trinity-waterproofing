import { Slider } from "../models";
import { ISlider } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class SliderService {
  public async getSliders() {
    try {
      const sliders = await Slider.find();
      const sliderResponse = sliders.map((slider) => {
        let media;

        if (slider.media.type === "image") {
          media = `/api/image/${slider.media.url}`;
        } else if (slider.media.type === "video") {
          media = `/api/image/${slider.media.url}`;
        }

        return {
          ...slider.toObject(),
          media: media,
        };
      });

      return sliderResponse;
    } catch (error) {
      throw error;
    }
  }

  public async displaySlider() {
    try {
      const sliders = await Slider.find({ isvisible: true });
      const sliderResponse = sliders.map((slider) => {
        let media;

        if (slider.media.type === "image") {
          media = `/api/image/${slider.media.url}`;
        } else if (slider.media.type === "video") {
          media = `/api/image/${slider.media.url}`;
        }

        return {
          ...slider.toObject(),
          media: media,
        };
      });
      return sliderResponse;
    } catch (error) {
      throw error;
    }
  }

  public async createSlider(sliderData: ISlider) {
    try {
      const { image, video, title, subtitle, isvisible } = sliderData;
      let media;
      if (image) {
        media = {
          type: "image",
          url: image,
        };
      } else {
        media = {
          type: "video",
          url: video,
        };
      }
      const slider = new Slider({ title, subtitle, isvisible, media });
      await slider.save();
      return slider;
    } catch (error) {
      throw error;
    }
  }

  public async editSlider(sliderData: Partial<ISlider>, sliderId: string) {
    try {
      const { title, subtitle, image, video, isvisible } = sliderData;
      const slider = await Slider.findById(sliderId);

      if (!slider) {
        throw httpMessages.NOT_FOUND("Slider");
      }

      let media;

      if (image) {
        if (slider.media) {
          await deleteImages([slider.media.url]);
        }
        media = { type: "image", url: image };
      } else if (video) {
        if (slider.media) {
          await deleteImages([slider.media.url]);
        }
        media = { type: "video", url: video };
      } else {
        media = slider.media;
      }

      if (media) {
        slider.media = media;
      }

      if (title) {
        slider.title = title;
      }
      if (subtitle) {
        slider.subtitle = subtitle;
      }
      if (typeof isvisible !== "undefined") {
        slider.isvisible = isvisible;
      }
      await slider.save();
      return slider;
    } catch (error) {
      throw error;
    }
  }

  public async deleteSlider(sliderId: string) {
    try {
      const slider = await Slider.findById(sliderId);
      if (!slider) {
        throw httpMessages.NOT_FOUND("Slider");
      }

      const filesToDelete = [slider.media.url];

      if (filesToDelete.length > 0) {
        await deleteImages(filesToDelete); // Delete associated media
      }

      await Slider.deleteOne({ _id: sliderId });
      return {
        message: "Slider deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
