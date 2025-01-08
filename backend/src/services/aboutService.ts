import { About } from "../models";
import { IAbout } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class AboutService {
  // ------------------------ About CRUD ------------------------

  public async createAbout(aboutData: IAbout) {
    try {
      const isAboutPresent = await About.findOne();
      if (isAboutPresent) {
        throw httpMessages.ALREADY_PRESENT("About");
      }

      const newAbout = new About(aboutData);
      await newAbout.save();
      return newAbout;
    } catch (error) {
      throw error;
    }
  }

  public async editAbout(aboutData: Partial<IAbout>) {
    try {
      const { title, description, image } = aboutData;

      const existingAbout = await About.findOne();
      if (!existingAbout) {
        throw httpMessages.NOT_FOUND("About");
      }

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (existingAbout.image && existingAbout.image !== image) {
          filesToDelete.push(existingAbout.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        existingAbout.image = image;
      }

      if (title) existingAbout.title = title;
      if (description) existingAbout.description = description;

      await existingAbout.save();
      return existingAbout;
    } catch (error) {
      throw error;
    }
  }

  public async getAbout() {
    try {
      const about = await About.findOne({}, " _id title description image"); // Fetch only the necessary fields
      if (!about) {
        return "";
      }

      // Format the image URL and return the selected fields
      return {
        ...about.toObject(), // Spread the data
        image: `/api/image/${about.image}`, // Format image URL
      };
    } catch (error) {
      throw error;
    }
  }

  // ------------------------ Core CRUD ------------------------

  public async createCore(coreData: any) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      about.core.push(coreData);
      await about.save();
      return about.core;
    } catch (error) {
      throw error;
    }
  }

  public async getCore() {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      // Format core data to include only selected fields
      const formattedCore = about.core.map((core) => ({
        _id: core._id,
        title: core.title,
        description: core.description,
        image: core.image ? `/api/image/${core.image}` : null, // Format image URL
      }));

      return formattedCore;
    } catch (error) {
      throw error;
    }
  }

  public async editCore(coreId: string, updateData: Partial<IAbout>) {
    try {
      const { title, description, image } = updateData;
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      const coreIndex = about.core.findIndex(
        (core) => core._id.toString() === coreId
      );
      if (coreIndex === -1) {
        throw httpMessages.NOT_FOUND("Core");
      }

      const core = about.core[coreIndex];

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (core.image && core.image !== image) {
          filesToDelete.push(core.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        core.image = image;
      }

      if (title) core.title = title;
      if (description) core.description = description;

      await about.save();
      return core;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCore(coreId: string) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      const coreIndex = about.core.findIndex(
        (core) => core._id.toString() === coreId
      );
      if (coreIndex === -1) {
        throw httpMessages.NOT_FOUND("Core");
      }

      const core = about.core[coreIndex];
      about.core.splice(coreIndex, 1);

      await about.save();

      if (core.image) {
        await deleteImages([core.image]);
      }

      return { message: "Core deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  // ------------------------ Tab CRUD ------------------------

  public async createTab(tabData: any) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      about.tabs.push(tabData);
      await about.save();
      return about.tabs;
    } catch (error) {
      throw error;
    }
  }

  public async getTabs() {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      // Format tabs data to include only selected fields
      const formattedTabs = about.tabs.map((tab) => ({
        _id: tab._id,
        title: tab.title,
        description: tab.description,
        image: tab.image ? `/api/image/${tab.image}` : null, // Format image URL
      }));

      return formattedTabs;
    } catch (error) {
      throw error;
    }
  }

  public async editTab(tabId: string, updateData: Partial<IAbout>) {
    try {
      const { title, description, image } = updateData;
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      const tabIndex = about.tabs.findIndex(
        (tab) => tab._id.toString() === tabId
      );
      if (tabIndex === -1) {
        throw httpMessages.NOT_FOUND("Tab");
      }

      const tab = about.tabs[tabIndex];

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (tab.image && tab.image !== image) {
          filesToDelete.push(tab.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        tab.image = image;
      }

      if (title) tab.title = title;
      if (description) tab.description = description;

      await about.save();
      return tab;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTab(tabId: string) {
    try {
      const about = await About.findOne();
      if (!about) {
        throw httpMessages.NOT_FOUND("About");
      }

      const tabIndex = about.tabs.findIndex(
        (tab) => tab._id.toString() === tabId
      );
      if (tabIndex === -1) {
        throw httpMessages.NOT_FOUND("Tab");
      }

      const tab = about.tabs[tabIndex];
      about.tabs.splice(tabIndex, 1);

      await about.save();

      if (tab.image) {
        await deleteImages([tab.image]);
      }

      return { message: "Tab deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
