import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import configuration from '@src/config/configuration';
import { EmailService } from './interfaces';
import { Address, Mail } from './types';

@Injectable()
export class SendGridService implements EmailService {
  private client: typeof SendGrid = SendGrid;

  constructor() {
    this.client.setApiKey(configuration().sendGrid.apiKey);
  }

  async sendMail(mail: Mail): Promise<void> {
    const payload: Mail & { from: Address } = {
      ...mail,
      from:
        mail.from ||
        new Address(
          configuration().sendGrid.from.email,
          configuration().sendGrid.from.name,
        ),
    };

    await this.client.send(payload);
  }
}
