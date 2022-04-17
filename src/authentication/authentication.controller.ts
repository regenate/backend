import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '@src/logger';
import { UserDTO } from '@src/user';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from './dtos';

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
}
