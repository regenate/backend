import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import configuration from '@src/config/configuration';
import { LoggerService } from '@src/logger';
import { Cloudinary } from './cloudinary.service';
import { UPLOADER } from './constants';
import { MockService } from './mock.service';
import { Uploader } from './uploader.interface';
import { UploadService } from './uploader.service';

@Module({
  providers: [
    {
      provide: UPLOADER,
      useFactory: (
        logger: LoggerService,
        adapter: HttpAdapterHost,
      ): Uploader => {
        if (configuration().useMockUploader) {
          logger.log('using mock uploader');
          return new MockService(logger, adapter);
        }

        logger.log('using cloudinary uploader');
        return new Cloudinary();
      },
      inject: [LoggerService, HttpAdapterHost],
    },
    UploadService,
  ],
  exports: [UploadService],
})
export class UploaderModule {}
