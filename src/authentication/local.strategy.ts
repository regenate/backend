import { LoggerService } from '@logger/index';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authenticationService: AuthenticationService,
    private logger: LoggerService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.log('validating user credentials');
    const user = await this.authenticationService.login(username, password);
    if (!user) {
      this.logger.log('invalid user credentials');
      throw new UnauthorizedException();
    }

    this.logger.success('valid user credentials');
    return user;
  }
}
