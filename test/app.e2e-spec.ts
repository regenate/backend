import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  LoginDTO,
  PasswordResetDTO,
  VerifyEmailDTO,
} from '@src/authentication';
import { REQUEST_RESET_TOKEN } from '@src/authentication/constants';
import { DB_CONNECTION } from '@src/database';
import {
  collectionInitialize,
  randomEmail,
  randomString,
  wait,
} from '@src/test.util';
import { User, UserDTO } from '@src/user';
import { USER } from '@src/user/constants';
import { compareSync } from 'bcryptjs';
import { Connection, disconnect } from 'mongoose';
import * as request from 'supertest';
import { TestModule } from './test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('AuthenticationController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(DB_CONNECTION);
    await collectionInitialize();
    wait(1000);
    await app.init();
  });

  it('/auth/singup (POST)', async () => {
    const payload: UserDTO = {
      email: randomEmail(),
      password: randomString(),
    };
    const {
      body: { data },
    } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(payload)
      .expect(201);
    expect(data.bearerToken).toBeDefined();
  });

  it('/auth/login (POST)', async () => {
    const payload: LoginDTO = {
      username: randomEmail(),
      password: randomString(8),
    };
    await connection.models[USER].create({
      email: payload.username,
      password: payload.password,
    });
    const {
      body: { message, data },
    } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(200);
    expect(message).toBeDefined();
    expect(message).toBe('logged in');
    expect(data.bearerToken).toBeDefined();
  });

  it('/auth/verify (PUT)', async () => {
    const payload: VerifyEmailDTO = {
      email: randomEmail(),
      token: randomString(),
    };
    await connection.models[USER].create({
      email: payload.email,
      password: randomString(8),
      emailVerificationCode: payload.token,
    });

    const {
      body: { message, data: verifiedUser },
    } = await request(app.getHttpServer())
      .put('/auth/verify')
      .send(payload)
      .expect(200);

    expect(message).toBe('account verified');
    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.emailVerified).toBe(true);
  });

  it('/auth/forgot-password (GET)', async () => {
    const userObj: Partial<User> = {
      email: randomEmail(),
      password: randomString(),
    };
    await connection.models[USER].create(userObj);

    const {
      body: { message },
    } = await request(app.getHttpServer())
      .get(`/auth/forgot-password?email=${userObj.email}`)
      .expect(200);

    expect(message).toBe('reset token sent to email');
  });

  it('/auth/reset (PUT)', async () => {
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

    const {
      body: { message },
    } = await request(app.getHttpServer())
      .put('/auth/reset')
      .send(payload)
      .expect(200);

    const resetUser = await connection.models[USER].findOne({ _id: user._id });
    expect(message).toBe('password reset');
    expect(resetUser).toBeDefined();
    expect(compareSync(newPassword, resetUser.password)).toBe(true);
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
  });
});
