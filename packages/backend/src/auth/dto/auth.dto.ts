import { z } from 'zod';

// ============================================
// Phone Validation
// ============================================

const phoneRegex = /^\+[1-9]\d{6,14}$/;

export const PhoneSchema = z.string().regex(phoneRegex, {
  message: 'Phone number must be in international format (e.g., +919876543210)',
});

// ============================================
// OTP Schemas
// ============================================

export const SendOtpSchema = z.object({
  phone: PhoneSchema,
});

export const VerifyOtpSchema = z.object({
  phone: PhoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// ============================================
// Registration Schemas
// ============================================

export const RegisterSchema = z.object({
  phone: PhoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'WORKER']).default('USER'),
});

export const RegisterWorkerSchema = RegisterSchema.extend({
  role: z.literal('WORKER'),
  bio: z.string().max(500).optional(),
  professionIds: z.array(z.string().uuid()).min(1, 'At least one profession is required'),
  experience: z.number().int().min(0).max(50).optional(),
  serviceRadius: z.number().min(1).max(50).default(5),
  hourlyRate: z.number().min(0).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().min(2),
  state: z.string().min(2),
});

// ============================================
// Refresh Token Schema
// ============================================

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================
// Type Exports
// ============================================

export type SendOtpDto = z.infer<typeof SendOtpSchema>;
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type RegisterWorkerDto = z.infer<typeof RegisterWorkerSchema>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;

// ============================================
// Response Types
// ============================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    phone: string;
    firstName: string;
    lastName?: string;
    email?: string;
    role: string;
    avatarUrl?: string;
  };
  tokens: AuthTokens;
  isNewUser: boolean;
}

export interface OtpResponse {
  message: string;
  expiresIn: number;
  // Only in development mode
  otp?: string;
}
