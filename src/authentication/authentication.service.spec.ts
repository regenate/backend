import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@src/../test/test.module';
import { DB_CONNECTION } from '@src/database';
import {
  collectionInitialize,
  randomEmail,
  randomString,
  wait,
} from '@src/test.util';
import { User } from '@src/user';
import { USER } from '@src/user/constants';
import { compareSync } from 'bcryptjs';
import { Connection, disconnect } from 'mongoose';
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
      imports: [TestModule],
      providers: [...authenticationProviders],
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
    const email = randomEmail();
    const user = await service.signup(email, 'password');
    expect(user).toBeDefined();
    expect(user.emailVerified).toBe(false);
    expect(user.bearerToken).toBeDefined();
  });

  it('should login a user', async () => {
    const email = randomEmail();
    const user: User = await connection.models[USER].create({
      email,
      password: 'password',
    });

    const login = await service.login(user.email, 'password');

    expect(login).toBeDefined();
    expect(login.emailVerified).toBe(false);
  });

  it('should not login', async () => {
    const email = randomEmail();
    const user = await connection.models[USER].create({
      email,
      password: 'password',
    });

    const invalidPassword = await service.login(user.email, 'invalid_password');
    const invalidEmail = await service.login(randomEmail(), 'password');
    const invalidEmailAndPassword = await service.login(
      randomEmail(),
      'invalid_password',
    );

    expect(invalidPassword).toBe(null);
    expect(invalidEmail).toBe(null);
    expect(invalidEmailAndPassword).toBe(null);
  });

  it('should verify user email', async () => {
    const email = randomEmail();
    const userObj: Partial<User> = {
      email,
      password: 'password',
      emailVerificationCode: randomString(),
    };
    const user: User = await connection.models[USER].create(userObj);

    const verifiedUser = await service.verifyEmail(
      userObj.emailVerificationCode,
      user.email,
    );

    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.emailVerified).toBe(true);
  });

  it('should not verify user email', async () => {
    const email = randomEmail();
    const userObj: Partial<User> = {
      email,
      password: 'password',
      emailVerificationCode: randomString(),
    };
    const user: User = await connection.models[USER].create(userObj);

    try {
      // Invalid code
      await service.verifyEmail(randomString(), user.email);
    } catch (error) {
      expect(error.message).toBe('invalid token');
    }
    try {
      // Invalid email
      await service.verifyEmail(user.email, randomEmail());
    } catch (error) {
      expect(error.message).toBe('invalid token');
    }
  });

  it('should request reset token', async () => {
    const userObj: Partial<User> = {
      email: randomEmail(),
      password: 'password',
    };
    await connection.models[USER].create(userObj);

    const tokenSent = await service.requestResetToken(userObj.email);

    expect(tokenSent).toBeDefined();
    expect(tokenSent).toBe(true);
  });

  it('should reset user password', async () => {
    const userObj: Partial<User> = {
      email: randomEmail(),
      password: 'password',
    };
    const user: User = await connection.models[USER].create(userObj);
    const tokenObj: Partial<RequestResetToken> = {
      token: randomString(),
      user,
    };
    const token: RequestResetToken = await connection.models[
      REQUEST_RESET_TOKEN
    ].create(tokenObj);
    const newPassword = 'not_password';

    await service.resetPassword(token.token, newPassword, newPassword);
    const resetUser = await connection.models[USER].findOne({ _id: user._id });

    expect(resetUser).toBeDefined();
    expect(compareSync(newPassword, resetUser.password)).toBe(true);
  });

  it('should not reset user password', async () => {
    const userObj: Partial<User> = {
      email: randomEmail(),
      password: 'password',
    };
    const user: User = await connection.models[USER].create(userObj);
    const tokenObj: Partial<RequestResetToken> = {
      token: randomString(),
      user,
    };
    const token: RequestResetToken = await connection.models[
      REQUEST_RESET_TOKEN
    ].create(tokenObj);
    const newPassword = 'not_password';

    try {
      // Invalid token
      await service.resetPassword(token.token, newPassword, newPassword);
    } catch (error) {
      expect(error.message).toBe('invalid or used reset token');
    }
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
    await module.close();
  });
});
