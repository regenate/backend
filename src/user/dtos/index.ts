/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevelEnum } from '@src/enums/experience-level';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { TopicEnum } from '@src/enums/topic';
import { FileUploadDTO } from '@src/uploader';
import {
  ArrayUnique,
  Contains,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: 'user email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  emailVerificationCode?: string;
}

export class ChooseUserRoleDTO {
  @ApiProperty({
    description: 'user role',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

// ------------------------------------------------------------------- MENTOR -------------------------------------------------------------------

export class UpdateMentorOriginDTO {
  @ApiProperty({
    description: 'country',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiProperty({
    description: 'language',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  language?: string;
}

export class UpdateMentorExpertiseDTO {
  @ApiProperty({
    description: 'mentor expertise',
    required: true,
  })
  @IsEnum(ExpertiseEnum)
  expertise: ExpertiseEnum;

  @ApiProperty({
    description: 'mentor experience level',
    required: true,
  })
  @IsEnum(ExperienceLevelEnum)
  experienceLevel: ExperienceLevelEnum;
}

export class UpdateMentorBackgroundDTO {
  @ApiProperty({
    description: 'mentor company or school',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyOrSchool: string;

  @ApiProperty({
    description: 'mentor company or school',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({
    description: 'mentor company or school',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Contains('linkedin.com')
  linkedlnUrl: string;
}

export class UpdateMentorTopicDTO {
  @ApiProperty({
    description: 'mentor topic',
    required: true,
  })
  @IsArray()
  @ArrayUnique()
  topic: TopicEnum[];
}

export class UpdateMentorProfilePictureDTO {
  @ApiProperty({
    description: 'mentor avatar',
    required: false,
    type: FileUploadDTO,
  })
  @IsOptional()
  @ValidateNested()
  avatar?: FileUploadDTO;
}

export class UpdateMentorBioDTO {
  @ApiProperty({
    description: 'mentor bio',
    required: false,
  })
  @IsString()
  bio?: string;
}

// ------------------------------------------------------------------- MENTEE -------------------------------------------------------------------

export class UpdateMenteeOriginDTO {
  @ApiProperty({
    description: 'country',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiProperty({
    description: 'language',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  language?: string;
}

export class UpdateMenteeExpertiseDTO {
  @ApiProperty({
    description: 'mentee expertise',
    required: true,
  })
  @IsEnum(ExpertiseEnum)
  expertise: ExpertiseEnum;

  @ApiProperty({
    description: 'mentee experience level',
    required: true,
  })
  @IsEnum(ExperienceLevelEnum)
  experienceLevel: ExperienceLevelEnum;
}

export class UpdateMenteeBackgroundDTO {
  @ApiProperty({
    description: 'mentee portfolio',
    required: false,
  })
  @IsString()
  @Contains('www.')
  figmaPortfolioUrl: string;

  @ApiProperty({
    description: 'mentee gitHubUrl',
    required: false,
  })
  @IsString()
  @Contains('www.')
  gitHubUrl: string;

  @ApiProperty({
    description: 'mentee linkedlnUrl',
    required: false,
  })
  @IsString()
  @Contains('linkedin.com')
  linkedlnUrl: string;
}

export class UpdateMenteeProfilePictureDTO {
  @ApiProperty({
    description: 'mentee avatar',
    required: false,
    type: FileUploadDTO,
  })
  @IsOptional()
  @ValidateNested()
  avatar?: FileUploadDTO;
}

export class UpdateMenteeBioDTO {
  @ApiProperty({
    description: 'mentee bio',
    required: false,
  })
  @IsString()
  bio?: string;
}
