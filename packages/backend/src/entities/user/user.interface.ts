import { IBaseEntity } from '../base.interface';

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName?: string;
  username: string;
  contactNumber: string;
  password: string;
}

export type ISanitizedUser = Omit<IUser, 'password'>;

export interface IUserToken {
  username: string;
  token: string;
}
