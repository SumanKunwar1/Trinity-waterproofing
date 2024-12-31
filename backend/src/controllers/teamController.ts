import { NextFunction, Request, Response } from "express";
import { TeamService } from "../services";
import { ITeam } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public async createTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teamMemberData: ITeam = req.body;
      const result = await this.teamService.createTeamMember(teamMemberData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteImages([req.body.image]);
      next(error);
    }
  }

  public async getTeamMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.teamService.getTeamMembers();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getTeamMemberById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teamMemberId = req.params.teamMemberId;
      const result = await this.teamService.getTeamMemberById(teamMemberId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teamMemberId = req.params.teamMemberId;
      const updateData: Partial<ITeam> = req.body;
      const result = await this.teamService.editTeamMember(
        teamMemberId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteImages([req.body.image]);
      next(error);
    }
  }

  public async deleteTeamMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const teamMemberId = req.params.teamMemberId;
      const result = await this.teamService.deleteTeamMemberById(teamMemberId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
