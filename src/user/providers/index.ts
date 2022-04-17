import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { USER } from '../constants';
import { User } from '../interfaces';
import { UserSchema } from '../schemas';

export const userProviders = [
  {
    provide: USER,
    useFactory: (connection: Connection): Model<User> => {
      return connection.model(USER, UserSchema);
    },
    inject: [DB_CONNECTION],
  },
];
