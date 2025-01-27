import { Slider } from "../models";
import { ISlider } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class SliderService {
  public async getSliders() {
    try {
      const sliders = await Slider.find();
      const sliderResponse = sliders.map((slider) => {
        let mediaUrl;

        // Construct media URL based on the type (image or video)
        if (slider.media.type === "image" || slider.media.type === "video") {
          mediaUrl = `/api/image/${slider.media.url}`; // Assuming your /api/image/ route handles both types
        }

        return {
          ...slider.toObject(),
          media: {
            // Return media as an object with type and url
            type: slider.media.type, // media type ("image" or "video")
            url: mediaUrl, // media URL
          },
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
        let mediaType;

        // Based on the media type, assign a value to media and mediaType
        if (slider.media.type === "image") {
          media = `/api/image/${slider.media.url}`;
          mediaType = "image";
        } else if (slider.media.type === "video") {
          mediaType = "video";
          media = `/api/image/${slider.media.url}`;
        }

        return {
          ...slider.toObject(), // Convert mongoose document to plain object
          media: media, // Add media URL
          mediaType: mediaType, // Add mediaType (image/video)
        };
      });

      return sliderResponse;
    } catch (error) {
      throw error;
    }
  }

  public async createSlider(sliderData: ISlider) {
    try {
      const { image, description, video, title, isvisible } = sliderData;
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
      const slider = new Slider({
        title,
        isvisible,
        media,
        description,
      });
      await slider.save();
      return slider;
    } catch (error) {
      throw error;
    }
  }

  public async editSlider(sliderData: Partial<ISlider>, sliderId: string) {
    try {
      const slider = await Slider.findById(sliderId);

      if (!slider) {
        throw httpMessages.NOT_FOUND("Slider");
      }

      // Handle media updates (if image or video is provided)
      if (sliderData.image || sliderData.video) {
        if (slider.media) {
          await deleteImages([slider.media.url]); // Delete old media
        }

        sliderData.media = sliderData.image
          ? { type: "image", url: sliderData.image as string }
          : { type: "video", url: sliderData.video as string };

        // Remove image and video from the data after setting media
        delete sliderData.image;
        delete sliderData.video;
      }

      // Use findByIdAndUpdate to apply updates
      const updatedSlider = await Slider.findByIdAndUpdate(
        sliderId,
        sliderData,
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
        }
      );

      return updatedSlider;
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
