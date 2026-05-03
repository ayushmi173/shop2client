import { z } from 'zod';

// ============================================
// Create Service Request
// ============================================

export const CreateServiceRequestSchema = z.object({
  workerId: z.string().uuid().optional(), // Optional for broadcast requests
  professionId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  preferredDate: z.string().datetime().optional(),
  preferredTimeSlot: z.string().optional(), // e.g., "09:00-12:00"
  urgency: z.enum(['NORMAL', 'URGENT', 'EMERGENCY']).default('NORMAL'),
  serviceLatitude: z.number().min(-90).max(90).optional(),
  serviceLongitude: z.number().min(-180).max(180).optional(),
  serviceAddress: z.string().max(500).optional(),
});

export type CreateServiceRequestDto = z.infer<typeof CreateServiceRequestSchema>;

// ============================================
// Update Service Request
// ============================================

export const UpdateServiceRequestSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  preferredDate: z.string().datetime().optional(),
  preferredTimeSlot: z.string().optional(),
  serviceAddress: z.string().max(500).optional(),
});

export type UpdateServiceRequestDto = z.infer<typeof UpdateServiceRequestSchema>;

// ============================================
// Worker Actions
// ============================================

export const WorkerActionSchema = z.object({
  estimatedPrice: z.number().min(0).optional(),
  note: z.string().max(500).optional(),
});

export type WorkerActionDto = z.infer<typeof WorkerActionSchema>;

export const CompleteRequestSchema = z.object({
  finalPrice: z.number().min(0),
  note: z.string().max(500).optional(),
});

export type CompleteRequestDto = z.infer<typeof CompleteRequestSchema>;

export const CancelRequestSchema = z.object({
  reason: z.string().min(10).max(500),
});

export type CancelRequestDto = z.infer<typeof CancelRequestSchema>;

// ============================================
// Query Filters
// ============================================

export const ServiceRequestQuerySchema = z.object({
  status: z.enum([
    'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'
  ]).optional(),
  professionId: z.string().uuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ServiceRequestQueryDto = z.infer<typeof ServiceRequestQuerySchema>;

// ============================================
// Response Types
// ============================================

export interface ServiceRequestListItem {
  id: string;
  requestNumber: string;
  title: string;
  status: string;
  urgency: string;
  profession: {
    id: string;
    name: string;
    slug: string;
  };
  user?: {
    firstName: string;
    lastName?: string;
  };
  worker?: {
    firstName: string;
    lastName?: string;
  };
  estimatedPrice?: number;
  preferredDate?: Date;
  createdAt: Date;
}

export interface ServiceRequestDetail extends ServiceRequestListItem {
  description: string;
  preferredTimeSlot?: string;
  serviceAddress?: string;
  finalPrice?: number;
  statusHistory?: any[];
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  review?: {
    id: string;
    rating: number;
    comment?: string;
  };
}
