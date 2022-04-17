import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

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
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.&])[A-Za-z\d@$!%*.#?&]{8,20}$/gi,
    {
      message:
        'password must be 8-20 characters long, and must contain at least one letter, one number and one special character',
    },
  )
  @IsNotEmpty()
  password: string;

  emailVerificationCode?: string;
}
