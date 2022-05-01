import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { USER, USER_TYPE } from '../constants';
import { User, UserType } from '../interfaces';
import { UserSchema, UserTypeSchema } from '../schemas';

export const userProviders = [
  {
    provide: USER,
    useFactory: async (connection: Connection): Promise<Model<User>> => {
      const model = connection.model<User>(USER, UserSchema);
      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },

  {
    provide: USER_TYPE,
    useFactory: async (connection: Connection): Promise<Model<UserType>> => {
      const model = connection.model<UserType>(USER_TYPE, UserTypeSchema);
      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },
];
