import { DB_CONNECTION } from '@src/database';
import { Connection, Model } from 'mongoose';
import { REQUEST_RESET_TOKEN } from '../constants';
import { RequestResetToken } from '../interfaces';
import { ResetRequestTokenSchema } from '../schemas';

export const authenticationProviders = [
  {
    provide: REQUEST_RESET_TOKEN,
    useFactory: (connection: Connection): Model<RequestResetToken> => {
      return connection.model(REQUEST_RESET_TOKEN, ResetRequestTokenSchema);
    },
    inject: [DB_CONNECTION],
  },
];
