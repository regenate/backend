import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@src/../test/test.module';
import { DB_CONNECTION } from '@src/database';
import {
  collectionInitialize,
  randomEmail,
  randomString,
  responseMocker,
  wait,
} from '@src/test.util';
import { User, UserDTO } from '@src/user';
import { USER } from '@src/user/constants';
import { compareSync } from 'bcryptjs';
import { Request } from 'express';
import { Connection, disconnect } from 'mongoose';
import { AuthenticationController } from './authentication.controller';
import { REQUEST_RESET_TOKEN } from './constants';
import { LoginDTO, PasswordResetDTO, VerifyEmailDTO } from './dtos';
import { authenticationProviders } from './providers';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let connection: Connection;
  let module: TestingModule;
  const response = { data: {}, status: 0 };
  const res = responseMocker(response);

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [AuthenticationController],
      providers: [...authenticationProviders],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    connection = module.get<Connection>(DB_CONNECTION);

    await collectionInitialize();
    await wait(1000);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should singup a user', async () => {
    const payload: UserDTO = {
      email: randomEmail(),
      password: randomString(),
    };
    await controller.signup(res, payload);

    const {
      data: { data },
      status,
    } = <any>response;
    expect(status).toBe(201);
    expect(data.bearerToken).toBeDefined();
  });

  it('should login a user', async () => {
    const request = {};
    const payload: LoginDTO = {
      username: randomEmail(),
      password: randomString(8),
    };
    await connection.models[USER].create({
      email: payload.username,
      password: payload.password,
    });

    await controller.login(res, <Request>request, payload);

    const { data, status } = <any>response;
    expect(status).toBe(200);
    expect(data.message).toBeDefined();
    expect(data.message).toBe('logged in');
  });

  it('should verify user email', async () => {
    const payload: VerifyEmailDTO = {
      email: randomEmail(),
      token: randomString(),
    };
    await connection.models[USER].create({
      email: payload.email,
      password: randomString(8),
      emailVerificationCode: payload.token,
    });

    await controller.verifyEmail(res, payload);
    const {
      data: { data: verifiedUser },
      status,
    } = <any>response;

    expect(status).toBe(200);
    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.emailVerified).toBe(true);
  });

  it('should request reset token', async () => {
    const userObj: Partial<User> = {
      email: randomEmail(),
      password: randomString(),
    };
    await connection.models[USER].create(userObj);

    await controller.forgotPassword(res, { email: userObj.email });

    const {
      data: { message },
      status,
    } = <any>response;

    expect(status).toBe(200);
    expect(message).toBe('reset token sent to email');
  });

  it('should reset user password', async () => {
    const newPassword = randomString();
    const payload: PasswordResetDTO = {
      confirmNewPassword: newPassword,
      newPassword,
      resetToken: newPassword,
    };
    const user: User = await connection.models[USER].create({
      email: randomEmail(),
      password: randomString(),
    });
    await connection.models[REQUEST_RESET_TOKEN].create({
      token: payload.resetToken,
      user,
    });

    await controller.resetPassword(res, payload);
    const resetUser = await connection.models[USER].findOne({ _id: user._id });

    const { status } = response;

    expect(status).toBe(200);
    expect(resetUser).toBeDefined();
    expect(compareSync(newPassword, resetUser.password)).toBe(true);
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
    await module.close();
  });
});
