import { MetaInfo } from "../models";
import { httpMessages } from "../middlewares";

export class MetaInfoService {
  public async getAllMetaInfo() {
    try {
      const metaInfos = await MetaInfo.find();
      return metaInfos;
    } catch (error) {
      throw error;
    }
  }

  public async createMetaInfo(metaInfoData: any) {
    try {
      const metaInfo = new MetaInfo(metaInfoData);
      const newMetaInfo = await metaInfo.save();
      return newMetaInfo;
    } catch (error) {
      throw error;
    }
  }

  public async updateMetaInfo(metaId: string, updatedData: any) {
    try {
      const metaInfo = await MetaInfo.findById(metaId);
      if (!metaInfo) {
        throw httpMessages.NOT_FOUND("MetaInfo");
      }

      Object.keys(updatedData).forEach((key) => {
        metaInfo.set(key, updatedData[key]);
      });

      const updatedMetaInfo = await metaInfo.save();
      return updatedMetaInfo;
    } catch (error) {
      throw error;
    }
  }

  public async deleteMetaInfo(metaId: string) {
    try {
      const metaInfo = await MetaInfo.findById(metaId);
      if (!metaInfo) {
        throw httpMessages.NOT_FOUND("MetaInfo");
      }

      await metaInfo.deleteOne({ _id: metaId });
      return { message: "Meta info deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
