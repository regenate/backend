import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserTypeEnum } from '../enums/user-type';

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

export class ChooseUserTypeDTO {
  @ApiProperty({
    description: 'user type',
    required: true,
  })
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}
