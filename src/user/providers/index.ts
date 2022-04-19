import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { USER } from '../constants';
import { User } from '../interfaces';
import { UserSchema } from '../schemas';

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
];
