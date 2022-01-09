import { IsNotEmpty, IsString } from 'class-validator';
import { IUserToken } from '@package/entities';

export interface ILoginDTO {
  username: string;
  password: string;
}

export type IUserLoginResponse = IUserToken;

export class LoginDTO implements ILoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
