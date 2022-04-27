import { Global, Module } from '@nestjs/common';
import configuration from '@src/config/configuration';
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
  providers: [
    {
      provide: LoggerService,
      useFactory: (): Logger => {
        if (configuration().turnLoggerOff) {
          return dummyLogger;
        }
        return new LoggerService();
      },
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
