import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadedResourceDTO {
  public url: string;

  public filename: string;

  public bucket: string;

  public size: number;

  public type: string;
}

export class FileUploadDTO {
  @ApiProperty({
    description: 'file name',
    required: false,
    default: 'john_avatar',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({
    description: 'file size',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    description: 'file MIME type',
    required: true,
    default: 'jpeg',
  })
  @IsString()
  @IsNotEmpty()
  mime: string;

  @ApiProperty({
    description: 'Base64 encoded data',
    required: true,
  })
  @IsBase64()
  @IsNotEmpty()
  data: string;
}
