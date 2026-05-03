import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { z } from 'zod';
import { createPaginatedResponse } from '../common';

// ============================================
// DTOs
// ============================================

export const AddFavoriteSchema = z.object({
  workerId: z.string().uuid(),
  note: z.string().max(200).optional(),
});

export const UpdateFavoriteSchema = z.object({
  note: z.string().max(200).optional(),
});

export type AddFavoriteDto = z.infer<typeof AddFavoriteSchema>;
export type UpdateFavoriteDto = z.infer<typeof UpdateFavoriteSchema>;

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add worker to favorites
   */
  async addFavorite(userId: string, dto: AddFavoriteDto) {
    // Verify worker exists
    const worker = await this.prisma.user.findFirst({
      where: {
        id: dto.workerId,
        role: 'WORKER',
        isActive: true,
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_workerId: {
          userId,
          workerId: dto.workerId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Worker is already in your favorites');
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        workerId: dto.workerId,
        note: dto.note,
      },
      include: {
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            workerProfile: {
              select: {
                averageRating: true,
                totalReviews: true,
                verificationStatus: true,
                professions: {
                  include: {
                    profession: {
                      select: { name: true, slug: true },
                    },
                  },
                  take: 3,
                },
              },
            },
          },
        },
      },
    });

    return this.mapFavorite(favorite);
  }

  /**
   * Remove worker from favorites
   */
  async removeFavorite(userId: string, workerId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_workerId: { userId, workerId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return { success: true };
  }

  /**
   * Update favorite note
   */
  async updateFavorite(userId: string, workerId: string, dto: UpdateFavoriteDto) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_workerId: { userId, workerId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    const updated = await this.prisma.favorite.update({
      where: { id: favorite.id },
      data: { note: dto.note },
    });

    return updated;
  }

  /**
   * Get user's favorites
   */
  async getFavorites(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          worker: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              phone: true,
              location: {
                select: { city: true, state: true },
              },
              workerProfile: {
                select: {
                  averageRating: true,
                  totalReviews: true,
                  verificationStatus: true,
                  isAvailable: true,
                  professions: {
                    include: {
                      profession: {
                        select: { name: true, slug: true },
                      },
                    },
                    take: 3,
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return createPaginatedResponse(
      favorites.map(this.mapFavorite),
      page,
      limit,
      total,
    );
  }

  /**
   * Check if worker is favorited
   */
  async isFavorite(userId: string, workerId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_workerId: { userId, workerId },
      },
    });

    return !!favorite;
  }

  /**
   * Sync favorites (for offline-first)
   */
  async syncFavorites(userId: string, workerIds: string[]) {
    // Get current favorites
    const currentFavorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { workerId: true },
    });

    const currentIds = currentFavorites.map((f) => f.workerId);

    // Find new favorites to add
    const toAdd = workerIds.filter((id) => !currentIds.includes(id));

    // Add new favorites
    if (toAdd.length > 0) {
      await this.prisma.favorite.createMany({
        data: toAdd.map((workerId) => ({ userId, workerId })),
        skipDuplicates: true,
      });
    }

    // Return updated favorites
    return this.getFavorites(userId, 1, 100);
  }

  private mapFavorite(favorite: any) {
    const worker = favorite.worker;
    const profile = worker.workerProfile;

    return {
      id: favorite.id,
      note: favorite.note,
      createdAt: favorite.createdAt,
      worker: {
        id: worker.id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        avatarUrl: worker.avatarUrl,
        phone: worker.phone,
        location: worker.location,
        averageRating: profile?.averageRating || 0,
        totalReviews: profile?.totalReviews || 0,
        verificationStatus: profile?.verificationStatus || 'PENDING',
        isAvailable: profile?.isAvailable ?? true,
        professions: profile?.professions?.map((wp: any) => ({
          name: wp.profession.name,
          slug: wp.profession.slug,
        })) || [],
      },
    };
  }
}
