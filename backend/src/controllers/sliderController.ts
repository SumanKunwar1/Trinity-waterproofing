import { Request, Response, NextFunction } from "express";
import { SliderService } from "../services";
import { ISlider } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class SliderController {
  private sliderService: SliderService;

  constructor() {
    this.sliderService = new SliderService();
  }

  public async getSliders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliders = await this.sliderService.getSliders();
      res.locals.responseData = sliders;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async displaySlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliders = await this.sliderService.displaySlider();
      res.locals.responseData = sliders;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async createSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliderData: ISlider = req.body;
      console.log("create slider", sliderData);
      const slider = await this.sliderService.createSlider(sliderData);
      res.locals.responseData = slider;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      if (req.body.video) {
        deleteImages([req.body.video]);
      }
      next(error);
    }
  }

  public async editSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliderId = req.params.sliderId;
      const sliderData: Partial<ISlider> = req.body;
      const updatedSlider = await this.sliderService.editSlider(
        sliderData,
        sliderId
      );
      res.locals.responseData = updatedSlider;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages([req.body.image]);
      }
      if (req.body.video) {
        deleteImages([req.body.video]);
      }
      next(error);
    }
  }

  public async deleteSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliderId = req.params.sliderId;
      const result = await this.sliderService.deleteSlider(sliderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
