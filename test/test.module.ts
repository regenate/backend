import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import configuration from '@src/config/configuration';
import { DatabaseModule } from '@src/database/database.module';
import { EmailModule } from '@src/email/email.module';
import { LoggerModule } from '@src/logger/logger.module';
import { UserModule } from '@src/user/user.module';
import { UtilModule } from '@src/util/util.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
      load: [configuration],
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
    LoggerModule.forRoot(configuration().turnLoggerOff),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    UtilModule,
    EmailModule.forRoot(configuration().useMockEmail),
  ],
  exports: [
    ConfigModule,
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    UtilModule,
    EmailModule,
    JwtModule,
  ],
})
export class TestModule {}
