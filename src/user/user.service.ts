/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { TopicEnum } from '@src/enums/topic';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { USER } from './constants';
import {
  ChooseUserRoleDTO,
  UpdateMentorBackgroundDTO,
  UpdateMentorExpertiseDTO,
  UpdateMentorTopicDTO,
  UserDTO,
} from './dtos';
import { User } from './interfaces';

@Injectable()
export class UserService {
  constructor(@Inject(USER) private readonly userModel: Model<User>) {}

  async getSingleUser(param: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(param);
  }

  async createSingleUser(
    user: UserDTO,
    session: ClientSession,
  ): Promise<User[]> {
    const userObj = <User>user;
    return this.userModel.create([userObj], { session });
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

  async updateMentorshipExpertise(
    userId: string,
    updateMentorExpertiseDTO: UpdateMentorExpertiseDTO,
  ): Promise<User> {
    if (
      updateMentorExpertiseDTO.expertise.some(
        (exp) => !ExpertiseEnum.isValid(exp),
      )
    ) {
      throw new BadRequestException('user entered an invalid mentor expertise');
    }

    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { mentorExpertise: updateMentorExpertiseDTO.expertise },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateMentorBackground(
    userId: string,
    updateMentorBackgroundDTO: UpdateMentorBackgroundDTO,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(
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
  ): Promise<User> {
    if (updateMentorTopicDTO.topic.some((exp) => !TopicEnum.isValid(exp))) {
      throw new BadRequestException('user entered an invalid mentor topic');
    }

    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { mentorTopic: updateMentorTopicDTO.topic },
      {
        new: true,
        upsert: true,
      },
    );
  }
}
