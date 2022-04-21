import { DynamicModule, Global, Module } from '@nestjs/common';
import { EMAILSERVICE } from './constants';
import { MockEmail } from './mock-email.service';
import { SendGridService } from './sendgrid.service';
import { TemplateEngine } from './template.service';

@Global()
@Module({})
export class EmailModule {
  static forRoot(useMock: boolean): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: EMAILSERVICE,
          useClass: useMock ? MockEmail : SendGridService,
        },
        TemplateEngine,
      ],
      exports: [TemplateEngine],
    };
  }
}
