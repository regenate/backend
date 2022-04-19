import {
  RequestTokenExpireTime,
  RequestTokenExpireTimes,
} from '@src/authentication';

export interface Configuration {
  env: string;
  port: number;
  api: {
    baseUrl: string;
  };
  useMockEmail: boolean;
  ui: {
    baseUrl: string;
  };
  sendGrid: {
    from: {
      name: string;
      email: string;
    };
    apiKey: string;
  };
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
  resetTokenExpire: RequestTokenExpireTime;
  isTest: boolean;
  isDev: boolean;
}

export default (): Configuration => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 2001,
  api: {
    baseUrl: process.env.API_URL,
  },
  ui: {
    baseUrl: process.env.UI_URL,
  },
  useMockEmail: process.env.USE_MOCK_EMAIL === 'true',
  sendGrid: {
    from: {
      name: process.env.SENDGRID_DEFAULT_FROM_NAME,
      email: process.env.SENDGRID_DEFAULT_FROM_EMAIL,
    },
    apiKey: process.env.SENDGRID_API_KEY,
  },
  database: {
    url: process.env.DATABASE_HOST,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  resetTokenExpire: RequestTokenExpireTimes.includes(
    <RequestTokenExpireTime>process.env.RESET_TOKEN_EXPIRE,
  )
    ? <RequestTokenExpireTime>process.env.RESET_TOKEN_EXPIRE
    : RequestTokenExpireTime.ThirtyMinutes,
  isTest: process.env.NODE_ENV === 'test',
  isDev:
    !process.env.NODE_ENV ||
    ['development', 'test', 'localhost', 'local'].includes(
      process.env.NODE_ENV,
    ),
});