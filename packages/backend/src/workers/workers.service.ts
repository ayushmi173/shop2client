import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { RedisService } from '../redis';
import { Prisma, VerificationStatus, DayOfWeek } from '@prisma/client';
import {
  WorkerSearchDto,
  UpdateWorkerProfileDto,
  UpdateAvailabilityDto,
  AddProfessionDto,
  WorkerListItem,
  WorkerDetail,
} from './dto';
import { createPaginatedResponse, PaginatedResponse } from '../common';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);

  // Trust Score Weights
  private readonly RATING_WEIGHT = 0.6;
  private readonly JOBS_WEIGHT = 0.3;
  private readonly VERIFICATION_WEIGHT = 0.1;
  private readonly MAX_JOBS_FOR_NORMALIZATION = 100;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ============================================
  // WORKER DISCOVERY
  // ============================================

  /**
   * Search workers with geo-based filtering
   */
  async searchWorkers(dto: WorkerSearchDto): Promise<PaginatedResponse<WorkerListItem>> {
    const { page, limit, sortBy, sortOrder, radiusKm } = dto;
    const skip = (page - 1) * limit;

    // Build cache key
    const cacheKey = `workers:search:${JSON.stringify(dto)}`;
    
    // Try cache for popular searches
    if (dto.city && !dto.latitude) {
      const cached = await this.redis.getJson<PaginatedResponse<WorkerListItem>>(cacheKey);
      if (cached) {
        this.logger.debug('Cache hit for worker search');
        return cached;
      }
    }

    // Build where clause
    const where: Prisma.WorkerProfileWhereInput = {
      deletedAt: null,
      user: {
        isActive: true,
        isBlocked: false,
        deletedAt: null,
      },
    };

    // Filter by verification status
    if (dto.isVerified !== undefined) {
      where.verificationStatus = dto.isVerified 
        ? VerificationStatus.VERIFIED 
        : { not: VerificationStatus.VERIFIED };
    }

    // Filter by availability
    if (dto.isAvailable !== undefined) {
      where.isAvailable = dto.isAvailable;
    }

    if (dto.emergencyAvailable !== undefined) {
      where.emergencyAvailable = dto.emergencyAvailable;
    }

    // Filter by rating
    if (dto.minRating !== undefined) {
      where.averageRating = { gte: dto.minRating };
    }

    // Filter by experience
    if (dto.minExperience !== undefined) {
      where.experience = { gte: dto.minExperience };
    }

    // Filter by hourly rate
    if (dto.maxHourlyRate !== undefined) {
      where.hourlyRate = { lte: dto.maxHourlyRate };
    }

    // Filter by profession
    if (dto.professionId || dto.professionSlug) {
      where.professions = {
        some: dto.professionId 
          ? { professionId: dto.professionId }
          : { profession: { slug: dto.professionSlug } },
      };
    }

    // Filter by city (if no geo-coordinates provided)
    if (dto.city && !dto.latitude) {
      where.user = {
        ...where.user as object,
        location: { city: { contains: dto.city, mode: 'insensitive' } },
      };
    }

    // Get worker IDs within radius if geo-coordinates provided
    let nearbyWorkerIds: string[] | null = null;
    if (dto.latitude && dto.longitude) {
      nearbyWorkerIds = await this.redis.geoRadius(
        'workers:geo',
        dto.longitude,
        dto.latitude,
        radiusKm,
        500, // Max 500 workers
      );

      if (nearbyWorkerIds.length === 0) {
        // Fallback to city-based search if no geo results
        return createPaginatedResponse([], page, limit, 0);
      }

      where.userId = { in: nearbyWorkerIds };
    }

    // Build order by
    let orderBy: Prisma.WorkerProfileOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { averageRating: sortOrder };
        break;
      case 'trustScore':
        orderBy = { trustScore: sortOrder };
        break;
      case 'price':
        orderBy = { hourlyRate: sortOrder };
        break;
      case 'experience':
        orderBy = { experience: sortOrder };
        break;
      case 'distance':
        // Distance sorting handled in-memory for geo queries
        orderBy = { trustScore: 'desc' };
        break;
      default:
        orderBy = { trustScore: 'desc' };
    }

    // Get total count
    const totalItems = await this.prisma.workerProfile.count({ where });

    // Get workers
    const workers = await this.prisma.workerProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
            location: {
              select: {
                latitude: true,
                longitude: true,
                city: true,
                state: true,
              },
            },
          },
        },
        professions: {
          include: {
            profession: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        workerTags: {
          select: { tag: true },
        },
      },
    });

    // Calculate distances if geo-coordinates provided
    const workersWithDistance = workers.map((worker) => {
      let distance: number | undefined;
      
      if (dto.latitude && dto.longitude && worker.user.location) {
        distance = this.calculateDistance(
          dto.latitude,
          dto.longitude,
          worker.user.location.latitude,
          worker.user.location.longitude,
        );
      }

      return this.mapToWorkerListItem(worker, distance);
    });

    // Sort by distance if requested
    if (sortBy === 'distance' && dto.latitude) {
      workersWithDistance.sort((a, b) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return sortOrder === 'asc' ? distA - distB : distB - distA;
      });
    }

    const result = createPaginatedResponse(workersWithDistance, page, limit, totalItems);

    // Cache popular city searches for 5 minutes
    if (dto.city && !dto.latitude && totalItems > 0) {
      await this.redis.setJson(cacheKey, result, 300);
    }

    return result;
  }

  /**
   * Get worker by ID
   */
  async getWorkerById(workerId: string): Promise<WorkerDetail> {
    // Try cache first
    const cacheKey = `worker:detail:${workerId}`;
    const cached = await this.redis.getJson<WorkerDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    const worker = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
            location: {
              select: {
                city: true,
                state: true,
                latitude: true,
                longitude: true,
              },
            },
          },
        },
        professions: {
          include: {
            profession: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        availabilitySlots: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' },
        },
        workerTags: {
          select: { tag: true },
        },
      },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Get recent reviews
    const recentReviews = await this.prisma.review.findMany({
      where: {
        targetId: worker.userId,
        status: 'APPROVED',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const result = this.mapToWorkerDetail(worker, recentReviews);

    // Cache for 10 minutes
    await this.redis.setJson(cacheKey, result, 600);

    return result;
  }

  /**
   * Get worker by user ID
   */
  async getWorkerByUserId(userId: string): Promise<WorkerDetail> {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    return this.getWorkerById(worker.id);
  }

  // ============================================
  // WORKER PROFILE MANAGEMENT
  // ============================================

  /**
   * Update worker profile
   */
  async updateProfile(userId: string, dto: UpdateWorkerProfileDto) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const updated = await this.prisma.workerProfile.update({
      where: { id: worker.id },
      data: {
        ...dto,
        profileComplete: this.isProfileComplete({ ...worker, ...dto }),
      },
    });

    // Invalidate cache
    await this.invalidateWorkerCache(worker.id, userId);

    return updated;
  }

  /**
   * Update availability slots
   */
  async updateAvailability(userId: string, dto: UpdateAvailabilityDto) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    // Delete existing slots
    await this.prisma.availabilitySlot.deleteMany({
      where: { workerId: worker.id },
    });

    // Create new slots
    await this.prisma.availabilitySlot.createMany({
      data: dto.slots.map((slot) => ({
        workerId: worker.id,
        dayOfWeek: slot.dayOfWeek as DayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      })),
    });

    // Invalidate cache
    await this.invalidateWorkerCache(worker.id, userId);

    return { success: true, slotsCount: dto.slots.length };
  }

  /**
   * Add profession to worker
   */
  async addProfession(userId: string, dto: AddProfessionDto) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    // Check if profession exists
    const profession = await this.prisma.profession.findUnique({
      where: { id: dto.professionId },
    });

    if (!profession) {
      throw new BadRequestException('Profession not found');
    }

    // Check if already linked
    const existing = await this.prisma.workerProfession.findUnique({
      where: {
        workerId_professionId: {
          workerId: worker.id,
          professionId: dto.professionId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Profession already added');
    }

    // If setting as primary, unset other primaries
    if (dto.isPrimary) {
      await this.prisma.workerProfession.updateMany({
        where: { workerId: worker.id },
        data: { isPrimary: false },
      });
    }

    const result = await this.prisma.workerProfession.create({
      data: {
        workerId: worker.id,
        professionId: dto.professionId,
        isPrimary: dto.isPrimary,
        yearsExperience: dto.yearsExperience,
      },
      include: {
        profession: true,
      },
    });

    // Invalidate cache
    await this.invalidateWorkerCache(worker.id, userId);

    return result;
  }

  /**
   * Remove profession from worker
   */
  async removeProfession(userId: string, professionId: string) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { userId },
      include: { professions: true },
    });

    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    if (worker.professions.length <= 1) {
      throw new BadRequestException('Cannot remove last profession');
    }

    await this.prisma.workerProfession.delete({
      where: {
        workerId_professionId: {
          workerId: worker.id,
          professionId,
        },
      },
    });

    // Invalidate cache
    await this.invalidateWorkerCache(worker.id, userId);

    return { success: true };
  }

  // ============================================
  // TRUST SCORE ALGORITHM
  // ============================================

  /**
   * Calculate trust score for a worker
   * Formula: (rating * 0.6) + (completed_jobs_normalized * 0.3) + (verification * 0.1)
   */
  calculateTrustScore(
    averageRating: number,
    completedJobs: number,
    isVerified: boolean,
  ): number {
    // Normalize rating (0-5 scale)
    const ratingScore = averageRating;

    // Normalize completed jobs (cap at MAX_JOBS_FOR_NORMALIZATION)
    const normalizedJobs = Math.min(completedJobs / this.MAX_JOBS_FOR_NORMALIZATION, 1) * 5;

    // Verification score (0 or 5)
    const verificationScore = isVerified ? 5 : 0;

    // Calculate weighted score
    const trustScore = 
      (ratingScore * this.RATING_WEIGHT) +
      (normalizedJobs * this.JOBS_WEIGHT) +
      (verificationScore * this.VERIFICATION_WEIGHT);

    return parseFloat(trustScore.toFixed(2));
  }

  /**
   * Update trust score for a worker
   */
  async updateTrustScore(workerId: string): Promise<number> {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    const trustScore = this.calculateTrustScore(
      worker.averageRating,
      worker.completedJobs,
      worker.verificationStatus === VerificationStatus.VERIFIED,
    );

    await this.prisma.workerProfile.update({
      where: { id: workerId },
      data: { trustScore },
    });

    // Invalidate cache
    await this.invalidateWorkerCache(workerId, worker.userId);

    return trustScore;
  }

  /**
   * Update worker stats after job completion
   */
  async updateWorkerStats(workerId: string, newRating?: number) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
    });

    if (!worker) return;

    const updateData: Prisma.WorkerProfileUpdateInput = {
      completedJobs: { increment: 1 },
      totalJobs: { increment: 1 },
    };

    if (newRating !== undefined) {
      // Calculate new average rating
      const newTotalReviews = worker.totalReviews + 1;
      const newAverageRating = 
        ((worker.averageRating * worker.totalReviews) + newRating) / newTotalReviews;

      updateData.averageRating = parseFloat(newAverageRating.toFixed(2));
      updateData.totalReviews = newTotalReviews;
    }

    await this.prisma.workerProfile.update({
      where: { id: workerId },
      data: updateData,
    });

    // Recalculate trust score
    await this.updateTrustScore(workerId);
  }

  // ============================================
  // AUTO-TAGGING
  // ============================================

  /**
   * Auto-generate tags for worker based on performance
   */
  async updateWorkerTags(workerId: string) {
    const worker = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
    });

    if (!worker) return;

    const tags: { tag: string; score: number }[] = [];

    // Top Rated (4.5+ rating with 10+ reviews)
    if (worker.averageRating >= 4.5 && worker.totalReviews >= 10) {
      tags.push({ tag: 'Top Rated', score: worker.averageRating });
    }

    // Experienced (5+ years or 50+ jobs)
    if ((worker.experience && worker.experience >= 5) || worker.completedJobs >= 50) {
      tags.push({ tag: 'Experienced', score: worker.completedJobs / 10 });
    }

    // Reliable (90%+ completion rate)
    const completionRate = worker.totalJobs > 0 
      ? worker.completedJobs / worker.totalJobs 
      : 0;
    if (completionRate >= 0.9 && worker.completedJobs >= 20) {
      tags.push({ tag: 'Reliable', score: completionRate * 5 });
    }

    // Emergency-ready
    if (worker.emergencyAvailable) {
      tags.push({ tag: 'Emergency-ready', score: 4 });
    }

    // Verified
    if (worker.verificationStatus === VerificationStatus.VERIFIED) {
      tags.push({ tag: 'Verified', score: 5 });
    }

    // Delete old auto tags
    await this.prisma.workerTag.deleteMany({
      where: { workerId, isAutomatic: true },
    });

    // Create new tags
    if (tags.length > 0) {
      await this.prisma.workerTag.createMany({
        data: tags.map((t) => ({
          workerId,
          tag: t.tag,
          score: t.score,
          isAutomatic: true,
        })),
      });
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private isProfileComplete(worker: any): boolean {
    return !!(
      worker.bio &&
      worker.experience !== null &&
      worker.hourlyRate !== null &&
      worker.serviceRadius
    );
  }

  private async invalidateWorkerCache(workerId: string, userId: string) {
    await Promise.all([
      this.redis.del(`worker:detail:${workerId}`),
      this.redis.del(`user:${userId}`),
      this.redis.invalidatePattern('workers:search:*'),
    ]);
  }

  private mapToWorkerListItem(worker: any, distance?: number): WorkerListItem {
    return {
      id: worker.id,
      userId: worker.userId,
      user: {
        firstName: worker.user.firstName,
        lastName: worker.user.lastName,
        avatarUrl: worker.user.avatarUrl,
        phone: worker.user.phone,
      },
      professions: worker.professions.map((wp: any) => ({
        id: wp.profession.id,
        name: wp.profession.name,
        slug: wp.profession.slug,
        isPrimary: wp.isPrimary,
      })),
      bio: worker.bio,
      experience: worker.experience,
      serviceRadius: worker.serviceRadius,
      hourlyRate: worker.hourlyRate ? parseFloat(worker.hourlyRate) : undefined,
      verificationStatus: worker.verificationStatus,
      averageRating: worker.averageRating,
      totalReviews: worker.totalReviews,
      completedJobs: worker.completedJobs,
      trustScore: worker.trustScore,
      isAvailable: worker.isAvailable,
      emergencyAvailable: worker.emergencyAvailable,
      distance,
      tags: worker.workerTags?.map((t: any) => t.tag) || [],
      location: worker.user.location ? {
        city: worker.user.location.city,
        state: worker.user.location.state,
        latitude: worker.user.location.latitude,
        longitude: worker.user.location.longitude,
      } : undefined,
    };
  }

  private mapToWorkerDetail(worker: any, recentReviews: any[]): WorkerDetail {
    return {
      ...this.mapToWorkerListItem(worker),
      minimumCharge: worker.minimumCharge ? parseFloat(worker.minimumCharge) : undefined,
      totalJobs: worker.totalJobs,
      verifiedAt: worker.verifiedAt,
      availabilitySlots: worker.availabilitySlots.map((slot: any) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      })),
      recentReviews: recentReviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        authorName: `${review.author.firstName} ${review.author.lastName || ''}`.trim(),
        createdAt: review.createdAt,
      })),
    };
  }
}
