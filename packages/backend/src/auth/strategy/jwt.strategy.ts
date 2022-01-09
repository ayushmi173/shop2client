import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENVIRONMENT_VARIABLES } from '@package/config';
import { IValidateJwtPayload } from './strategy.inteface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        ENVIRONMENT_VARIABLES.JWT_SECRET_KEY,
      ),
    });
  }

  async validate(payload: IValidateJwtPayload) {
    return { id: payload.sub, user: payload.user };
  }
}
