import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '@src/authentication/authorization.decorator';
import { JwtAuthGuard } from '@src/authentication/jwt-auth.guard';
import { LoggerService } from '@src/logger';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import { ChooseUserRoleDTO, UpdateMentorExpertiseDTO } from './dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'choose user role',
  })
  @ApiResponse({
    status: 201,
    description: 'user role created',
  })
  @ApiBody({
    type: ChooseUserRoleDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post('role')
  async createUserRole(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: ChooseUserRoleDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('creating user role');

      const userRole = await this.userService.createUserRole(user.id, input);

      this.logger.success('done creating user role');

      this.responseService.json(res, 201, 'user role created', userRole);
    } catch (error) {
      this.logger.error(
        `error occurred while trying to create user role - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'create mentor expertise',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor expertise created',
  })
  @ApiBody({
    type: UpdateMentorExpertiseDTO,
  })
  @Authorize('mentor')
  @Post('mentor-expertise')
  async createMentorExpertise(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorExpertiseDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('creating mentor expertise');

      const mentorExpertise = await this.userService.updateMentorshipExpertise(
        user.id,
        input,
      );

      this.logger.success('done creating mentor expertise');

      this.responseService.json(
        res,
        201,
        'mentor expertise updated',
        mentorExpertise,
      );
    } catch (error) {
      this.logger.error(
        `error occurred while creating mentor expertise - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }
}
