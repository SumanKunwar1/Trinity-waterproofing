import { Request, Response, NextFunction } from "express";
import { SliderService } from "../services";
import { ISlider } from "../interfaces";

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
      const slider = await this.sliderService.createSlider(sliderData);
      res.locals.responseData = slider;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliderId = req.params.id;
      const sliderData: Partial<ISlider> = req.body;
      const updatedSlider = await this.sliderService.editSlider(
        sliderData,
        sliderId
      );
      res.locals.responseData = updatedSlider;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sliderId = req.params.id;
      const result = await this.sliderService.deleteSlider(sliderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
