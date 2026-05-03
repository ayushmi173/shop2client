import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { RedisService } from '../redis';

@Injectable()
export class ProfessionsService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Get all active professions
   */
  async getAllProfessions() {
    const cacheKey = 'professions:all';
    
    // Try cache
    const cached = await this.redis.getJson<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const professions = await this.prisma.profession.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        iconUrl: true,
        categoryGroup: true,
        _count: {
          select: {
            workerProfessions: true,
          },
        },
      },
    });

    const result = professions.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      iconUrl: p.iconUrl,
      categoryGroup: p.categoryGroup,
      workerCount: p._count.workerProfessions,
    }));

    // Cache for 1 hour
    await this.redis.setJson(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  /**
   * Get professions grouped by category
   */
  async getProfessionsByCategory() {
    const professions = await this.getAllProfessions();

    const grouped = professions.reduce((acc, profession) => {
      const group = profession.categoryGroup || 'Other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(profession);
      return acc;
    }, {} as Record<string, typeof professions>);

    return grouped;
  }

  /**
   * Get profession by slug
   */
  async getProfessionBySlug(slug: string) {
    const profession = await this.prisma.profession.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            workerProfessions: true,
          },
        },
      },
    });

    if (!profession) {
      throw new NotFoundException('Profession not found');
    }

    return {
      ...profession,
      workerCount: profession._count.workerProfessions,
    };
  }

  /**
   * Get popular professions (most workers)
   */
  async getPopularProfessions(limit = 10) {
    const cacheKey = `professions:popular:${limit}`;
    
    const cached = await this.redis.getJson<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const professions = await this.prisma.profession.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        categoryGroup: true,
        _count: {
          select: {
            workerProfessions: true,
          },
        },
      },
      orderBy: {
        workerProfessions: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    const result = professions.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      iconUrl: p.iconUrl,
      categoryGroup: p.categoryGroup,
      workerCount: p._count.workerProfessions,
    }));

    await this.redis.setJson(cacheKey, result, this.CACHE_TTL);

    return result;
  }
}
