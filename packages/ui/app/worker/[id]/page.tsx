'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Star,
  MapPin,
  BadgeCheck,
  Clock,
  Phone,
  Heart,
  Share2,
  Calendar,
  Briefcase,
  DollarSign,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { cn, formatRating, formatPrice, getInitials } from '@/lib/utils';
import type { WorkerDetail } from '@/types';

const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const dayLabels: Record<string, string> = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
};

export default function WorkerDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['worker', id],
    queryFn: async () => {
      const response = await api.get<WorkerDetail>(`/api/v1/workers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Failed to load worker profile.</p>
            <Link href="/workers">
              <Button>Back to Workers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const worker = data;
  const primaryProfession = worker.professions.find((p) => p.isPrimary) || worker.professions[0];

  return (
    <div className="container py-8">
      {/* Back Link */}
      <Link
        href="/workers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Workers
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {worker.user.avatarUrl ? (
                    <img
                      src={worker.user.avatarUrl}
                      alt={worker.user.firstName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
                      {getInitials(worker.user.firstName, worker.user.lastName)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold flex items-center gap-2">
                        {worker.user.firstName} {worker.user.lastName}
                        {worker.verificationStatus === 'VERIFIED' && (
                          <BadgeCheck className="w-6 h-6 text-blue-500" />
                        )}
                      </h1>
                      <p className="text-lg text-muted-foreground">
                        {primaryProfession?.name}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">
                        {formatRating(worker.averageRating)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({worker.totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {worker.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {worker.isAvailable && (
                      <Badge variant="success">
                        <Clock className="w-3 h-3 mr-1" />
                        Available Now
                      </Badge>
                    )}
                    {worker.emergencyAvailable && (
                      <Badge variant="destructive">Emergency Ready</Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{worker.completedJobs}</div>
                      <div className="text-xs text-muted-foreground">Jobs Completed</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{worker.experience || 0}+</div>
                      <div className="text-xs text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{formatRating(worker.trustScore)}</div>
                      <div className="text-xs text-muted-foreground">Trust Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          {worker.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{worker.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {worker.professions.map((p) => (
                  <Badge
                    key={p.id}
                    variant={p.isPrimary ? 'default' : 'outline'}
                    className="text-sm py-1.5 px-3"
                  >
                    {p.name}
                    {p.isPrimary && ' (Primary)'}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              {worker.availabilitySlots.length > 0 ? (
                <div className="grid grid-cols-7 gap-2">
                  {dayOrder.map((day) => {
                    const slot = worker.availabilitySlots.find(
                      (s) => s.dayOfWeek === day && s.isActive,
                    );
                    return (
                      <div
                        key={day}
                        className={cn(
                          'text-center p-3 rounded-lg',
                          slot ? 'bg-green-50 border border-green-200' : 'bg-muted',
                        )}
                      >
                        <div className="font-medium text-sm">{dayLabels[day]}</div>
                        {slot ? (
                          <div className="text-xs text-green-700 mt-1">
                            {slot.startTime}-{slot.endTime}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground mt-1">Off</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No availability information</p>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {worker.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {worker.recentReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.authorName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted',
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact Card */}
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Price */}
                {worker.hourlyRate && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(worker.hourlyRate)}
                    </div>
                    <div className="text-sm text-muted-foreground">per hour</div>
                    {worker.minimumCharge && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Min. charge: {formatPrice(worker.minimumCharge)}
                      </div>
                    )}
                  </div>
                )}

                {/* Location */}
                {worker.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {worker.location.city}, {worker.location.state}
                    </span>
                  </div>
                )}

                {/* Service Radius */}
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>Services within {worker.serviceRadius} km</span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Now
                  </Button>
                  <Link href={`/requests/new?worker=${worker.userId}`}>
                    <Button variant="outline" className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Service
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="flex-1">
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="flex-1">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
