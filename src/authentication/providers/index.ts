import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { REQUEST_RESET_TOKEN } from '../constants';
import { RequestResetToken } from '../interfaces';
import { ResetRequestTokenSchema } from '../schemas';

export const authenticationProviders = [
  {
    provide: REQUEST_RESET_TOKEN,
    useFactory: async (
      connection: Connection,
    ): Promise<Model<RequestResetToken>> => {
      const model = connection.model<RequestResetToken>(
        REQUEST_RESET_TOKEN,
        ResetRequestTokenSchema,
      );

      await model.createCollection();
      return model;
    },
    inject: [DB_CONNECTION],
  },
];
