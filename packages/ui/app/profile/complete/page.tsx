'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      city: '',
      state: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/v1/auth/register/complete', data);
      if (response.success) {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.error?.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  {...form.register('firstName')}
                  placeholder="John"
                  className="mt-1"
                  disabled={isLoading}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  {...form.register('lastName')}
                  placeholder="Doe"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                {...form.register('email')}
                type="email"
                placeholder="john@example.com"
                className="mt-1"
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Your Location</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    {...form.register('city')}
                    placeholder="City *"
                    disabled={isLoading}
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...form.register('state')}
                    placeholder="State *"
                    disabled={isLoading}
                  />
                  {form.formState.errors.state && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
