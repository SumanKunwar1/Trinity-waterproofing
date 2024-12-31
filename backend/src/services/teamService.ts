import { Team } from "../models";
import { ITeam } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class TeamService {
  public async createTeamMember(teamMemberData: ITeam) {
    try {
      const newTeamMember = new Team(teamMemberData);
      await newTeamMember.save();
      return newTeamMember;
    } catch (error) {
      throw error;
    }
  }

  public async editTeamMember(
    teamMemberId: string,
    teamMemberData: Partial<ITeam>
  ) {
    try {
      const { name, image, role, facebook, twitter, instagram, linkedin } =
        teamMemberData;

      const existingTeamMember = await Team.findById(teamMemberId);
      if (!existingTeamMember) {
        throw httpMessages.NOT_FOUND("Team member");
      }

      if (image && image !== "") {
        const filesToDelete: string[] = [];
        if (existingTeamMember.image && existingTeamMember.image !== image) {
          filesToDelete.push(existingTeamMember.image);
        }

        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
        }
        existingTeamMember.image = image;
      }

      if (name) existingTeamMember.name = name;
      if (role) existingTeamMember.role = role;
      if (facebook) existingTeamMember.facebook = facebook;
      if (twitter) existingTeamMember.twitter = twitter;
      if (instagram) existingTeamMember.instagram = instagram;
      if (linkedin) existingTeamMember.linkedin = linkedin;

      await existingTeamMember.save();
      return existingTeamMember;
    } catch (error) {
      throw error;
    }
  }

  public async getTeamMembers() {
    try {
      const teamMembers = await Team.find();
      if (!teamMembers || teamMembers.length === 0) {
        return [];
      }

      const teamResponse = teamMembers.map((member) => ({
        ...member.toObject(),
        image: `/api/image/${member.image}`,
      }));

      return teamResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getTeamMemberById(teamMemberId: string) {
    try {
      const teamMember = await Team.findById(teamMemberId);
      if (!teamMember) {
        throw httpMessages.NOT_FOUND("Team member");
      }

      const teamMemberResponse = {
        ...teamMember.toObject(),
        image: `/api/image/${teamMember.image}`,
        socialLinks: {
          facebook: teamMember.facebook,
          twitter: teamMember.twitter,
          instagram: teamMember.instagram,
          linkedin: teamMember.linkedin,
        },
      };

      return teamMemberResponse;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTeamMemberById(teamMemberId: string) {
    try {
      const teamMember = await Team.findById(teamMemberId);

      if (!teamMember) {
        throw httpMessages.NOT_FOUND("Team member");
      }

      const filesToDelete: string[] = [];
      if (teamMember.image) {
        filesToDelete.push(teamMember.image);
      }

      if (filesToDelete.length > 0) {
        await deleteImages(filesToDelete);
      }

      await Team.deleteOne({ _id: teamMemberId });

      return teamMember;
    } catch (error) {
      throw error;
    }
  }
}
