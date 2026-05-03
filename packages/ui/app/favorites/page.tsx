'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Star, Phone, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface FavoriteWorker {
  id: string;
  note?: string;
  worker: {
    id: string;
    userId: string;
    user: {
      firstName: string;
      lastName?: string;
      avatarUrl?: string;
      phone: string;
    };
    professions: Array<{
      id: string;
      name: string;
      isPrimary: boolean;
    }>;
    averageRating: number;
    totalReviews: number;
    verificationStatus: string;
    location?: {
      city: string;
      state: string;
    };
  };
  createdAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth?return=/favorites');
      return;
    }

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get<{ items: FavoriteWorker[] }>('/api/v1/favorites');
      if (response.success && response.data) {
        setFavorites(response.data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (workerId: string) => {
    setRemovingId(workerId);
    try {
      await api.delete(`/api/v1/favorites/${workerId}`);
      setFavorites((prev) => prev.filter((f) => f.worker.id !== workerId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setRemovingId(null);
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

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} saved worker{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Save workers you like for quick access later
            </p>
            <Button onClick={() => router.push('/workers')}>Find Workers</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => {
            const worker = fav.worker;
            const primaryProfession = worker.professions.find((p) => p.isPrimary);
            const fullName = `${worker.user.firstName} ${worker.user.lastName || ''}`.trim();

            return (
              <Card key={fav.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary">
                      {worker.user.firstName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{fullName}</h3>
                      {primaryProfession && (
                        <p className="text-sm text-muted-foreground">
                          {primaryProfession.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {worker.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({worker.totalReviews})
                        </span>
                        {worker.verificationStatus === 'VERIFIED' && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      {worker.location && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {worker.location.city}, {worker.location.state}
                        </div>
                      )}
                    </div>
                  </div>

                  {fav.note && (
                    <p className="mt-3 text-sm text-muted-foreground bg-muted p-2 rounded">
                      {fav.note}
                    </p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/worker/${worker.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`tel:${worker.user.phone}`}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(worker.id)}
                      disabled={removingId === worker.id}
                    >
                      {removingId === worker.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
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
