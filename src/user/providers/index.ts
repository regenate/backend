import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { USER, USER_ROLE } from '../constants';
import { User, UserRole } from '../interfaces';
import { UserRoleSchema, UserSchema } from '../schemas';

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
    provide: USER_ROLE,
    useFactory: async (connection: Connection): Promise<Model<UserRole>> => {
      const model = connection.model<UserRole>(USER_ROLE, UserRoleSchema);
      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },
];
