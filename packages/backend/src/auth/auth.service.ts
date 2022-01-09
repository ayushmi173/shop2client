import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IUserRegistrationResponse,
  LoginDTO,
  RegistrationDTO,
} from '../dtos/auth';
import { ISanitizedUser, IUserToken, UserEntity } from '@package/entities';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly authRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserDto: RegistrationDTO,
  ): Promise<IUserRegistrationResponse> {
    const existedUser: UserEntity | undefined = await this.authRepo.findOne({
      username: registerUserDto.username,
    });

    if (existedUser)
      throw new ConflictException('User is already exist with given id');

    const user: UserEntity = this.authRepo.create({ ...registerUserDto });

    if (registerUserDto.password !== registerUserDto.confirmPassword)
      throw new NotAcceptableException('Both password should be same');

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const registeredUser: ISanitizedUser = await this.authRepo.save(user);

    if (!registeredUser)
      throw new NotAcceptableException(`Can't register with this user`);

    return await this.login(registeredUser);
  }

  async findOne(id: string): Promise<ISanitizedUser> {
    const user = await this.authRepo.findOne(id);
    if (!user) throw new NotFoundException('User is not found with given id');

    return user;
  }

  async validateUser({
    username,
    password,
  }: LoginDTO): Promise<ISanitizedUser | undefined> {
    const user = await this.authRepo.findOne({
      username,
    });
    if (!user) throw new NotFoundException('Username is found');

    const isEqualPassword = await bcrypt.compare(password, user.password);

    if (isEqualPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...validatedUser } = user;
      return validatedUser;
    }

    return undefined;
  }

  async getMe(id: string): Promise<ISanitizedUser> {
    const user = await this.authRepo.findOne(id);

    if (!user) throw new NotFoundException(`User is not authorized yet!`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDetails } = user;
    return userDetails;
  }

  async login(user: ISanitizedUser): Promise<IUserToken> {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
