import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { MENTEE, MENTOR, USER } from '../constants';
import { Mentee, Mentor, User } from '../interfaces';
import { MenteeSchema, MentorSchema, UserSchema } from '../schemas';

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

  {
    provide: MENTEE,
    useFactory: async (connection: Connection): Promise<Model<Mentee>> => {
      const model = connection.model<Mentor>(MENTEE, MenteeSchema);
      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },
];
