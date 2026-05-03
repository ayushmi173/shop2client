import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD') || undefined,
      db: this.configService.get('REDIS_DB', 0),
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis error:', error);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Disconnected from Redis');
  }

  // ============================================
  // Basic Operations
  // ============================================

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ============================================
  // JSON Operations
  // ============================================

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  // ============================================
  // Rate Limiting
  // ============================================

  async checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, windowSeconds);
    }

    const ttl = await this.client.ttl(key);
    const allowed = current <= maxRequests;
    const remaining = Math.max(0, maxRequests - current);

    return { allowed, remaining, resetIn: ttl > 0 ? ttl : windowSeconds };
  }

  // ============================================
  // Cache Patterns
  // ============================================

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number,
  ): Promise<T> {
    const cached = await this.getJson<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.setJson(key, value, ttlSeconds);
    return value;
  }

  async invalidatePattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;
    return this.client.del(...keys);
  }

  // ============================================
  // Geo Operations (for worker proximity)
  // ============================================

  async geoAdd(
    key: string,
    longitude: number,
    latitude: number,
    member: string,
  ): Promise<void> {
    await this.client.geoadd(key, longitude, latitude, member);
  }

  async geoRadius(
    key: string,
    longitude: number,
    latitude: number,
    radiusKm: number,
    limit?: number,
  ): Promise<string[]> {
    const args: (string | number)[] = [key, longitude.toString(), latitude.toString(), radiusKm.toString(), 'km', 'ASC'];
    if (limit) {
      args.push('COUNT', limit.toString());
    }
    return this.client.georadius(...args as [string, number, number, number, 'km']) as Promise<string[]>;
  }

  async geoRemove(key: string, member: string): Promise<void> {
    await this.client.zrem(key, member);
  }

  // ============================================
  // Pub/Sub for real-time notifications
  // ============================================

  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void): void {
    const subscriber = this.client.duplicate();
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }
}
