import { ApiProperty } from '@nestjs/swagger';
import { ExpertiseEnum } from '@src/enums/expertise';
import { RoleEnum } from '@src/enums/role';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
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
