import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/authentication/jwt-auth.guard';
import { LoggerService } from '@src/logger';
import { ChooseUserTypeDTO } from '@src/user';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'choose user type',
  })
  @ApiResponse({
    status: 201,
    description: 'user type created',
  })
  @ApiBody({
    type: ChooseUserTypeDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('type')
  async createUserType(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: ChooseUserTypeDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('creating user type');

      const userType = await this.userService.createUsertype(user.id, input);

      this.logger.success('done creating user type');

      this.responseService.json(res, 201, 'user type created', userType);
    } catch (error) {
      this.logger.error(
        `error occurred while trying to user type - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }
}
