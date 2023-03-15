import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/services/users.service';
import { APPVars, configService } from 'config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APPVars.jwtSecrets.jwt.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneByPhoneNumber(
      payload.phoneNumber,
    );

    if (!user) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'Sorry the phone number is not yet registered.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.debug('Inside jwt validate', user);
    console.debug(payload);
    return user;
  }
}
