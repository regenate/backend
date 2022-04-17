import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@src/../test/test.module';
import { DB_CONNECTION } from '@src/database';
import { EmailModule } from '@src/email/email.module';
import { collectionInitialize, wait } from '@src/test.util';
import { User } from '@src/user';
import { USER } from '@src/user/constants';
import { UserModule } from '@src/user/user.module';
import { UtilModule } from '@src/util/util.module';
import { compareSync } from 'bcryptjs';
import { Connection, disconnect } from 'mongoose';
import { AuthenticationModule } from './authentication.module';
import { AuthenticationService } from './authentication.service';
import { REQUEST_RESET_TOKEN } from './constants';
import { RequestResetToken } from './interfaces';
import { authenticationProviders } from './providers';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let connection: Connection;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestModule,
        UserModule,
        EmailModule,
        AuthenticationModule,
        UtilModule,
      ],
      providers: [...authenticationProviders, AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    connection = module.get<Connection>(DB_CONNECTION);

    await collectionInitialize();
    await wait(1000);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup a user', async () => {
    const user = await service.signup('test_user@mail.com', 'password');
    expect(user).toBeDefined();
    expect(user.emailVerified).toBe(false);
  });

  it('should login a user', async () => {
    const user: User = await connection.models[USER].create({
      email: 'test_user2@mail.com',
      password: 'password',
    });

    const login = await service.login(user.email, 'password');

    expect(login).toBeDefined();
    expect(login.emailVerified).toBe(false);
  });

  it('should verify user email', async () => {
    const userObj: Partial<User> = {
      email: 'test_user3@mail.com',
      password: 'password',
      emailVerificationCode: 'test_verification_code',
    };
    const user: User = await connection.models[USER].create(userObj);

    const verifiedUser = await service.verifyEmail(
      userObj.emailVerificationCode,
      user.email,
    );

    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.emailVerified).toBe(true);
  });

  it('should request reset token', async () => {
    const userObj: Partial<User> = {
      email: 'test_user4@mail.com',
      password: 'password',
    };
    await connection.models[USER].create(userObj);

    const tokenSent = await service.requestResetToken(userObj.email);

    expect(tokenSent).toBeDefined();
    expect(tokenSent).toBe(true);
  });

  it('should reset user password', async () => {
    const userObj: Partial<User> = {
      email: 'test_user5@mail.com',
      password: 'password',
    };
    const user: User = await connection.models[USER].create(userObj);
    const tokenObj: Partial<RequestResetToken> = {
      token: 'test_token',
      user,
    };
    const token: RequestResetToken = await connection.models[
      REQUEST_RESET_TOKEN
    ].create(tokenObj);
    const newPassword = 'not_password';

    const resetUser = await service.resetPassword(
      token.token,
      newPassword,
      newPassword,
    );

    expect(resetUser).toBeDefined();
    expect(compareSync(newPassword, resetUser.password)).toBe(true);
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
    await module.close();
  });
});
