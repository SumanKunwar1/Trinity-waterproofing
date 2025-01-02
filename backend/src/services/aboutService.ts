import { ITabAbout } from "../interfaces";
import { httpMessages } from "../middlewares";
import { About } from "../models";
import { deleteImages } from "../config/deleteImages";
import { Types } from "mongoose";

interface ITabWithId extends ITabAbout {
  _id: Types.ObjectId;
}

export class AboutService {
  public async createTab(tabData: ITabAbout) {
    try {
      let about = await About.findOne();

      if (about) {
        about.tabs.push(tabData);
        return await about.save();
      } else {
        about = new About({
          tabs: [tabData],
        });
        await about.save();
        return about;
      }
    } catch (error) {
      throw error;
    }
  }

  public async getTabs() {
    try {
      const about = await About.findOne();
      return about || "";
    } catch (error) {
      throw error;
    }
  }

  public async editTab(
    tabId: string,
    updateData: Partial<ITabAbout>
  ): Promise<any> {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About Document");
      }

      const tabs = about.tabs as ITabWithId[];

      const tabIndex = tabs.findIndex((tab) => tab._id.toString() === tabId);
      if (tabIndex === -1) {
        throw httpMessages.NOT_FOUND("About Tab");
      }

      about.tabs[tabIndex] = { ...about.tabs[tabIndex], ...updateData };
      return await about.save();
    } catch (error) {
      throw error;
    }
  }

  public async uploadTabImage(imagePath: string) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About Document");
      }

      if (about.image) {
        await deleteImages([about.image]);
      }

      about.image = imagePath;
      await about.save();
      return about;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTab(tabId: string) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About Document");
      }
      const tabs = about.tabs as ITabWithId[];

      const tabIndex = tabs.findIndex((tab) => tab._id.toString() === tabId);
      if (tabIndex === -1) {
        throw httpMessages.NOT_FOUND("About Tab");
      }
      about.tabs.splice(tabIndex, 1);

      await about.save();
      return about;
    } catch (error) {
      throw error;
    }
  }
}
