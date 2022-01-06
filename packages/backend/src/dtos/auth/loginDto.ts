import { IsNotEmpty, IsString } from 'class-validator';

export interface ILoginDTO {
  username: string;
  password: string;
}

export class LoginDTO implements ILoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
