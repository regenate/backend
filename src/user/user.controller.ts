import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorize } from '@src/authentication/authorization.decorator';
import { JwtAuthGuard } from '@src/authentication/jwt-auth.guard';
import { LoggerService } from '@src/logger';
import { FileUploadDTO } from '@src/uploader';
import { ResponseService } from '@src/util/response.service';
import { Request, Response } from 'express';
import {
  ChooseUserRoleDTO,
  UpdateMenteeBackgroundDTO,
  UpdateMenteeBioDTO,
  UpdateMenteeExpertiseDTO,
  UpdateMenteeOriginDTO,
  UpdateMentorBackgroundDTO,
  UpdateMentorBioDTO,
  UpdateMentorExpertiseDTO,
  UpdateMentorOriginDTO,
  UpdateMentorTopicDTO,
} from './dtos';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
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

      const userData = await this.userService.createUserRole(user.id, input);

      this.logger.success('done creating user role');

      this.responseService.json(res, 201, 'user role created', userData);
    } catch (error) {
      this.logger.error(
        `error occurred while trying to create user role - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }
}

// ------------------------------------------------------------------- MENTOR -------------------------------------------------------------------
@ApiTags('mentor')
@ApiBearerAuth()
@Controller('mentor')
export class MentorController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'update mentor origin',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor origin updated',
  })
  @ApiBody({
    type: UpdateMentorOriginDTO,
  })
  @Authorize('mentor')
  @Post('origin')
  async updateMentorOrigin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorOriginDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor origin');

      const mentor = await this.userService.updateMentorshipOrigin(
        user.id,
        input,
      );

      this.logger.success('done updating mentor origin');

      this.responseService.json(res, 201, 'mentor origin updated', mentor);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor origin - ${error.message}`,
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
  @Post('expertise')
  async updateMentorExpertise(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorExpertiseDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor expertise');

      const mentor = await this.userService.updateMentorshipExpertise(
        user.id,
        input,
      );

      this.logger.success('done updating mentor expertise');

      this.responseService.json(res, 201, 'mentor expertise updated', mentor);
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
  @Post('background')
  async updateMentorBackground(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorBackgroundDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor background');

      const mentor = await this.userService.updateMentorBackground(
        user.id,
        input,
      );

      this.logger.success('done updating mentor background');

      this.responseService.json(res, 201, 'mentor background updated', mentor);
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
  @Post('topic')
  async updateMentorbackground(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorTopicDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor topic');

      const mentor = await this.userService.updateMentorTopic(user.id, input);

      this.logger.success('done updating mentor topic');

      this.responseService.json(res, 201, 'mentor topic updated', mentor);
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
    type: FileUploadDTO,
  })
  @Authorize('mentor')
  @Post('avatar')
  async updateMentorProfilePicture(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: FileUploadDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor avatar');

      const mentor = await this.userService.updateMentorProfilePicture(
        user.id,
        input,
        this.logger,
      );

      this.logger.success('done updating mentor avatar');

      this.responseService.json(res, 201, 'mentor avatar updated', mentor);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor avatar - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentor bio',
  })
  @ApiResponse({
    status: 201,
    description: 'mentor bio updated',
  })
  @ApiBody({
    type: UpdateMentorBioDTO,
  })
  @Authorize('mentor')
  @Post('bio')
  async updateMentorBio(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMentorBioDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentor bio');

      const mentor = await this.userService.updateMentorBio(user.id, input);

      this.logger.success('done updating mentor bio');

      this.responseService.json(res, 201, 'mentor bio updated', mentor);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentor bio - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'get mentor home information',
  })
  @ApiResponse({
    status: 200,
    description: 'home',
  })
  @Authorize('mentor')
  @Get('home')
  async getHome(@Res() res: Response, @Req() req: Request): Promise<void> {
    try {
      const { user } = req;
      this.logger.log('retrieving mentor info');
      const mentor = await this.userService.getMentor(user.id);
      this.logger.success('done retrieving mentor info');

      const home = {
        mentor,
      };
      this.responseService.json(res, 200, 'home', home);
    } catch (error) {
      this.logger.error(`error occurred while getting home - ${error.message}`);
      this.responseService.json(res, error);
    }
  }
}

// ------------------------------------------------------------------- MENTEE -------------------------------------------------------------------
@ApiTags('mentee')
@ApiBearerAuth()
@Controller('mentee')
export class MenteeController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly responseService: ResponseService,
  ) {}

  @ApiOperation({
    summary: 'update mentee origin',
  })
  @ApiResponse({
    status: 201,
    description: 'mentee origin updated',
  })
  @ApiBody({
    type: UpdateMenteeOriginDTO,
  })
  @Authorize('mentee')
  @Post('origin')
  async updateMenteeOrigin(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMenteeOriginDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentee origin');

      const mentee = await this.userService.updateMenteeOrigin(user.id, input);

      this.logger.success('done updating mentee origin');

      this.responseService.json(res, 201, 'mentee origin updated', mentee);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentee origin - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentee expertise',
  })
  @ApiResponse({
    status: 201,
    description: 'mentee expertise updated',
  })
  @ApiBody({
    type: UpdateMenteeExpertiseDTO,
  })
  @Authorize('mentee')
  @Post('expertise')
  async updateMenteeExpertise(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMenteeExpertiseDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentee expertise');

      const mentee = await this.userService.updateMenteeExpertise(
        user.id,
        input,
      );

      this.logger.success('done updating mentee expertise');

      this.responseService.json(res, 201, 'mentee expertise updated', mentee);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentee expertise - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentee background',
  })
  @ApiResponse({
    status: 201,
    description: 'mentee background updated',
  })
  @ApiBody({
    type: UpdateMenteeBackgroundDTO,
  })
  @Authorize('mentee')
  @Post('background')
  async updateMenteeBackground(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMenteeBackgroundDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentee background');

      const mentee = await this.userService.updateMenteeBackground(
        user.id,
        input,
      );

      this.logger.success('done updating mentee background');

      this.responseService.json(res, 201, 'mentee background updated', mentee);
    } catch (error) {
      this.logger.error(
        `error occurred while creating mentee background - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentee avatar',
  })
  @ApiResponse({
    status: 201,
    description: 'mentee avatar updated',
  })
  @ApiBody({
    type: FileUploadDTO,
  })
  @Authorize('mentee')
  @Post('avatar')
  async updateMentorProfilePicture(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: FileUploadDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentee avatar');

      const mentee = await this.userService.updateMenteeProfilePicture(
        user.id,
        input,
        this.logger,
      );

      this.logger.success('done updating mentee avatar');

      this.responseService.json(res, 201, 'mentee avatar updated', mentee);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentee avatar - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'update mentee bio',
  })
  @ApiResponse({
    status: 201,
    description: 'mentee bio updated',
  })
  @ApiBody({
    type: UpdateMenteeBioDTO,
  })
  @Authorize('mentee')
  @Post('bio')
  async updateMentorBio(
    @Res() res: Response,
    @Req() req: Request,
    @Body() input: UpdateMenteeBioDTO,
  ): Promise<void> {
    try {
      const { user } = req;

      this.logger.log('updating mentee bio');

      const mentee = await this.userService.updateMenteeBio(user.id, input);

      this.logger.success('done updating mentee bio');

      this.responseService.json(res, 201, 'mentee bio updated', mentee);
    } catch (error) {
      this.logger.error(
        `error occurred while updating mentee bio - ${error.message}`,
      );
      this.responseService.json(res, error);
    }
  }

  @ApiOperation({
    summary: 'get mentee home information',
  })
  @ApiResponse({
    status: 200,
    description: 'home',
  })
  @Authorize('mentee')
  @Get('home')
  async getHome(@Res() res: Response, @Req() req: Request): Promise<void> {
    try {
      const { user } = req;
      this.logger.log('retrieving mentee info');
      const mentee = await this.userService.getMentee(user.id);
      this.logger.success('done retrieving mentee info');

      const home = {
        mentee,
      };

      this.responseService.json(res, 200, 'home', home);
    } catch (error) {
      this.logger.error(`error occurred while getting home - ${error.message}`);
      this.responseService.json(res, error);
    }
  }
}
