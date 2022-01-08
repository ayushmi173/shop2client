import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ISanitizedUser } from '@package/entities';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<ISanitizedUser> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) throw new UnauthorizedException('User is not logged in');
    return user;
  }
}
