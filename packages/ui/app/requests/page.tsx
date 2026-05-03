'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Clock, CheckCircle, XCircle, Loader2, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface ServiceRequest {
  id: string;
  status: string;
  description: string;
  scheduledDate?: string;
  scheduledTime?: string;
  address: string;
  createdAt: string;
  worker: {
    id: string;
    user: {
      firstName: string;
      lastName?: string;
      phone: string;
    };
    professions: Array<{ name: string; isPrimary: boolean }>;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Loader2 },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth?return=/requests');
      return;
    }

    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchRequests = async () => {
    try {
      const response = await api.get<{ items: ServiceRequest[] }>('/api/v1/service-requests/user');
      if (response.success && response.data) {
        setRequests(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.post(`/api/v1/service-requests/${id}/cancel`, {
        reason: 'Cancelled by user',
      });
      fetchRequests();
    } catch (error) {
      console.error('Failed to cancel request:', error);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status);
    if (filter === 'completed') return r.status === 'COMPLETED';
    return true;
  });

  if (authLoading || isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">
              {requests.length} service request{requests.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'completed'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Find workers and request their services
            </p>
            <Button onClick={() => router.push('/workers')}>Find Workers</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const status = statusConfig[request.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            const workerName = `${request.worker.user.firstName} ${request.worker.user.lastName || ''}`.trim();
            const profession = request.worker.professions.find((p) => p.isPrimary)?.name;

            return (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-semibold">{workerName}</h3>
                      {profession && (
                        <p className="text-sm text-muted-foreground">{profession}</p>
                      )}

                      <p className="text-sm mt-2">{request.description}</p>

                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {request.address}
                      </div>

                      {request.scheduledDate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}
                          {request.scheduledTime && ` at ${request.scheduledTime}`}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {request.status === 'ACCEPTED' && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${request.worker.user.phone}`}>
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </a>
                        </Button>
                      )}
                      {['PENDING', 'ACCEPTED'].includes(request.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {request.status === 'COMPLETED' && (
                        <Button
                          size="sm"
                          onClick={() => router.push(`/worker/${request.worker.id}?review=true`)}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
