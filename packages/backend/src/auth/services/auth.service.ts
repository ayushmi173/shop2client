import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma';
import { RedisService } from '../../redis';
import { OtpService } from './otp.service';
import { 
  RegisterDto, 
  RegisterWorkerDto, 
  AuthResponse, 
  AuthTokens,
  VerifyOtpDto,
} from '../dto';
import { User, UserRole, VerificationStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from '../../common';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwt: JwtService,
    private config: ConfigService,
    private otpService: OtpService,
  ) {
    this.accessTokenExpiry = this.config.get('JWT_ACCESS_TOKEN_EXPIRY', '15m');
    this.refreshTokenExpiry = this.config.get('JWT_REFRESH_TOKEN_EXPIRY', '7d');
  }

  /**
   * Request OTP for login/registration
   */
  async requestOtp(phone: string) {
    return this.otpService.sendOtp(phone);
  }

  /**
   * Verify OTP and login/register user
   */
  async verifyOtpAndLogin(dto: VerifyOtpDto): Promise<AuthResponse> {
    // Verify OTP
    await this.otpService.verifyOtp(dto.phone, dto.otp);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    const isNewUser = !user;

    if (!user) {
      // Create new user with temporary data
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          phoneVerified: true,
          firstName: 'User',
          role: UserRole.USER,
        },
      });
    } else {
      // Update existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          phoneVerified: true,
          lastLoginAt: new Date(),
        },
      });

      // Check if user is blocked
      if (user.isBlocked) {
        throw new UnauthorizedException({
          code: ErrorCodes.USER_BLOCKED,
          message: user.blockedReason || 'Your account has been blocked',
        });
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
      isNewUser,
    };
  }

  /**
   * Complete user registration
   */
  async completeRegistration(userId: string, dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
      isNewUser: false,
    };
  }

  /**
   * Register as worker
   */
  async registerWorker(userId: string, dto: RegisterWorkerDto): Promise<AuthResponse> {
    // Update user to WORKER role
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        role: UserRole.WORKER,
      },
    });

    // Create location
    await this.prisma.location.upsert({
      where: { userId: user.id },
      update: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        city: dto.city,
        state: dto.state,
      },
      create: {
        userId: user.id,
        latitude: dto.latitude,
        longitude: dto.longitude,
        city: dto.city,
        state: dto.state,
      },
    });

    // Create worker profile
    const workerProfile = await this.prisma.workerProfile.create({
      data: {
        userId: user.id,
        bio: dto.bio,
        experience: dto.experience,
        serviceRadius: dto.serviceRadius,
        hourlyRate: dto.hourlyRate,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    // Link professions
    await this.prisma.workerProfession.createMany({
      data: dto.professionIds.map((professionId, index) => ({
        workerId: workerProfile.id,
        professionId,
        isPrimary: index === 0,
      })),
    });

    // Add worker to geo index in Redis
    await this.redis.geoAdd(
      'workers:geo',
      dto.longitude,
      dto.latitude,
      user.id,
    );

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
      isNewUser: false,
    };
  }

  /**
   * Refresh access token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Find refresh token in database
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    return this.generateTokens(tokenRecord.user);
  }

  /**
   * Logout user
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific token
      await this.prisma.refreshToken.updateMany({
        where: { userId, token: refreshToken },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke all tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Invalidate user cache
    await this.redis.del(`user:${userId}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    // Try cache first
    const cached = await this.redis.getJson<User>(`user:${userId}`);
    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        location: true,
        workerProfile: {
          include: {
            professions: {
              include: { profession: true },
            },
          },
        },
      },
    });

    if (user) {
      // Cache for 5 minutes
      await this.redis.setJson(`user:${userId}`, user, 300);
    }

    return user;
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(payload: { sub: string; phone: string }): Promise<User | null> {
    return this.getUserById(payload.sub);
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.accessTokenExpiry,
    });

    const refreshToken = uuidv4();
    const refreshExpiresAt = this.parseExpiry(this.refreshTokenExpiry);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpiryInSeconds(this.accessTokenExpiry),
    };
  }

  /**
   * Parse expiry string to Date
   */
  private parseExpiry(expiry: string): Date {
    const now = new Date();
    const match = expiry.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
    }

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
      case 's': return new Date(now.getTime() + num * 1000);
      case 'm': return new Date(now.getTime() + num * 60 * 1000);
      case 'h': return new Date(now.getTime() + num * 60 * 60 * 1000);
      case 'd': return new Date(now.getTime() + num * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Get expiry in seconds
   */
  private getExpiryInSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    
    if (!match) return 900; // Default 15 minutes

    const [, value, unit] = match;
    const num = parseInt(value, 10);

    switch (unit) {
      case 's': return num;
      case 'm': return num * 60;
      case 'h': return num * 60 * 60;
      case 'd': return num * 24 * 60 * 60;
      default: return 900;
    }
  }

  /**
   * Sanitize user for response
   */
  private sanitizeUser(user: User) {
    return {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName || undefined,
      email: user.email || undefined,
      role: user.role,
      avatarUrl: user.avatarUrl || undefined,
    };
  }
}
