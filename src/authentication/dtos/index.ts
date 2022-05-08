import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

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
  token: string;

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
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.&])[A-Za-z\d@$!%*.#?&]{8,20}$/gi,
    {
      message:
        'password must be 8-20 characters long, and must contain at least one letter, one number and one special character',
    },
  )
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'confirm new password',
    required: true,
  })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.&])[A-Za-z\d@$!%*.#?&]{8,20}$/gi,
    {
      message:
        'password must be 8-20 characters long, and must contain at least one letter, one number and one special character',
    },
  )
  @IsNotEmpty()
  confirmNewPassword: string;
}
