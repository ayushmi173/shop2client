'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, ArrowRight, Loader2, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Enter valid phone with country code (e.g., +919876543210)'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

const features = [
  { icon: Shield, text: 'Secure OTP verification' },
  { icon: CheckCircle, text: 'No password required' },
  { icon: Phone, text: 'Login with phone number' },
];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '+91' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handleSendOtp = async (data: PhoneFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<{ expiresIn: number; otp?: string }>(
        '/api/v1/auth/otp/send',
        { phone: data.phone },
      );

      if (response.success) {
        setPhone(data.phone);
        setStep('otp');
        // In dev mode, OTP is returned
        if (response.data?.otp) {
          setDevOtp(response.data.otp);
        }
      }
    } catch (err: any) {
      setError(err.error?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post<any>('/api/v1/auth/otp/verify', {
        phone,
        otp: data.otp,
      });

      if (response.success && response.data) {
        setAuth(response.data.user, response.data.tokens);
        
        // Redirect based on user role or if new user
        if (response.data.isNewUser) {
          router.push('/profile/complete');
        } else {
          const returnUrl = searchParams.get('return') || '/';
          router.push(returnUrl);
        }
      }
    } catch (err: any) {
      setError(err.error?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Logo variant="white" size="lg" className="mb-8" />
          
          <h1 className="text-4xl font-bold mb-4">
            Welcome to LocalConnect
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Connect with trusted local service professionals in your neighborhood.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['A', 'B', 'C', 'D'].map((letter, i) => (
                <div
                  key={letter}
                  className="w-10 h-10 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center font-semibold"
                  style={{ zIndex: 4 - i }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold">10,000+ Users</p>
              <p className="text-sm text-white/70">Trust LocalConnect</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Logo size="lg" className="justify-center" />
          </div>

          <Card variant="elevated" className="shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl">
                {step === 'phone' ? 'Sign in to LocalConnect' : 'Verify Your Phone'}
              </CardTitle>
              <CardDescription className="text-base">
                {step === 'phone'
                  ? 'Enter your phone number to continue'
                  : `Enter the 6-digit code sent to ${phone}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {step === 'phone' ? (
                <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Phone Number
                    </label>
                    <Input
                      {...phoneForm.register('phone')}
                      placeholder="+919876543210"
                      className="h-12 text-lg"
                      disabled={isLoading}
                      leftIcon={<Phone className="w-5 h-5" />}
                    />
                    {phoneForm.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1.5">
                        {phoneForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Get OTP
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              ) : (
                <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Verification Code
                    </label>
                    <Input
                      {...otpForm.register('otp')}
                      placeholder="000000"
                      className="h-14 text-2xl text-center tracking-[0.5em] font-mono"
                      maxLength={6}
                      disabled={isLoading}
                    />
                    {otpForm.formState.errors.otp && (
                      <p className="text-sm text-destructive mt-1.5 text-center">
                        {otpForm.formState.errors.otp.message}
                      </p>
                    )}
                  </div>

                  {devOtp && (
                    <div className="bg-primary/5 p-4 rounded-xl text-center">
                      <Badge variant="info" className="mb-2">Dev Mode</Badge>
                      <p className="text-sm text-muted-foreground">
                        Your OTP is: <span className="font-mono font-bold text-primary text-lg">{devOtp}</span>
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep('phone');
                      setError('');
                      setDevOtp('');
                    }}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Phone Number
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => phoneForm.handleSubmit(handleSendOtp)()}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Bottom Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            New to LocalConnect?{' '}
            <span className="text-foreground font-medium">
              Sign up automatically when you verify your phone
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
