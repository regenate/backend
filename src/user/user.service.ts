/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { USER } from './constants';
import { ChooseUserRoleDTO, UpdateMentorExpertiseDTO, UserDTO } from './dtos';
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
    createMentorExpertiseDTO: UpdateMentorExpertiseDTO,
  ): Promise<User> {
    if (
      createMentorExpertiseDTO.expertise.some(
        (exp) => !ExpertiseEnum.isValid(exp),
      )
    ) {
      throw new BadRequestException('user entered an invalid mentorship value');
    }

    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { mentorExpertise: createMentorExpertiseDTO.expertise },
      {
        new: true,
        upsert: true,
      },
    );
  }
}
