import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import {
  SendOtpSchema,
  VerifyOtpSchema,
  RegisterSchema,
  RegisterWorkerSchema,
  RefreshTokenSchema,
  SendOtpDto,
  VerifyOtpDto,
  RegisterDto,
  RegisterWorkerDto,
  RefreshTokenDto,
} from './dto';
import { ZodValidate } from '../common/pipes';
import { Public, CurrentUser } from '../common/decorators';
import { JwtAuthGuard } from '../common/guards';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async sendOtp(
    @Body(ZodValidate(SendOtpSchema)) dto: SendOtpDto,
  ) {
    const result = await this.authService.requestOtp(dto.phone);
    return {
      success: true,
      message: 'OTP sent successfully',
      data: result,
    };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(
    @Body(ZodValidate(VerifyOtpSchema)) dto: VerifyOtpDto,
  ) {
    const result = await this.authService.verifyOtpAndLogin(dto);
    return {
      success: true,
      message: result.isNewUser ? 'Registration successful' : 'Login successful',
      data: result,
    };
  }

  @Post('register/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete user registration' })
  @ApiResponse({ status: 200, description: 'Registration completed' })
  async completeRegistration(
    @CurrentUser() user: User,
    @Body(ZodValidate(RegisterSchema)) dto: RegisterDto,
  ) {
    const result = await this.authService.completeRegistration(user.id, dto);
    return {
      success: true,
      message: 'Registration completed',
      data: result,
    };
  }

  @Post('register/worker')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a worker' })
  @ApiResponse({ status: 200, description: 'Worker registration completed' })
  async registerWorker(
    @CurrentUser() user: User,
    @Body(ZodValidate(RegisterWorkerSchema)) dto: RegisterWorkerDto,
  ) {
    const result = await this.authService.registerWorker(user.id, dto);
    return {
      success: true,
      message: 'Worker registration completed',
      data: result,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Body(ZodValidate(RefreshTokenSchema)) dto: RefreshTokenDto,
  ) {
    const tokens = await this.authService.refreshTokens(dto.refreshToken);
    return {
      success: true,
      message: 'Tokens refreshed',
      data: tokens,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @CurrentUser() user: User,
    @Body() body: { refreshToken?: string },
  ) {
    await this.authService.logout(user.id, body.refreshToken);
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  async getMe(@CurrentUser() user: User) {
    const fullUser = await this.authService.getUserById(user.id);
    return {
      success: true,
      data: fullUser,
    };
  }
}
