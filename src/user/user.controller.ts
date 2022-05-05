import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authorize } from '@src/authentication/authorization.decorator';
import { JwtAuthGuard } from '@src/authentication/jwt-auth.guard';
import { LoggerService } from '@src/logger';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import {
  ChooseUserRoleDTO,
  UpdateMentorBackgroundDTO,
  UpdateMentorExpertiseDTO,
  UpdateMentorProfilePictureDTO,
  UpdateMentorTopicDTO,
} from './dtos';
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
    summary: 'update mentor expertise',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor expertise updated',
  })
  @ApiBody({
    type: UpdateMentorExpertiseDTO,
  })
  @Authorize('mentor')
  @Post('mentor-expertise')
  async updateMentorExpertise(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorExpertiseDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor expertise');

      const mentorExpertise = await this.userService.updateMentorshipExpertise(
        user.id,
        input,
      );

      this.logger.success('done updating mentor expertise');

      this.responseService.json(
        res,
        201,
        'mentor expertise updated',
        mentorExpertise,
      );
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor expertise - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentor background',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor background updated',
  })
  @ApiBody({
    type: UpdateMentorBackgroundDTO,
  })
  @Authorize('mentor')
  @Post('mentor-background')
  async updateMentorBackground(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorBackgroundDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor background');

      const mentorExpertise = await this.userService.updateMentorBackground(
        user.id,
        input,
      );

      this.logger.success('done updating mentor background');

      this.responseService.json(
        res,
        201,
        'mentor background updated',
        mentorExpertise,
      );
    } catch (error) {
      this.logger.error(
        `error occurred while creating mentor background - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentor topic',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor topic updated',
  })
  @ApiBody({
    type: UpdateMentorTopicDTO,
  })
  @Authorize('mentor')
  @Post('mentor-topic')
  async updateMentorbackground(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorTopicDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor topic');

      const mentorExpertise = await this.userService.updateMentorTopic(
        user.id,
        input,
      );

      this.logger.success('done updating mentor topic');

      this.responseService.json(
        res,
        201,
        'mentor topic updated',
        mentorExpertise,
      );
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor topic - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentor avatar',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor avatar updated',
  })
  @ApiBody({
    type: UpdateMentorProfilePictureDTO,
  })
  @Authorize('mentor')
  @Post('mentor-avatar')
  async updateMentorProfilePicture(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorProfilePictureDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor avatar');

      const mentorExpertise = await this.userService.updateMentorProfilePicture(
        user.id,
        input,
        this.logger,
      );

      this.logger.success('done updating mentor avatar');

      this.responseService.json(
        res,
        201,
        'mentor avatar updated',
        mentorExpertise,
      );
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor avatar - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }
}
