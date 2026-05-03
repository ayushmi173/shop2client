'use client';

import Link from 'next/link';
import {
  Star,
  MapPin,
  BadgeCheck,
  Phone,
  Briefcase,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrustScoreBar } from './trust-score-bar';
import { AvailabilityBadge } from './availability-badge';
import { cn, formatDistance, formatRating, formatPrice, getInitials } from '@/lib/utils';
import type { WorkerListItem } from '@/types';

interface WorkerCardProps {
  worker: WorkerListItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onContact?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'list';
}

export function WorkerCard({
  worker,
  isSelected = false,
  onSelect,
  onContact,
  onFavorite,
  isFavorite,
  variant = 'default',
}: WorkerCardProps) {
  const primaryProfession =
    worker.professions.find((p) => p.isPrimary) || worker.professions[0];

  if (variant === 'compact') {
    return (
      <Card className="card-interactive group">
        <CardContent className="p-4">
          <Link href={`/worker/${worker.id}`}>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {worker.user.avatarUrl ? (
                  <img
                    src={worker.user.avatarUrl}
                    alt={worker.user.firstName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-200 flex items-center justify-center text-primary font-semibold shadow-sm">
                    {getInitials(worker.user.firstName, worker.user.lastName)}
                  </div>
                )}
                {worker.verificationStatus === 'VERIFIED' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {worker.user.firstName} {worker.user.lastName}
                </h3>
                <p className="text-muted-foreground text-xs truncate">
                  {primaryProfession?.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{formatRating(worker.averageRating)}</span>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // List variant: horizontal card for map + results layout
  if (variant === 'list') {
    return (
      <Card
        className={cn(
          'rounded-2xl border-2 shadow-md transition-all duration-200 overflow-hidden cursor-pointer',
          'hover:shadow-lg hover:scale-[1.02] hover:border-primary/30',
          isSelected && 'border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]',
        )}
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="flex gap-5">
            {/* Left: Avatar */}
            <div className="relative flex-shrink-0">
              {worker.user.avatarUrl ? (
                <img
                  src={worker.user.avatarUrl}
                  alt={worker.user.firstName}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {getInitials(worker.user.firstName, worker.user.lastName)}
                </div>
              )}
              {worker.verificationStatus === 'VERIFIED' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Right: Content */}
            <div className="flex-1 min-w-0">
              {/* Top: name, profession, rating, distance */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <Link href={`/worker/${worker.id}`} onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-slate-900 hover:text-primary transition-colors">
                      {worker.user.firstName} {worker.user.lastName}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {primaryProfession?.name}
                    {worker.experience != null && ` · ${worker.experience}+ yrs`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-sm font-semibold text-amber-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {formatRating(worker.averageRating)} ({worker.totalReviews})
                  </span>
                  {(worker.distance != null || worker.location) && (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {worker.distance != null
                        ? `${formatDistance(worker.distance)} away`
                        : worker.location
                          ? `${worker.location.city}, ${worker.location.state}`
                          : null}
                    </span>
                  )}
                </div>
              </div>

              {/* Middle: tags, stats, trust bar, response time */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <AvailabilityBadge available={worker.isAvailable} />
                {worker.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {worker.completedJobs} jobs done
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Usually responds in &lt; 1 hr
                </span>
              </div>
              <div className="mb-4 max-w-[200px]">
                <TrustScoreBar score={worker.trustScore} showLabel={false} />
              </div>

              {/* Bottom: price + actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {worker.hourlyRate != null ? formatPrice(worker.hourlyRate) : 'N/A'}
                  </span>
                  <span className="text-sm text-muted-foreground"> /hour</span>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={onContact}
                  >
                    <Phone className="w-4 h-4 mr-1.5" />
                    Contact
                  </Button>
                  <Link href={`/worker/${worker.id}`}>
                    <Button size="sm" variant="gradient" className="rounded-xl">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default (original) card layout
  return (
    <Card className="card-hover group overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-purple-100/50 p-4 pb-12">
          {onFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onFavorite();
              }}
              className={cn(
                'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
                isFavorite
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500 shadow-sm',
              )}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          )}
          <div className="relative w-20 h-20 mx-auto">
            {worker.user.avatarUrl ? (
              <img
                src={worker.user.avatarUrl}
                alt={worker.user.firstName}
                className="w-full h-full rounded-2xl object-cover ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform">
                {getInitials(worker.user.firstName, worker.user.lastName)}
              </div>
            )}
            {worker.verificationStatus === 'VERIFIED' && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center ring-3 ring-white shadow-sm">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="p-4 -mt-8 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm">{formatRating(worker.averageRating)}</span>
            <span className="text-xs text-muted-foreground">({worker.totalReviews})</span>
          </div>
          <div className="text-center mt-4 mb-3">
            <Link href={`/worker/${worker.id}`}>
              <h3 className="font-bold text-lg hover:text-primary transition-colors">
                {worker.user.firstName} {worker.user.lastName}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm">
              {primaryProfession?.name}
              {worker.experience != null && ` · ${worker.experience}+ yrs`}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            <AvailabilityBadge available={worker.isAvailable} />
            {worker.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-dashed mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{worker.completedJobs}</p>
              <p className="text-xs text-muted-foreground">Jobs Done</p>
            </div>
            <div className="text-center border-x border-dashed">
              <p className="text-lg font-bold text-primary">{worker.trustScore.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Trust Score</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">
                {worker.hourlyRate != null ? formatPrice(worker.hourlyRate) : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">/hour</p>
            </div>
          </div>
          {worker.location && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              {worker.location.city}, {worker.location.state}
              {worker.distance != null && (
                <span className="text-primary font-medium">({formatDistance(worker.distance)})</span>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={onContact}>
              <Phone className="w-4 h-4 mr-1.5" />
              Contact
            </Button>
            <Link href={`/worker/${worker.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
