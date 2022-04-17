import { Injectable } from '@nestjs/common';
import { LoggerService } from '@src/logger';
import { EmailService } from './interfaces';
import { Address, Mail } from './types';

@Injectable()
export class MockEmail implements EmailService {
  constructor(private readonly loggerService: LoggerService) {}

  async sendMail(mail: Mail): Promise<void> {
    const payload: Mail & { from: Address } = {
      ...mail,
      from: mail.from || new Address('<noreply>@regnate.com', 'Regnate'),
    };

    this.loggerService.success(
      '\n[Mail]\n',
      `\nFrom: ${payload.from.name} ${payload.from.email} \n`,
      `\nTo:
      ${payload.to.map((e) => `${e.name || ''} ${e.email}`).join(', ')}\n`,
      `\npayload: ${payload.html}\n`,
    );
  }
}
