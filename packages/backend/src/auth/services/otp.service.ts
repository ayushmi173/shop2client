import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma';
import { RedisService } from '../../redis';
import { ErrorCodes } from '../../common';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpExpiry: number;
  private readonly maxAttempts: number;
  private readonly provider: string;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private config: ConfigService,
  ) {
    this.otpExpiry = this.config.get('OTP_EXPIRY_MINUTES', 5);
    this.maxAttempts = this.config.get('OTP_MAX_ATTEMPTS', 3);
    this.provider = this.config.get('OTP_PROVIDER', 'mock');
  }

  /**
   * Generate a 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone number
   */
  async sendOtp(phone: string): Promise<{ expiresIn: number; otp?: string }> {
    // Check rate limit
    const rateLimitKey = `otp:ratelimit:${phone}`;
    const { allowed, resetIn } = await this.redis.checkRateLimit(
      rateLimitKey,
      3, // Max 3 OTP requests per minute
      60,
    );

    if (!allowed) {
      throw new BadRequestException({
        code: ErrorCodes.RATE_LIMITED,
        message: `Too many OTP requests. Try again in ${resetIn} seconds`,
      });
    }

    // Generate OTP
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpExpiry * 60 * 1000);

    // Store OTP in database
    await this.prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    // Send OTP via provider
    await this.sendViaProvider(phone, otp);

    const response: { expiresIn: number; otp?: string } = {
      expiresIn: this.otpExpiry * 60,
    };

    // Return OTP in development mode for testing
    if (this.config.get('NODE_ENV') === 'development' || this.provider === 'mock') {
      response.otp = otp;
      this.logger.debug(`OTP for ${phone}: ${otp}`);
    }

    return response;
  }

  /**
   * Verify OTP
   */
  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    // Find the latest OTP for this phone
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        phone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException({
        code: ErrorCodes.OTP_EXPIRED,
        message: 'OTP expired or not found. Please request a new OTP.',
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= this.maxAttempts) {
      throw new BadRequestException({
        code: ErrorCodes.OTP_MAX_ATTEMPTS,
        message: 'Maximum attempts exceeded. Please request a new OTP.',
      });
    }

    // Increment attempts
    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    // Verify OTP
    if (otpRecord.otp !== otp) {
      const remainingAttempts = this.maxAttempts - otpRecord.attempts - 1;
      throw new BadRequestException({
        code: ErrorCodes.OTP_INVALID,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      });
    }

    // Mark as verified
    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Cleanup old OTPs for this phone
    await this.prisma.otpVerification.deleteMany({
      where: {
        phone,
        id: { not: otpRecord.id },
      },
    });

    return true;
  }

  /**
   * Send OTP via configured provider
   */
  private async sendViaProvider(phone: string, otp: string): Promise<void> {
    switch (this.provider) {
      case 'twilio':
        await this.sendViaTwilio(phone, otp);
        break;
      case 'msg91':
        await this.sendViaMsg91(phone, otp);
        break;
      case 'mock':
      default:
        this.logger.log(`[MOCK] OTP ${otp} sent to ${phone}`);
        break;
    }
  }

  private async sendViaTwilio(phone: string, otp: string): Promise<void> {
    // Twilio integration placeholder
    // const twilio = require('twilio');
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your LocalConnect OTP is: ${otp}`,
    //   from: this.config.get('TWILIO_PHONE_NUMBER'),
    //   to: phone,
    // });
    this.logger.log(`[TWILIO] Would send OTP ${otp} to ${phone}`);
  }

  private async sendViaMsg91(phone: string, otp: string): Promise<void> {
    // MSG91 integration placeholder
    this.logger.log(`[MSG91] Would send OTP ${otp} to ${phone}`);
  }
}
