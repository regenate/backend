import { ApiProperty } from '@nestjs/swagger';
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
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class UpdateMentorExpertiseDTO {
  @ApiProperty({
    description: 'mentor expertise',
    required: true,
  })
  @IsArray()
  @ArrayUnique()
  expertise: ExpertiseEnum[];
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
