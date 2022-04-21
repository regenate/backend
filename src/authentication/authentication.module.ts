import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import configuration from '@src/config/configuration';
import { EmailModule } from '@src/email/email.module';
import { UserModule } from '@src/user/user.module';
import { UtilModule } from '@src/util/util.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { authenticationProviders } from './providers';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: configuration().jwt.secret,
        signOptions: { expiresIn: configuration().jwt.expiresIn },
      }),
    }),
    UserModule,
    EmailModule,
    UtilModule,
  ],
  providers: [
    ...authenticationProviders,
    LocalStrategy,
    JwtStrategy,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
