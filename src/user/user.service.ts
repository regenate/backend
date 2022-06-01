/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ExperienceLevelEnum } from '@src/enums/experience-level';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { TopicEnum } from '@src/enums/topic';
import { Logger } from '@src/logger';
import { FileUploadDTO, UploadService } from '@src/uploader';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { MENTEE, MENTOR, USER } from './constants';
import {
  ChooseUserRoleDTO,
  UpdateMenteeBackgroundDTO,
  UpdateMenteeBioDTO,
  UpdateMenteeExpertiseDTO,
  UpdateMenteeOriginDTO,
  UpdateMentorBackgroundDTO,
  UpdateMentorBioDTO,
  UpdateMentorExpertiseDTO,
  UpdateMentorOriginDTO,
  UpdateMentorTopicDTO,
  UserDTO,
} from './dtos';
import { Mentee, Mentor, User } from './interfaces';
import { Country } from './util/country';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER) private readonly userModel: Model<User>,

    @Inject(MENTOR) private readonly mentorModel: Model<Mentor>,

    @Inject(MENTEE) private readonly menteeModel: Model<Mentee>,
    private readonly uploader: UploadService,
  ) {}

  async getSingleUser(param: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(param);
  }

  async createSingleUser(
    user: UserDTO,
    session: ClientSession,
  ): Promise<User[]> {
    const userObj = <User>user;
    return this.userModel.create([{ ...userObj, emailHash: userObj.email }], {
      session,
    });
  }

  async updateSingleUser(param: FilterQuery<User>, update: Partial<User>) {
    return this.userModel.updateMany(param, update);
  }

  async createUserRole(
    userId: string,
    userRoleDto: ChooseUserRoleDTO,
  ): Promise<User> {
    const userRoleObj = { role: userRoleDto.role };

    if (userRoleDto.role === RoleEnum.none) {
      throw new BadRequestException('user did not select a user role');
    }

    const isUserRoleExist = await this.userModel.exists({
      _id: userId,
      role: { $ne: null },
    });

    if (isUserRoleExist) {
      throw new ConflictException('user already selected a role ');
    }

    return this.userModel.findOneAndUpdate({ _id: userId }, userRoleObj, {
      new: true,
      upsert: true,
    });
  }

  // ------------------------------------------------------------------- MENTOR -------------------------------------------------------------------

  async updateMentorshipOrigin(
    userId: string,
    updateMentorOriginDTO: UpdateMentorOriginDTO,
  ): Promise<Mentor> {
    if (!Country.isValidCountry(updateMentorOriginDTO.country)) {
      throw new BadRequestException('user entered an invalid mentor country');
    }

    if (!Country.isValidLanguage(updateMentorOriginDTO.language)) {
      throw new BadRequestException('user entered an invalid mentor language');
    }

    return this.mentorModel.findOneAndUpdate(
      { _id: userId },
      {
        language: updateMentorOriginDTO.language,
        country: updateMentorOriginDTO.country,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMentorshipExpertise(
    userId: string,
    updateMentorExpertiseDTO: UpdateMentorExpertiseDTO,
  ): Promise<Mentor> {
    if (!ExpertiseEnum.isValid(updateMentorExpertiseDTO.expertise)) {
      throw new BadRequestException('user entered an invalid mentor expertise');
    }

    if (
      !ExperienceLevelEnum.isValid(updateMentorExpertiseDTO.experienceLevel)
    ) {
      throw new BadRequestException(
        'user entered an invalid mentor experience level',
      );
    }

    return this.mentorModel.findOneAndUpdate(
      { _id: userId },
      {
        mentorExpertise: updateMentorExpertiseDTO.expertise,
        experienceLevel: updateMentorExpertiseDTO.experienceLevel,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMentorBackground(
    userId: string,
    updateMentorBackgroundDTO: UpdateMentorBackgroundDTO,
  ): Promise<Mentor> {
    return this.mentorModel.findOneAndUpdate(
      { _id: userId },
      {
        companyOrSchool: updateMentorBackgroundDTO.companyOrSchool,
        jobTitle: updateMentorBackgroundDTO.jobTitle,
        linkedlnUrl: updateMentorBackgroundDTO.linkedlnUrl,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMentorTopic(
    userId: string,
    updateMentorTopicDTO: UpdateMentorTopicDTO,
  ): Promise<Mentor> {
    if (updateMentorTopicDTO.topic.some((exp) => !TopicEnum.isValid(exp))) {
      throw new BadRequestException('user entered an invalid mentor topic');
    }

    return this.mentorModel.findOneAndUpdate(
      { _id: userId },
      { mentorTopic: updateMentorTopicDTO.topic },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMentorProfilePicture(
    userId: string,
    fileUploadDTO: FileUploadDTO,
    logger: Logger,
  ): Promise<Mentor> {
    // TODO: handle removing an image
    try {
      const file = await this.uploader.uploadFile(fileUploadDTO, logger);

      return this.mentorModel.findOneAndUpdate(
        { _id: userId },
        { avatar: file.url },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      logger.error(`error updating photo - ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async updateMentorBio(
    userId: string,
    updateMentorBioDTO: UpdateMentorBioDTO,
  ): Promise<Mentor> {
    return this.mentorModel.findOneAndUpdate(
      { _id: userId },
      { bio: updateMentorBioDTO.bio },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async getMentor(userID: string): Promise<Mentor> {
    return this.mentorModel.findOne({ user: userID });
  }

  // ------------------------------------------------------------------- MENTEE -------------------------------------------------------------------

  async updateMenteeOrigin(
    userId: string,
    updateMenteeOriginDTO: UpdateMenteeOriginDTO,
  ): Promise<Mentee> {
    if (!Country.isValidCountry(updateMenteeOriginDTO.country)) {
      throw new BadRequestException('user entered an invalid mentee country');
    }

    if (!Country.isValidLanguage(updateMenteeOriginDTO.language)) {
      throw new BadRequestException('user entered an invalid mentee language');
    }

    return this.menteeModel.findOneAndUpdate(
      { _id: userId },
      {
        language: updateMenteeOriginDTO.language,
        country: updateMenteeOriginDTO.country,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMenteeExpertise(
    userId: string,
    updateMenteeExpertiseDTO: UpdateMenteeExpertiseDTO,
  ): Promise<Mentee> {
    if (!ExpertiseEnum.isValid(updateMenteeExpertiseDTO.expertise)) {
      throw new BadRequestException('user entered an invalid mentee expertise');
    }

    if (
      !ExperienceLevelEnum.isValid(updateMenteeExpertiseDTO.experienceLevel)
    ) {
      throw new BadRequestException(
        'user entered an invalid mentee experience level',
      );
    }

    return this.menteeModel.findOneAndUpdate(
      { _id: userId },
      {
        expertise: updateMenteeExpertiseDTO.expertise,
        experienceLevel: updateMenteeExpertiseDTO.experienceLevel,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMenteeBackground(
    userId: string,
    updateMenteeBackgroundDTO: UpdateMenteeBackgroundDTO,
  ): Promise<Mentee> {
    return this.menteeModel.findOneAndUpdate(
      { _id: userId },
      {
        linkedlnUrl: updateMenteeBackgroundDTO.linkedlnUrl,
        figmaPortfolioUrl: updateMenteeBackgroundDTO.figmaPortfolioUrl,
        gitHubUrl: updateMenteeBackgroundDTO.gitHubUrl,
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMenteeProfilePicture(
    userId: string,
    fileUploadDTO: FileUploadDTO,
    logger: Logger,
  ): Promise<Mentee> {
    // TODO: handle removing an image
    try {
      const file = await this.uploader.uploadFile(fileUploadDTO, logger);

      return this.menteeModel.findOneAndUpdate(
        { _id: userId },
        { avatar: file.url },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (error) {
      logger.error(`error updating photo - ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async updateMenteeBio(
    userId: string,
    updateMenteeBioDTO: UpdateMenteeBioDTO,
  ): Promise<Mentee> {
    return this.menteeModel.findOneAndUpdate(
      { _id: userId },
      { bio: updateMenteeBioDTO.bio },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async getMentee(userID: string): Promise<Mentee> {
    return this.menteeModel.findOne({ user: userID });
  }
}
