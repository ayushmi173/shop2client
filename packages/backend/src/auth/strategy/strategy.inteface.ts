import { ISanitizedUser } from '@package/entities';

export interface IValidateJwtPayload {
  user: ISanitizedUser;
  sub: string;
  iat: number;
  exp: number;
}
