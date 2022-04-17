import configuration from '@config//configuration';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User, UserService } from '@src/user/index';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(payload: any): Promise<User> {
    const { user } = payload;
    const userObj = await this.userService.getSingleUser({ _id: user.id });
    return userObj;
  }
}
