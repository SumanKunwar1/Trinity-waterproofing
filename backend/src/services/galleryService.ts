import { promises as fs } from "fs";
import path from "path";
import { uploadFolder } from "../config/upload";
import { httpMessages } from "../middlewares";

export class GalleryService {
  private baseDir: string;

  constructor() {
    this.baseDir = uploadFolder;
  }

  public async createFolder(folderName: string) {
    const folderPath = path.join(this.baseDir, folderName);
    try {
      const exists = await fs.stat(folderPath).catch(() => false);
      if (exists) {
        throw httpMessages.ALREADY_PRESENT(`folderName ${folderName}`);
      }

      await fs.mkdir(folderPath);
      return folderPath;
    } catch (error) {
      throw error;
    }
  }

  public async uploadImage(folderName: string, images: string[]) {
    const folderPath = path.join(this.baseDir, folderName);

    try {
      const exists = await fs.stat(folderPath).catch(() => false);
      if (!exists) {
        throw httpMessages.NOT_FOUND(`FOLDER ${folderName}`);
      }

      const processedFiles = await Promise.all(
        images.map(async (filename) => {
          const prefixedFilename = `${folderName}-${filename}`;

          const originalFilePath = path.join(this.baseDir, filename);
          const targetFilePath = path.join(folderPath, prefixedFilename);

          await fs.rename(originalFilePath, targetFilePath);

          return prefixedFilename;
        })
      );

      return processedFiles;
    } catch (error) {
      throw error;
    }
  }

  public async getFolders() {
    try {
      const folders = await fs.readdir(this.baseDir, { withFileTypes: true });

      const folderDetails = await Promise.all(
        folders
          .filter((item) => item.isDirectory())
          .map(async (folder) => {
            const folderPath = path.join(this.baseDir, folder.name);

            const dir = await fs.opendir(folderPath);
            let randomFile = null;

            for await (const dirent of dir) {
              if (dirent.isFile()) {
                const fileNameToDisplayImage = `${folder.name}/${dirent.name}`;
                randomFile = `/api/image/${fileNameToDisplayImage}`;
                break;
              }
            }

            return {
              name: folder.name,
              type: "folder",
              file: randomFile,
            };
          })
      );

      return folderDetails;
    } catch (error) {
      throw error;
    }
  }

  public async getFiles(folderName: string) {
    const folderPath = path.join(this.baseDir, folderName);
    let filesToDisplay = [];

    try {
      const exists = await fs.stat(folderPath).catch(() => false);
      if (!exists) {
        throw httpMessages.NOT_FOUND(`folder ${folderName}`);
      }

      const files = await fs.readdir(folderPath, {
        withFileTypes: true,
      });

      for (let dirent of files) {
        if (dirent.isFile()) {
          const fileNameToDisplayImage = `${folderName}/${dirent.name}`;
          const randomFile = `/api/image/${fileNameToDisplayImage}`;

          filesToDisplay.push(randomFile);
        }
      }

      if (filesToDisplay.length === 0) {
        return [];
      }

      return filesToDisplay;
    } catch (error) {
      throw error;
    }
  }

  public async deleteItem(targetPath: string) {
    const fullPath = path.join(this.baseDir, targetPath);

    try {
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await fs.rmdir(fullPath, { recursive: true });
      } else {
        await fs.unlink(fullPath);
      }
      return { message: "Item deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
