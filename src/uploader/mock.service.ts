import { HttpAdapterHost } from '@nestjs/core';
import configuration from '@src/config/configuration';
import { LoggerService } from '@src/logger';
import { FileUpload } from '@src/uploader';
import { Request, Response } from 'express';
import { Uploader } from './uploader.interface';

export class MockService implements Uploader {
  private uploads: Record<string, FileUpload> = {};

  constructor(
    private logger: LoggerService,
    private adapterHost: HttpAdapterHost,
  ) {
    // eslint-disable-next-line
    this.adapterHost?.httpAdapter?.get(
      '/mocks/*',
      (req: Request, res: Response) => {
        const file = req.url.split('/mocks/').pop();
        const upload = this.uploads[file];
        if (!upload) {
          res.status(404).end();
          return;
        }

        const buf = Buffer.from(upload.data.split(';base64,').pop(), 'base64');
        res.setHeader('Content-Type', upload.mime);
        res.send(buf);
      },
    );
    this.logger.success('mock upload route added');
  }

  name(): string {
    return 'mock uploader';
  }

  async upload(
    filename: string,
    _content: Buffer | string,
    upload: FileUpload,
  ): Promise<string> {
    this.logger.log(`uploading ${filename} to the mock cloud`);

    this.uploads[filename] = upload;
    const { port } = configuration();
    const url = `http://localhost:${port}/mocks/${filename}`;
    this.logger.log(`resource url: ${url}`);
    return url;
  }

  delete(_filename: string): Promise<boolean> {
    return Promise.reject(new Error('not supported'));
  }
}
