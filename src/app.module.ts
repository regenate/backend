import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: configuration().isTest,
      load: [configuration],
    }),
    LoggerModule,
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    UtilModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
