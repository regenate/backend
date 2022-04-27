/* eslint-disable camelcase */
import { BadRequestException } from '@nestjs/common';
import configuration from '@src/config/configuration';
import * as cloudinary from 'cloudinary';
import { FileUpload } from './interfaces';
import { Uploader } from './uploader.interface';

export class Cloudinary implements Uploader {
  private client: typeof cloudinary.v2.uploader;

  constructor() {
    const {
      // eslint-disable-next-line camelcase
      cloudinary: { name: cloud_name, key: api_key, secret: api_secret },
    } = configuration();

    const cloud = cloudinary.v2;

    cloud.config({
      cloud_name,
      api_key,
      api_secret,
    });
    this.client = cloud.uploader;
  }

  name(): string {
    return 'cloudinary uploader';
  }

  async upload(
    filename: string,
    content: Buffer | string,
    upload: FileUpload,
  ): Promise<string> {
    try {
      let dataURI = content;
      if (!Buffer.isBuffer(content)) {
        dataURI = Buffer.from(content.split(';base64,').pop(), 'base64');
      }

      const uploadString = `data:${upload.mime};base64,${dataURI.toString(
        'base64',
      )}`;

      const result = await this.client.upload(uploadString, {
        public_id: filename,
      });

      return result.url;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  delete(_filename: string): Promise<boolean> {
    return Promise.reject(new Error('not supported'));
  }
}
