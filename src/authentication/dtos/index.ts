import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestResetTokenDTO {
  token: string;

  user: User;

  isUsed: boolean;
}

export class LoginDTO {
  @ApiProperty({
    description: 'username/email',
    required: true,
    default: 'test@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'user password',
    required: true,
    default: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDTO {
  @ApiProperty({
    description: 'verification token sent to user email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  verifyToken: string;

  @ApiProperty({
    description: 'user email hash',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  emailHash: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({
    description: 'user email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class PasswordResetDTO {
  @ApiProperty({
    description: 'reset token sent to email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({
    description: 'new password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'confirm new password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
