import { Inject, Injectable } from '@nestjs/common';
import { configure, Environment } from 'nunjucks';
import { join } from 'path';
import { EMAILSERVICE } from './constants';
import {
  EmailService,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from './interfaces';
import { Address, Mail } from './types';

@Injectable()
export class TemplateEngine {
  private engine: Environment;

  constructor(@Inject(EMAILSERVICE) private emailService: EmailService) {
    const path = join(__dirname, '../../', 'templates');
    this.engine = configure(path, { autoescape: true });
  }

  async sendVerifyEmail(
    recipient: string,
    payload: VerifyEmailPayload,
  ): Promise<void> {
    const mail = new Mail(
      [new Address(recipient)],
      'Please verify your Regnate account',
      this.engine.render('verify-email.njk', payload),
    );

    await this.emailService.sendMail(mail);
  }

  async sendResetPassword(
    recipient: string,
    payload: ResetPasswordPayload,
  ): Promise<void> {
    const mail = new Mail(
      [new Address(recipient)],
      'Please verify your Regnate account',
      this.engine.render('request-reset-token.njk', payload),
    );

    await this.emailService.sendMail(mail);
  }
}
