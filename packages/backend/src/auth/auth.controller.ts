import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ISanitizedUser } from 'src/entities';
import { LoginDTO, RegistrationDTO } from '../dtos/auth';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwtAuth.guard';
// import { LocalAuthGuard } from './guard/localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registration(
    @Body() registrationDto: RegistrationDTO,
  ): Promise<ISanitizedUser> {
    return await this.authService.register(registrationDto);
  }

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDTO): Promise<any> {
    const x = await this.authService.login(loginDto);
    console.log(x);
    return x;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): ISanitizedUser {
    console.log(req);
    return req.user;
  }
}
