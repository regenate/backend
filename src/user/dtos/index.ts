/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { ExperienceLevelEnum } from '@src/enums/experience-level';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import { TopicEnum } from '@src/enums/topic';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
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
    description: 'name',
    required: true,
    default: 'john',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'country',
    required: true,
    default: 'nigeria',
  })
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiProperty({
    description: 'language',
    required: true,
    default: 'english',
  })
  @IsString()
  @IsNotEmpty()
  language?: string;
}

export class UpdateMentorExpertiseDTO {
  @ApiProperty({
    description: 'mentor expertise',
    required: true,
    default: 1,
  })
  @IsNotEmpty()
  @IsEnum(ExpertiseEnum)
  expertise: ExpertiseEnum;

  @ApiProperty({
    description: 'mentor experience level',
    required: true,
    default: 3,
  })
  @IsNotEmpty()
  @IsEnum(ExperienceLevelEnum)
  experienceLevel: ExperienceLevelEnum;
}

export class UpdateMentorBackgroundDTO {
  @ApiProperty({
    description: 'mentor company or school',
    required: false,
    default: 'tuhh',
  })
  @IsString()
  companyOrSchool: string;

  @ApiProperty({
    description: 'mentor company or school',
    required: false,
    default: 'software consultant',
  })
  @IsString()
  jobTitle: string;

  @ApiProperty({
    description: 'mentor company or school',
    required: false,
    default: 'www.linkedin.com',
  })
  @IsString()
  linkedlnUrl: string;

  @ApiProperty({
    description: 'mentor portfolio',
    required: false,
    default: 'www.myportfolio.com',
  })
  @IsString()
  figmaPortfolioUrl: string;

  @ApiProperty({
    description: 'mentor gitHubUrl',
    required: false,
    default: 'www.github.com',
  })
  @IsString()
  gitHubUrl: string;
}

export class UpdateMentorTopicDTO {
  @ApiProperty({
    description: 'mentor topic',
    default: [1, 2],
  })
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  topic: TopicEnum[];
}

export class UpdateMentorBioDTO {
  @ApiProperty({
    description: 'mentor bio',
    required: false,
    default:
      'my name is john and i am a software developer with experience in a cross functional team',
  })
  @IsString()
  bio?: string;
}

// ------------------------------------------------------------------- MENTEE -------------------------------------------------------------------

export class UpdateMenteeOriginDTO {
  @ApiProperty({
    description: 'name',
    required: true,
    default: 'john',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'country',
    required: true,
    default: 'nigeria',
  })
  @IsString()
  @IsNotEmpty()
  country?: string;

  @ApiProperty({
    description: 'language',
    required: true,
    default: 'english',
  })
  @IsString()
  @IsNotEmpty()
  language?: string;
}

export class UpdateMenteeExpertiseDTO {
  @ApiProperty({
    description: 'mentee expertise',
    required: true,
    default: 3,
  })
  @IsNotEmpty()
  @IsEnum(ExpertiseEnum)
  expertise: ExpertiseEnum;

  @ApiProperty({
    description: 'mentee experience level',
    required: true,
    default: 2,
  })
  @IsNotEmpty()
  @IsEnum(ExperienceLevelEnum)
  experienceLevel: ExperienceLevelEnum;
}

export class UpdateMenteeBackgroundDTO {
  @ApiProperty({
    description: 'mentee portfolio',
    required: false,
    default: 'www.myportfolio.com',
  })
  @IsString()
  figmaPortfolioUrl: string;

  @ApiProperty({
    description: 'mentee gitHubUrl',
    required: false,
    default: 'www.github.com',
  })
  @IsString()
  gitHubUrl: string;

  @ApiProperty({
    description: 'mentee linkedlnUrl',
    required: false,
    default: 'www.linkedin.com',
  })
  @IsString()
  linkedlnUrl: string;
}

export class UpdateMenteeBioDTO {
  @ApiProperty({
    description: 'mentee bio',
    required: false,
    default: 'I am a serious student who is willing to to learn',
  })
  @IsString()
  bio?: string;
}
