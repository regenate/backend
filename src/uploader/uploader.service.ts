import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@src/logger';
import { UPLOADER } from './constants';
import { FileUploadDTO } from './dto';
import { UploadedResource } from './interfaces';
import { Uploader } from './uploader.interface';

@Injectable()
export class UploadService {
  // TODO: handle removing an image
  constructor(@Inject(UPLOADER) private uploader: Uploader) {}

  async uploadFile(
    input: FileUploadDTO,
    logger: Logger,
  ): Promise<UploadedResource> {
    logger.log(`uploading ${input.filename} using ${this.uploader.name()}`);

    const currentTimestamp = new Date().getTime();
    const filename = `${encodeURI(input.filename)}-${currentTimestamp}.${
      input.mime.split('/')[1]
    }`;
    logger.log(`uploading with filename: ${filename}`);

    const path = `regnate/${filename}`;
    const url = await this.uploader.upload(path, input.data, input);
    return {
      url,
      filename,
      mime: input.mime,
    };
  }
}
