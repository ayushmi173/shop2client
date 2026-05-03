import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Core modules
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

// Feature modules
import { AuthModule } from './auth';
import { WorkersModule } from './workers';
import { ProfessionsModule } from './professions';
import { ServiceRequestsModule } from './service-requests';
import { ReviewsModule } from './reviews';
import { FavoritesModule } from './favorites';

// Common
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { GlobalExceptionFilter } from './common/filters';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),

    // Core modules
    PrismaModule,
    RedisModule,

    // Feature modules
    AuthModule,
    WorkersModule,
    ProfessionsModule,
    ServiceRequestsModule,
    ReviewsModule,
    FavoritesModule,
  ],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Global JWT auth guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
