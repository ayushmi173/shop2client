// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  email?: string;
  role: 'USER' | 'WORKER' | 'ADMIN';
  avatarUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  isNewUser: boolean;
}

// ============================================
// PROFESSION TYPES
// ============================================

export interface Profession {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  categoryGroup?: string;
  workerCount: number;
}

// ============================================
// WORKER TYPES
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
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
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

// ============================================
// SERVICE REQUEST TYPES
// ============================================

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
export type UrgencyLevel = 'NORMAL' | 'URGENT' | 'EMERGENCY';

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  description?: string;
  status: RequestStatus;
  urgency: UrgencyLevel;
  profession: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    phone: string;
    avatarUrl?: string;
    location?: {
      address: string;
      city: string;
    };
  };
  worker?: {
    id: string;
    firstName: string;
    lastName?: string;
    phone: string;
  };
  estimatedPrice?: number;
  finalPrice?: number;
  preferredDate?: string;
  preferredTime?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WORKER DASHBOARD TYPES
// ============================================

export interface WorkerStats {
  todayJobs: number;
  totalEarnings: number;
  completedJobs: number;
  pendingRequests: number;
  averageRating: number;
  totalReviews: number;
}

export interface WorkerDashboardData {
  stats: WorkerStats;
  pendingRequests: ServiceRequest[];
  activeJobs: ServiceRequest[];
  isAvailable: boolean;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  authorName: string;
  professionName: string;
  workerResponse?: string;
  workerRespondedAt?: Date;
  helpfulCount: number;
  createdAt: Date;
}

// ============================================
// FAVORITE TYPES
// ============================================

export interface Favorite {
  id: string;
  note?: string;
  createdAt: Date;
  worker: {
    id: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    phone: string;
    location?: {
      city: string;
      state: string;
    };
    averageRating: number;
    totalReviews: number;
    verificationStatus: string;
    isAvailable: boolean;
    professions: {
      name: string;
      slug: string;
    }[];
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
