import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ISanitizedUser } from '@package/entities';
import {
  IUserLoginResponse,
  IUserRegistrationResponse,
  RegistrationDTO,
} from '../dtos/auth';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from '../guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registration(
    @Body() registrationDto: RegistrationDTO,
  ): Promise<IUserRegistrationResponse> {
    return await this.authService.register(registrationDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // create own decorator for request
  async login(@Request() request): Promise<IUserLoginResponse> {
    return await this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() request): Promise<ISanitizedUser> {
    return await this.authService.getMe(request.user.id);
  }
}
