'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Edit2, LogOut, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth?return=/profile');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/api/v1/users/me', formData);
      setIsEditing(false);
      // Refresh user data
      const response = await api.get<any>('/api/v1/auth/me');
      if (response.success && response.data) {
        // Update local state would require updating the auth store
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold text-primary">
                {user.firstName?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Phone className="w-4 h-4" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.role === 'WORKER' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  {user.isVerified && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.firstName || '-'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.lastName || '-'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1"
                />
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <p>{user.email || 'Not set'}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p>{user.phone}</p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Worker Profile Link */}
        {user.role === 'WORKER' && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Worker Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your services, availability, and requests
                  </p>
                </div>
                <Button onClick={() => router.push('/worker/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Become a Worker */}
        {user.role === 'USER' && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Become a Service Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Register as a worker and start earning
                  </p>
                </div>
                <Button onClick={() => router.push('/worker/register')}>
                  Register as Worker
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
