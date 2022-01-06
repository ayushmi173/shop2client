import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO, RegistrationDTO } from '../dtos/auth';
import { ISanitizedUser, IUser, UserEntity } from '../entities';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly authRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegistrationDTO): Promise<ISanitizedUser> {
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

    // this.login({
    //   userId: registeredUser.id,
    //   username: registeredUser.username,
    // });
    return registeredUser;
  }

  async checkLogin({ username, password }: LoginDTO) {
    await this.validateUser({ username, password });
  }

  async findOne(id: string): Promise<IUser> {
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
    if (user) {
      const isEqualPassword = await bcrypt.compare(user.password, password);
      if (isEqualPassword) {
        const { password, ...validatedUser } = user;
        return validatedUser;
      }
    }
    return undefined;
  }

  async login(user: any) {
    console.log(user);
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
