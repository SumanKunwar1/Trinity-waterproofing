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
      const service = await Service.findOne({}, " _id title description image");
      if (!service) {
        return "";
      }
      return {
        ...service.toObject(), // Spread the data
        image: `/api/image/${service.image}`, // Format image URL
      };
    } catch (error) {
      throw error;
    }
  }

  public async createCard(cardData: any) {
    try {
      const service = await Service.findOne();
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
      const formattedCards = service.cards.map((card) => ({
        _id: card._id,
        title: card.title,
        description: card.description,
        image: card.image ? `/api/image/${card.image}` : null, // Format image URL
      }));
      return formattedCards;
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

  public async createSection(sectionData: any) {
    try {
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      service.sections.push(sectionData);
      await service.save();
      return service.sections;
    } catch (error) {
      throw error;
    }
  }

  // Get all sections for a service
  public async getSectionsForService() {
    try {
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }
      const formattedSections = service.sections.map((section) => ({
        _id: section._id,
        title: section.title,
        description: section.description,
        image: section.image ? `/api/image/${section.image}` : null, // Format image URL
      }));
      return formattedSections;
    } catch (error) {
      throw error;
    }
  }

  public async editSection(sectionId: string, updateData: Partial<IService>) {
    try {
      const { title, description, image } = updateData;
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      const sectionIndex = service.sections.findIndex(
        (section) => section._id.toString() === sectionId
      );
      if (sectionIndex === -1) {
        throw httpMessages.NOT_FOUND("Section");
      }

      const section = service.sections[sectionIndex];

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (section.image && section.image !== image) {
          filesToDelete.push(section.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        section.image = image;
      }

      if (title) section.title = title;
      if (description) section.description = description;

      await service.save();

      return section;
    } catch (error) {
      throw error;
    }
  }

  // Delete a specific section
  public async deleteSection(sectionId: string) {
    try {
      const service = await Service.findOne();
      if (!service) {
        throw httpMessages.NOT_FOUND("Service");
      }

      const sectionIndex = service.sections.findIndex(
        (section) => section._id.toString() === sectionId
      );
      if (sectionIndex === -1) {
        throw httpMessages.NOT_FOUND("Section");
      }

      const section = service.sections[sectionIndex];
      service.sections.splice(sectionIndex, 1);

      await service.save();

      if (section.image) {
        await deleteImages([section.image]);
      }

      return { message: "Section deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
