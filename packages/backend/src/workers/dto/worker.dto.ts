import { z } from 'zod';

// ============================================
// Worker Search & Discovery
// ============================================

export const WorkerSearchSchema = z.object({
  // Location
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  city: z.string().optional(),
  radiusKm: z.coerce.number().min(1).max(100).default(10),

  // Filters
  professionId: z.string().uuid().optional(),
  professionSlug: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  isVerified: z.coerce.boolean().optional(),
  isAvailable: z.coerce.boolean().optional(),
  emergencyAvailable: z.coerce.boolean().optional(),
  minExperience: z.coerce.number().int().min(0).optional(),
  maxHourlyRate: z.coerce.number().min(0).optional(),

  // Sorting
  sortBy: z.enum(['distance', 'rating', 'trustScore', 'price', 'experience']).default('trustScore'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type WorkerSearchDto = z.infer<typeof WorkerSearchSchema>;

// ============================================
// Worker Profile Update
// ============================================

export const UpdateWorkerProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  experience: z.number().int().min(0).max(50).optional(),
  serviceRadius: z.number().min(1).max(50).optional(),
  hourlyRate: z.number().min(0).optional(),
  minimumCharge: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
  emergencyAvailable: z.boolean().optional(),
});

export type UpdateWorkerProfileDto = z.infer<typeof UpdateWorkerProfileSchema>;

// ============================================
// Worker Availability
// ============================================

export const AvailabilitySlotSchema = z.object({
  dayOfWeek: z.enum([
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  isActive: z.boolean().default(true),
});

export const UpdateAvailabilitySchema = z.object({
  slots: z.array(AvailabilitySlotSchema).min(1),
});

export type AvailabilitySlotDto = z.infer<typeof AvailabilitySlotSchema>;
export type UpdateAvailabilityDto = z.infer<typeof UpdateAvailabilitySchema>;

// ============================================
// Worker Profession Management
// ============================================

export const AddProfessionSchema = z.object({
  professionId: z.string().uuid(),
  isPrimary: z.boolean().default(false),
  yearsExperience: z.number().int().min(0).optional(),
});

export type AddProfessionDto = z.infer<typeof AddProfessionSchema>;

// ============================================
// Response Types
// ============================================

export interface WorkerListItem {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    phone: string;
  };
  professions: {
    id: string;
    name: string;
    slug: string;
    isPrimary: boolean;
  }[];
  bio?: string;
  experience?: number;
  serviceRadius: number;
  hourlyRate?: number;
  verificationStatus: string;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;
  trustScore: number;
  isAvailable: boolean;
  emergencyAvailable: boolean;
  distance?: number;
  tags: string[];
  location?: {
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface WorkerDetail extends WorkerListItem {
  minimumCharge?: number;
  totalJobs: number;
  verifiedAt?: Date;
  availabilitySlots: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
  recentReviews: {
    id: string;
    rating: number;
    comment?: string;
    authorName: string;
    createdAt: Date;
  }[];
}
