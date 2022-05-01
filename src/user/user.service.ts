/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { USER, USER_TYPE } from './constants';
import { ChooseUserTypeDTO, UserDTO } from './dtos';
import { UserTypeEnum } from './enums/user-type';
import { User, UserType } from './interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER) private readonly userModel: Model<User>,
    @Inject(USER_TYPE) private readonly userTypeModel: Model<UserType>,
  ) {}

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

  async createUsertype(
    userId: string,
    userTypeDto: ChooseUserTypeDTO,
  ): Promise<UserType> {
    const userTypeObj = { type: userTypeDto.type, user: userId };

    if (userTypeDto.type === UserTypeEnum.none) {
      throw new BadRequestException('user did not select a user type');
    }

    const isUserTypeExist = await this.userTypeModel.exists({ user: userId });

    if (isUserTypeExist) {
      throw new ConflictException('user already selected a type ');
    }

    return this.userTypeModel.findOneAndUpdate({ user: userId }, userTypeObj, {
      new: true,
      upsert: true,
    });
  }
}
