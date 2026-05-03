'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Calendar,
  Settings,
  Loader2,
  Phone,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface WorkerStats {
  pendingRequests: number;
  activeRequests: number;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  trustScore: number;
}

interface ServiceRequest {
  id: string;
  status: string;
  description: string;
  scheduledDate?: string;
  address: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName?: string;
    phone: string;
  };
}

interface WorkerProfile {
  id: string;
  bio: string;
  experience: number;
  serviceRadius: number;
  hourlyRate: number;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  verificationStatus: string;
  professions: Array<{ id: string; name: string; isPrimary: boolean }>;
}

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth?return=/worker/dashboard');
      return;
    }

    if (isAuthenticated && user?.role !== 'WORKER') {
      router.push('/worker/register');
      return;
    }

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading, user, router]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        api.get<WorkerProfile>('/api/v1/workers/me/profile'),
        api.get<{ items: ServiceRequest[] }>('/api/v1/service-requests/worker'),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        // Calculate stats from profile
        setStats({
          pendingRequests: 0,
          activeRequests: 0,
          completedJobs: (profileRes.data as any).completedJobs || 0,
          averageRating: (profileRes.data as any).averageRating || 0,
          totalReviews: (profileRes.data as any).totalReviews || 0,
          totalEarnings: 0,
          trustScore: (profileRes.data as any).trustScore || 0,
        });
      }

      if (requestsRes.success && requestsRes.data) {
        setRequests(requestsRes.data.items || []);
        // Update stats with request counts
        const pending = requestsRes.data.items?.filter((r) => r.status === 'PENDING').length || 0;
        const active = requestsRes.data.items?.filter((r) =>
          ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)
        ).length || 0;
        setStats((prev) =>
          prev ? { ...prev, pendingRequests: pending, activeRequests: active } : null
        );
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'accept' | 'reject' | 'start' | 'complete') => {
    setActionLoading(requestId);
    try {
      await api.post(`/api/v1/service-requests/${requestId}/${action}`, {});
      fetchDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    try {
      await api.put('/api/v1/workers/me/profile', {
        isAvailable: !profile.isAvailable,
      });
      setProfile((prev) => (prev ? { ...prev, isAvailable: !prev.isAvailable } : null));
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Worker profile not found</h3>
            <Button onClick={() => router.push('/worker/register')}>
              Register as Worker
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const activeRequests = requests.filter((r) => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status));

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Worker Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={profile.isAvailable ? 'default' : 'outline'}
            onClick={toggleAvailability}
          >
            {profile.isAvailable ? 'Available' : 'Unavailable'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/worker/dashboard/settings')}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{stats?.pendingRequests || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">{stats?.activeRequests || 0}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats?.completedJobs || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{stats?.averageRating.toFixed(1) || '0.0'}</p>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No pending requests
              </p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {request.user.firstName} {request.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {request.address}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(request.id, 'accept')}
                        disabled={actionLoading === request.id}
                      >
                        {actionLoading === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Accept'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request.id, 'reject')}
                        disabled={actionLoading === request.id}
                      >
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`tel:${request.user.phone}`}>
                          <Phone className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Active Jobs ({activeRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No active jobs
              </p>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {request.user.firstName} {request.user.lastName}
                          </p>
                          <Badge
                            variant={request.status === 'ACCEPTED' ? 'secondary' : 'default'}
                          >
                            {request.status === 'ACCEPTED' ? 'Accepted' : 'In Progress'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {request.address}
                    </div>
                    <div className="flex gap-2">
                      {request.status === 'ACCEPTED' && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(request.id, 'start')}
                          disabled={actionLoading === request.id}
                        >
                          Start Work
                        </Button>
                      )}
                      {request.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(request.id, 'complete')}
                          disabled={actionLoading === request.id}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${request.user.phone}`}>
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Professions</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.professions.map((p) => (
                  <Badge key={p.id} variant={p.isPrimary ? 'default' : 'secondary'}>
                    {p.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {profile.hourlyRate}/hr
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Radius</p>
              <p className="text-lg font-semibold">{profile.serviceRadius} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="text-lg font-semibold">{profile.experience} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
              <p className="text-lg font-semibold">{stats?.trustScore.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verification</p>
              <Badge
                variant={profile.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}
              >
                {profile.verificationStatus}
              </Badge>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" onClick={() => router.push('/worker/dashboard/settings')}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
