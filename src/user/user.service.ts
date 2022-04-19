/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable } from '@nestjs/common';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { USER } from './constants';
import { UserDTO } from './dtos';
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
}
