import { Service } from "../models";
import { IService } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class ServiceService {
  public async createService(serviceData: IService) {
    try {
      const isServicePresent = await Service.findOne();
      if (isServicePresent) {
        throw httpMessages.ALREADY_PRESENT("Service");
      }

      const newService = new Service(serviceData);
      await newService.save();
      return newService;
    } catch (error) {
      throw error;
    }
  }

  public async editService(serviceData: Partial<IService>) {
    try {
      const { title, description, image } = serviceData;

      const existingService = await Service.findOne();
      if (!existingService) {
        throw httpMessages.NOT_FOUND("Service");
      }

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (existingService.image && existingService.image !== image) {
          filesToDelete.push(existingService.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        existingService.image = image;
      }

      if (title) existingService.title = title;
      if (description) existingService.description = description;

      await existingService.save();
      return existingService;
    } catch (error) {
      throw error;
    }
  }

  public async getService() {
    try {
      const service = await Service.findOne();
      if (!service) {
        return "";
      }
      return service;
    } catch (error) {
      throw error;
    }
  }

  public async createCard(serviceId: string, cardData: any) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      service.cards.push(cardData);
      await service.save();
      return service.cards;
    } catch (error) {
      throw error;
    }
  }

  // Get all cards for a service
  public async getCardsForService() {
    try {
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }
      return service.cards;
    } catch (error) {
      throw error;
    }
  }

  public async editCard(cardId: string, updateData: Partial<IService>) {
    try {
      const { title, description, image } = updateData;
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      const cardIndex = service.cards.findIndex(
        (card) => card._id.toString() === cardId
      );
      if (cardIndex === -1) {
        throw httpMessages.NOT_FOUND("Card");
      }

      const card = service.cards[cardIndex];

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (card.image && card.image !== image) {
          filesToDelete.push(card.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        card.image = image;
      }

      if (title) card.title = title;
      if (description) card.description = description;

      await service.save();

      return card;
    } catch (error) {
      throw error;
    }
  }

  // Delete a specific card
  public async deleteCard(cardId: string) {
    try {
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      const cardIndex = service.cards.findIndex(
        (card) => card._id.toString() === cardId
      );
      if (cardIndex === -1) {
        throw httpMessages.NOT_FOUND("Card");
      }

      const card = service.cards[cardIndex];
      service.cards.splice(cardIndex, 1);

      await service.save();

      if (card.image) {
        await deleteImages([card.image]);
      }

      return { message: "Card deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
