import configuration from '@src/config/configuration';
import { DB_CONNECTION } from '@src/database';
import * as mongoose from 'mongoose';

export const dbProviders = [
  {
    provide: DB_CONNECTION,
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect(configuration().database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    },
  },
];
