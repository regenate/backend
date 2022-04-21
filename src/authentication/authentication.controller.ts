import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '@src/logger';
import { UserDTO } from '@src/user';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginDTO, PasswordResetDTO, VerifyEmailDTO } from './dtos';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly logger: LoggerService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'Signup user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
  })
  @ApiBody({
    type: UserDTO,
  })
  @Post('signup')
  async signup(@Res() res: Response, @Body() input: UserDTO): Promise<void> {
    try {
      this.logger.log('signing up user');
      const user = await this.authenticationService.signup(
        input.email,
        input.password,
      );
      this.logger.success('done signing up user');

      this.responseService.json(res, 201, 'account created', user);
    } catch (error) {
      this.logger.error(
        `error occurred while trying to signup user - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'login user',
  })
  @ApiResponse({
    status: 200,
    description: 'logged in',
  })
  @ApiBody({
    type: LoginDTO,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Res() res: Response,
    @Req() req: Request,
    @Body() _body: LoginDTO,
  ): Promise<void> {
    const { user } = req;

    this.responseService.json(res, 200, 'logged in', user);
  }

  @ApiOperation({
    summary: 'verify user account',
  })
  @ApiResponse({
    status: 200,
    description: 'account verified',
  })
  @ApiBody({
    type: VerifyEmailDTO,
  })
  @Put('verify')
  async verifyEmail(
    @Res() res: Response,
    @Body() { token, email }: VerifyEmailDTO,
  ): Promise<void> {
    try {
      this.logger.log('verifying user account');
      const user = await this.authenticationService.verifyEmail(token, email);
      this.logger.success('done verifying user account');

      this.responseService.json(res, 200, 'account verified', user);
    } catch (error) {
      this.logger.error(`error verifying user's account - ${error.message}`);
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'forgot password',
  })
  @ApiResponse({
    status: 200,
    description: 'reset token sent',
  })
  @ApiQuery({
    name: 'email',
  })
  @Get('forgot-password')
  async forgotPassword(
    @Res() res: Response,
    @Query() { email }: { email: string },
  ): Promise<void> {
    try {
      this.logger.log('requesting reset token');
      await this.authenticationService.requestResetToken(email);
      this.logger.success('done requesting reset token');

      this.responseService.json(res, 200, 'reset token sent to email');
    } catch (error) {
      this.logger.error(`error requesting reset token - ${error.message}`);
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'reset password',
  })
  @ApiResponse({
    status: 200,
    description: 'password reset',
  })
  @ApiBody({
    type: PasswordResetDTO,
  })
  @Put('reset')
  async resetPassword(
    @Res() res: Response,
    @Body() { resetToken, newPassword, confirmNewPassword }: PasswordResetDTO,
  ): Promise<void> {
    try {
      this.logger.log('resetting user password');
      const user = await this.authenticationService.resetPassword(
        resetToken,
        newPassword,
        confirmNewPassword,
      );
      this.logger.success('done resetting user password');

      this.responseService.json(res, 200, 'password reset', user);
    } catch (error) {
      this.logger.error(`error resetting user password - ${error.message}`);
      this.responseService.json(res, error);
    }
  }
}
