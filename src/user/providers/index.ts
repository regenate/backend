import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { MENTOR, USER } from '../constants';
import { Mentor, User } from '../interfaces';
import { MentorSchema, UserSchema } from '../schemas';

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
    provide: MENTOR,
    useFactory: async (connection: Connection): Promise<Model<Mentor>> => {
      const model = connection.model<Mentor>(MENTOR, MentorSchema);
      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },
];
