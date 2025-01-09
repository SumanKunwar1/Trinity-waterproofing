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

  public async renameFolder(oldFolderName: string, newFolderName: string) {
    const oldFolderPath = path.join(this.baseDir, oldFolderName);
    const newFolderPath = path.join(this.baseDir, newFolderName);

    try {
      // Check if the folder to be renamed exists
      const existsOld = await fs.stat(oldFolderPath).catch(() => false);
      if (!existsOld) {
        throw httpMessages.NOT_FOUND(`Folder '${oldFolderName}' not found.`);
      }

      // Check if a folder with the new name already exists
      const existsNew = await fs.stat(newFolderPath).catch(() => false);
      if (existsNew) {
        throw httpMessages.ALREADY_PRESENT(
          `Folder '${newFolderName}' already exists.`
        );
      }

      // Rename the folder
      await fs.rename(oldFolderPath, newFolderPath);

      return { message: `Folder renamed to '${newFolderName}'` };
    } catch (error) {
      throw error;
    }
  }

  // Delete Folder
  public async deleteFolder(folderName: string) {
    const folderPath = path.join(this.baseDir, folderName);

    try {
      const exists = await fs.stat(folderPath).catch(() => false);
      if (!exists) {
        throw httpMessages.NOT_FOUND(`Folder '${folderName}' not found.`);
      }

      // Delete the folder
      await fs.rmdir(folderPath, { recursive: true });

      return { message: `Folder '${folderName}' deleted successfully.` };
    } catch (error) {
      throw error;
    }
  }

  // Delete Files in a Folder
  public async deleteFiles(folderName: string, files: string[]) {
    const folderPath = path.join(this.baseDir, folderName);

    try {
      const exists = await fs.stat(folderPath).catch(() => false);
      if (!exists) {
        throw httpMessages.NOT_FOUND(`Folder '${folderName}' not found.`);
      }

      const deletedFiles: string[] = [];
      const notFoundFiles: string[] = [];

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);

          try {
            await fs.unlink(filePath);
            deletedFiles.push(file);
          } catch (error) {
            notFoundFiles.push(file);
          }
        })
      );
      console.log("deletediles", deletedFiles);
      console.log("notfoundFoles", notFoundFiles);
      return {
        deletedFiles,
        notFoundFiles,
      };
    } catch (error) {
      throw error;
    }
  }
}
