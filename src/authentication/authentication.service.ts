/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import configuration from '@src/config/configuration';
import { DB_CONNECTION } from '@src/database';
import { TemplateEngine } from '@src/email';
import { UserService } from '@src/user';
import { UtilService } from '@src/util/util.service';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { DurationInputArg1, DurationInputArg2 } from 'moment';
import { Connection, Model } from 'mongoose';
import { REQUEST_RESET_TOKEN } from './constants';
import { RequestResetToken } from './interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(REQUEST_RESET_TOKEN)
    private readonly requestResetTokenModel: Model<RequestResetToken>,
    @Inject(DB_CONNECTION) private readonly connection: Connection,
    private readonly userService: UserService,
    private readonly templateEngine: TemplateEngine,
    private readonly utilService: UtilService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    if (isEmpty(username) || isEmpty(password)) return null;
    const userExists = await this.userService.getSingleUser({
      $or: [{ username }, { email: username }],
    });
    if (!userExists || !(await userExists.authenticatePassword(password)))
      return null;

    return {
      ...userExists.toJSON(),
      bearerToken: this.signAuthPayload({ user: { id: userExists.id } }),
    };
  }

  async signup(email: string, password: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const emailAlreadyExists = await this.userService.getSingleUser({
        email,
      });
      if (emailAlreadyExists)
        throw new ConflictException('email already exists');

      const emailVerificationCode = this.utilService.generateRandom(6);
      const [user] = await this.userService.createSingleUser(
        {
          email,
          password,
          emailVerificationCode,
        },
        session,
      );

      await this.templateEngine.sendVerifyEmail(email, {
        verifyLink: `${
          configuration().ui.baseUrl
        }/auth/verify?verifyToken=${emailVerificationCode}&emailHash=${
          user.emailHash
        }`,
      });

      await session.commitTransaction();
      return {
        ...user.toJSON(),
        bearerToken: this.signAuthPayload({ user: { id: user.id } }),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async verifyEmail(token: string, emailHash: string) {
    if (!token || !emailHash) {
      throw new BadRequestException('token or email hash cannot be null');
    }
    const user = await this.userService.getSingleUser({
      emailVerificationCode: token,
      emailHash,
    });

    if (!user) throw new BadRequestException('invalid token');
    await this.userService.updateSingleUser(
      {
        _id: user.id,
      },
      { emailVerified: true },
    );
    const verifiedUser = await this.userService.getSingleUser({ _id: user });
    return {
      ...verifiedUser.toJSON(),
      bearerToken: this.signAuthPayload({ user: { id: verifiedUser.id } }),
    };
  }

  async requestResetToken(email: string) {
    const user = await this.userService.getSingleUser({ email });
    if (!user) throw new BadRequestException('invalid email address');
    const token = this.utilService.generateRandom(8);

    await Promise.all([
      this.requestResetTokenModel.create({
        token,
        user,
      }),
      this.templateEngine.sendResetPassword(user.email, {
        resetLink: `${
          configuration().ui.baseUrl
        }/reset-password?resetToken=${token}&emailHash=${user.emailHash}`,
      }),
    ]);

    return true;
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    if (newPassword !== confirmNewPassword)
      throw new BadRequestException('passwords do not match');
    const requestToken = await this.requestResetTokenModel.findOne({
      token: resetToken,
      isDeleted: false,
      isUsed: false,
    });
    const [amount, unit] = configuration().resetTokenExpire.split(' ');
    if (!requestToken)
      throw new BadRequestException('invalid or used reset token');
    const now = Date.now();
    const allowedTime = moment(requestToken.createdAt)
      .add(<DurationInputArg1>+amount, <DurationInputArg2>unit)
      .toDate()
      .getTime();
    if (now > allowedTime) throw new BadRequestException('reset token expired');
    const getUser = await this.userService.getSingleUser({
      _id: requestToken.user,
    });
    getUser.password = newPassword;

    const [resetUser] = await Promise.all([
      getUser.save(),
      this.requestResetTokenModel.updateMany(
        { _id: requestToken },
        { isUsed: true },
      ),
    ]);
    return {
      ...resetUser.toJSON(),
      bearerToken: this.signAuthPayload({ user: { id: resetUser.id } }),
    };
  }

  signAuthPayload(payload: { user: { id: string } }): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
