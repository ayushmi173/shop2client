import { z } from 'zod';

// ============================================
// Pagination Schemas
// ============================================

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const CursorPaginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type CursorPaginationQuery = z.infer<typeof CursorPaginationQuerySchema>;

// ============================================
// Pagination Response Types
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: {
    cursor: string | null;
    nextCursor: string | null;
    limit: number;
    hasMore: boolean;
  };
}

// ============================================
// Pagination Helpers
// ============================================

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  totalItems: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function createCursorPaginatedResponse<T extends { id: string }>(
  data: T[],
  limit: number,
  cursor?: string,
): CursorPaginatedResponse<T> {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

  return {
    data: items,
    meta: {
      cursor: cursor || null,
      nextCursor,
      limit,
      hasMore,
    },
  };
}
