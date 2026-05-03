import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { RedisService } from '../redis';
import { WorkersService } from '../workers';
import { ServiceRequestStatus, ReviewStatus } from '@prisma/client';
import { z } from 'zod';
import { createPaginatedResponse } from '../common';

// ============================================
// DTOs
// ============================================

export const CreateReviewSchema = z.object({
  serviceRequestId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export const WorkerResponseSchema = z.object({
  response: z.string().min(10).max(500),
});

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>;
export type WorkerResponseDto = z.infer<typeof WorkerResponseSchema>;

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private workersService: WorkersService,
  ) {}

  /**
   * Create a review for a completed service request
   */
  async createReview(userId: string, dto: CreateReviewDto) {
    // Verify service request exists and is completed
    const serviceRequest = await this.prisma.serviceRequest.findUnique({
      where: { id: dto.serviceRequestId },
      include: { review: true },
    });

    if (!serviceRequest) {
      throw new NotFoundException('Service request not found');
    }

    if (serviceRequest.userId !== userId) {
      throw new ForbiddenException('You can only review your own service requests');
    }

    if (serviceRequest.status !== ServiceRequestStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed service requests');
    }

    if (serviceRequest.review) {
      throw new BadRequestException('Review already exists for this service request');
    }

    if (!serviceRequest.workerId) {
      throw new BadRequestException('No worker assigned to this request');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        serviceRequestId: dto.serviceRequestId,
        authorId: userId,
        targetId: serviceRequest.workerId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        status: ReviewStatus.PENDING, // Pending moderation
        isVerifiedPurchase: true,
      },
      include: {
        author: { select: { firstName: true, lastName: true } },
        serviceRequest: {
          include: { profession: { select: { name: true } } },
        },
      },
    });

    // Update worker stats
    const workerProfile = await this.prisma.workerProfile.findUnique({
      where: { userId: serviceRequest.workerId },
    });

    if (workerProfile) {
      await this.workersService.updateWorkerStats(workerProfile.id, dto.rating);
      await this.workersService.updateWorkerTags(workerProfile.id);
    }

    // Invalidate caches
    await this.redis.invalidatePattern(`worker:*`);

    return review;
  }

  /**
   * Get reviews for a worker
   */
  async getWorkerReviews(workerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          targetId: workerId,
          status: ReviewStatus.APPROVED,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { firstName: true, lastName: true } },
          serviceRequest: {
            include: { profession: { select: { name: true } } },
          },
        },
      }),
      this.prisma.review.count({
        where: {
          targetId: workerId,
          status: ReviewStatus.APPROVED,
          deletedAt: null,
        },
      }),
    ]);

    return createPaginatedResponse(
      reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        authorName: `${r.author.firstName} ${r.author.lastName || ''}`.trim(),
        professionName: r.serviceRequest.profession.name,
        workerResponse: r.workerResponse,
        workerRespondedAt: r.workerRespondedAt,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt,
      })),
      page,
      limit,
      total,
    );
  }

  /**
   * Worker responds to a review
   */
  async respondToReview(reviewId: string, workerId: string, dto: WorkerResponseDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.targetId !== workerId) {
      throw new ForbiddenException('You can only respond to your own reviews');
    }

    if (review.workerResponse) {
      throw new BadRequestException('You have already responded to this review');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        workerResponse: dto.response,
        workerRespondedAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string, userId: string) {
    // Using Redis to track who marked what helpful (simple dedup)
    const key = `review:helpful:${reviewId}:${userId}`;
    const already = await this.redis.exists(key);

    if (already) {
      throw new BadRequestException('You have already marked this review as helpful');
    }

    await this.redis.set(key, '1', 86400 * 30); // 30 days

    await this.prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } },
    });

    return { success: true };
  }

  /**
   * Report a review
   */
  async reportReview(reviewId: string, _userId: string, _reason: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Increment report count
    await this.prisma.review.update({
      where: { id: reviewId },
      data: { reportCount: { increment: 1 } },
    });

    // Flag for moderation if too many reports
    if (review.reportCount >= 2) {
      await this.prisma.review.update({
        where: { id: reviewId },
        data: { status: ReviewStatus.FLAGGED },
      });
    }

    return { success: true };
  }
}
