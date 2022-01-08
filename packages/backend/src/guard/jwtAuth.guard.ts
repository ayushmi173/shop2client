import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ISanitizedUser } from '@package/entities';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    error: Error,
    user: ISanitizedUser,
    info: any,
    context: ExecutionContext,
    status: number,
  ): any {
    if (info instanceof JsonWebTokenError || error || !user) {
      throw new UnauthorizedException('Invalid token or expired token!');
    }

    return super.handleRequest(error, user, info, context, status);
  }
}
