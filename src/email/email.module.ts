import { Module } from '@nestjs/common';
import configuration from '@src/config/configuration';
import { EMAILSERVICE } from './constants';
import { MockEmail } from './mock-email.service';
import { SendGridService } from './sendgrid.service';
import { TemplateEngine } from './template.service';

@Module({
  providers: [
    {
      provide: EMAILSERVICE,
      useClass:
        configuration().useMockEmail || configuration().isTest
          ? MockEmail
          : SendGridService,
    },
    TemplateEngine,
  ],
  exports: [TemplateEngine],
})
export class EmailModule {}
