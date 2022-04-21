import { DynamicModule, Global, Module } from '@nestjs/common';
import { Logger } from './interfaces';
import { LoggerService } from './logger.service';

const dummyLogger: Logger = {
  log(): void {
    // do nothing
  },
  error(): void {
    // do nothing
  },
  success() {
    // do nothing
  },
};
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static forRoot(turnOff: boolean): DynamicModule {
    return {
      module: LoggerModule,
      providers: turnOff
        ? [
            {
              provide: LoggerService,
              useValue: dummyLogger,
            },
          ]
        : [],
    };
  }
}
