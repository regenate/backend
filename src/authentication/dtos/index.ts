import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/user';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestResetTokenDTO {
  token: string;

  user: User;

  isUsed: boolean;
}

export class LoginDTO {
  @ApiProperty({
    description: 'username/email',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'user password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
