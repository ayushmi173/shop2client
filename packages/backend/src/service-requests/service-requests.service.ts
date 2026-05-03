import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { WorkersService } from '../workers';
import { ServiceRequestStatus, Prisma, UserRole } from '@prisma/client';
import {
  CreateServiceRequestDto,
  WorkerActionDto,
  CompleteRequestDto,
  CancelRequestDto,
  ServiceRequestQueryDto,
  ServiceRequestListItem,
  ServiceRequestDetail,
} from './dto';
import { createPaginatedResponse } from '../common';

@Injectable()
export class ServiceRequestsService {
  // Valid status transitions
  private readonly STATUS_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
    [ServiceRequestStatus.PENDING]: [ServiceRequestStatus.ACCEPTED, ServiceRequestStatus.REJECTED, ServiceRequestStatus.CANCELLED],
    [ServiceRequestStatus.ACCEPTED]: [ServiceRequestStatus.IN_PROGRESS, ServiceRequestStatus.CANCELLED],
    [ServiceRequestStatus.IN_PROGRESS]: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED],
    [ServiceRequestStatus.COMPLETED]: [],
    [ServiceRequestStatus.CANCELLED]: [],
    [ServiceRequestStatus.REJECTED]: [],
  };

  constructor(
    private prisma: PrismaService,
    private workersService: WorkersService,
  ) {}

  // ============================================
  // CREATE & READ
  // ============================================

  /**
   * Create a new service request
   */
  async createRequest(userId: string, dto: CreateServiceRequestDto) {
    // Verify profession exists
    const profession = await this.prisma.profession.findUnique({
      where: { id: dto.professionId },
    });

    if (!profession) {
      throw new BadRequestException('Invalid profession');
    }

    // If worker specified, verify they exist and have this profession
    if (dto.workerId) {
      const workerProfile = await this.prisma.workerProfile.findFirst({
        where: {
          userId: dto.workerId,
          professions: {
            some: { professionId: dto.professionId },
          },
        },
      });

      if (!workerProfile) {
        throw new BadRequestException('Worker not found or does not offer this service');
      }
    }

    // Generate request number
    const requestNumber = await this.generateRequestNumber();

    const request = await this.prisma.serviceRequest.create({
      data: {
        requestNumber,
        userId,
        workerId: dto.workerId,
        professionId: dto.professionId,
        title: dto.title,
        description: dto.description,
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
        preferredTimeSlot: dto.preferredTimeSlot,
        urgency: dto.urgency,
        serviceLatitude: dto.serviceLatitude,
        serviceLongitude: dto.serviceLongitude,
        serviceAddress: dto.serviceAddress,
        status: ServiceRequestStatus.PENDING,
        statusHistory: [
          {
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            note: 'Request created',
          },
        ],
      },
      include: {
        profession: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        worker: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // TODO: Send notification to worker
    // await this.notificationsService.sendServiceRequestNotification(request);

    return this.mapToListItem(request);
  }

  /**
   * Get user's service requests
   */
  async getUserRequests(userId: string, query: ServiceRequestQueryDto) {
    const { page, limit, status, professionId, fromDate, toDate } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceRequestWhereInput = {
      userId,
      deletedAt: null,
    };

    if (status) where.status = status as ServiceRequestStatus;
    if (professionId) where.professionId = professionId;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profession: true,
          worker: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return createPaginatedResponse(
      requests.map(this.mapToListItem),
      page,
      limit,
      total,
    );
  }

  /**
   * Get worker's service requests
   */
  async getWorkerRequests(workerId: string, query: ServiceRequestQueryDto) {
    const { page, limit, status, professionId, fromDate, toDate } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceRequestWhereInput = {
      workerId,
      deletedAt: null,
    };

    if (status) where.status = status as ServiceRequestStatus;
    if (professionId) where.professionId = professionId;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt.gte = new Date(fromDate);
      if (toDate) where.createdAt.lte = new Date(toDate);
    }

    const [requests, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profession: true,
          user: {
            select: { firstName: true, lastName: true, phone: true },
          },
        },
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return createPaginatedResponse(
      requests.map(this.mapToListItem),
      page,
      limit,
      total,
    );
  }

  /**
   * Get service request by ID
   */
  async getRequestById(requestId: string, userId: string, userRole: UserRole): Promise<ServiceRequestDetail> {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        profession: true,
        user: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        worker: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        review: {
          select: { id: true, rating: true, comment: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    // Check access
    if (userRole !== UserRole.ADMIN) {
      if (request.userId !== userId && request.workerId !== userId) {
        throw new ForbiddenException('You do not have access to this request');
      }
    }

    return this.mapToDetail(request);
  }

  // ============================================
  // STATUS TRANSITIONS
  // ============================================

  /**
   * Worker accepts request
   */
  async acceptRequest(requestId: string, workerId: string, dto: WorkerActionDto) {
    const request = await this.getRequestForWorkerAction(requestId, workerId);

    this.validateStatusTransition(request.status, ServiceRequestStatus.ACCEPTED);

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.ACCEPTED,
        workerId,
        acceptedAt: new Date(),
        estimatedPrice: dto.estimatedPrice,
        statusHistory: this.addStatusHistory(
          request.statusHistory as any[],
          'ACCEPTED',
          dto.note || 'Request accepted by worker',
        ),
      },
      include: {
        profession: true,
        user: { select: { firstName: true, lastName: true } },
        worker: { select: { firstName: true, lastName: true } },
      },
    });

    // TODO: Send notification to user

    return this.mapToListItem(updated);
  }

  /**
   * Worker rejects request
   */
  async rejectRequest(requestId: string, workerId: string, note?: string) {
    const request = await this.getRequestForWorkerAction(requestId, workerId);

    this.validateStatusTransition(request.status, ServiceRequestStatus.REJECTED);

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.REJECTED,
        statusHistory: this.addStatusHistory(
          request.statusHistory as any[],
          'REJECTED',
          note || 'Request rejected by worker',
        ),
      },
    });

    // TODO: Send notification to user

    return { success: true, status: updated.status };
  }

  /**
   * Worker starts work
   */
  async startWork(requestId: string, workerId: string) {
    const request = await this.getRequestForWorkerAction(requestId, workerId);

    this.validateStatusTransition(request.status, ServiceRequestStatus.IN_PROGRESS);

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.IN_PROGRESS,
        startedAt: new Date(),
        statusHistory: this.addStatusHistory(
          request.statusHistory as any[],
          'IN_PROGRESS',
          'Work started',
        ),
      },
    });

    return { success: true, status: updated.status };
  }

  /**
   * Worker completes work
   */
  async completeWork(requestId: string, workerId: string, dto: CompleteRequestDto) {
    const request = await this.getRequestForWorkerAction(requestId, workerId);

    this.validateStatusTransition(request.status, ServiceRequestStatus.COMPLETED);

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.COMPLETED,
        completedAt: new Date(),
        finalPrice: dto.finalPrice,
        statusHistory: this.addStatusHistory(
          request.statusHistory as any[],
          'COMPLETED',
          dto.note || 'Work completed',
        ),
      },
    });

    // Update worker stats
    const workerProfile = await this.prisma.workerProfile.findUnique({
      where: { userId: workerId },
    });
    if (workerProfile) {
      await this.workersService.updateWorkerStats(workerProfile.id);
    }

    // TODO: Send review reminder notification

    return { success: true, status: updated.status };
  }

  /**
   * Cancel request (by user or worker)
   */
  async cancelRequest(requestId: string, userId: string, userRole: UserRole, dto: CancelRequestDto) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    // Check access
    const isUser = request.userId === userId;
    const isWorker = request.workerId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isUser && !isWorker && !isAdmin) {
      throw new ForbiddenException('You cannot cancel this request');
    }

    this.validateStatusTransition(request.status, ServiceRequestStatus.CANCELLED);

    const cancelledBy = isUser ? 'USER' : isWorker ? 'WORKER' : 'ADMIN';

    const updated = await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: ServiceRequestStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: dto.reason,
        cancelledBy,
        statusHistory: this.addStatusHistory(
          request.statusHistory as any[],
          'CANCELLED',
          `Cancelled by ${cancelledBy.toLowerCase()}: ${dto.reason}`,
        ),
      },
    });

    // Update worker stats (increment cancelled)
    if (request.workerId) {
      await this.prisma.workerProfile.update({
        where: { userId: request.workerId },
        data: {
          cancelledJobs: { increment: 1 },
          totalJobs: { increment: 1 },
        },
      });
    }

    return { success: true, status: updated.status };
  }

  // ============================================
  // HELPERS
  // ============================================

  private async generateRequestNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.serviceRequest.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });
    return `SR-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private async getRequestForWorkerAction(requestId: string, workerId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    // For accepting, worker might not be assigned yet
    if (request.workerId && request.workerId !== workerId) {
      throw new ForbiddenException('This request is not assigned to you');
    }

    return request;
  }

  private validateStatusTransition(current: ServiceRequestStatus, next: ServiceRequestStatus) {
    const validTransitions = this.STATUS_TRANSITIONS[current];
    
    if (!validTransitions.includes(next)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${next}. Valid transitions: ${validTransitions.join(', ') || 'none'}`,
      );
    }
  }

  private addStatusHistory(history: any[], status: string, note: string): any[] {
    return [
      ...(history || []),
      {
        status,
        timestamp: new Date().toISOString(),
        note,
      },
    ];
  }

  private mapToListItem(request: any): ServiceRequestListItem {
    return {
      id: request.id,
      requestNumber: request.requestNumber,
      title: request.title,
      status: request.status,
      urgency: request.urgency,
      profession: {
        id: request.profession.id,
        name: request.profession.name,
        slug: request.profession.slug,
      },
      user: request.user ? {
        firstName: request.user.firstName,
        lastName: request.user.lastName,
      } : undefined,
      worker: request.worker ? {
        firstName: request.worker.firstName,
        lastName: request.worker.lastName,
      } : undefined,
      estimatedPrice: request.estimatedPrice ? parseFloat(request.estimatedPrice) : undefined,
      preferredDate: request.preferredDate,
      createdAt: request.createdAt,
    };
  }

  private mapToDetail(request: any): ServiceRequestDetail {
    return {
      ...this.mapToListItem(request),
      description: request.description,
      preferredTimeSlot: request.preferredTimeSlot,
      serviceAddress: request.serviceAddress,
      finalPrice: request.finalPrice ? parseFloat(request.finalPrice) : undefined,
      statusHistory: request.statusHistory,
      acceptedAt: request.acceptedAt,
      startedAt: request.startedAt,
      completedAt: request.completedAt,
      cancelledAt: request.cancelledAt,
      cancellationReason: request.cancellationReason,
      review: request.review,
    };
  }
}
