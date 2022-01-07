export interface IValidateJwtPayload {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}
