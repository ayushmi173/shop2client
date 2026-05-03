import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService, CreateReviewSchema, WorkerResponseSchema, CreateReviewDto, WorkerResponseDto } from './reviews.service';
import { ZodValidate } from '../common/pipes';
import { CurrentUser, Roles, Public } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { User, UserRole } from '@prisma/client';

@ApiTags('reviews')
@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a completed service' })
  @ApiResponse({ status: 201, description: 'Review created' })
  async createReview(
    @CurrentUser() user: User,
    @Body(ZodValidate(CreateReviewSchema)) dto: CreateReviewDto,
  ) {
    const review = await this.reviewsService.createReview(user.id, dto);
    return {
      success: true,
      message: 'Review submitted successfully',
      data: review,
    };
  }

  @Public()
  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Get reviews for a worker' })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  async getWorkerReviews(
    @Param('workerId') workerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.reviewsService.getWorkerReviews(
      workerId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Post(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to a review' })
  @ApiResponse({ status: 200, description: 'Response added' })
  async respondToReview(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body(ZodValidate(WorkerResponseSchema)) dto: WorkerResponseDto,
  ) {
    const result = await this.reviewsService.respondToReview(id, user.id, dto);
    return {
      success: true,
      message: 'Response added successfully',
      data: result,
    };
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark review as helpful' })
  @ApiResponse({ status: 200, description: 'Marked as helpful' })
  async markHelpful(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    await this.reviewsService.markHelpful(id, user.id);
    return {
      success: true,
      message: 'Review marked as helpful',
    };
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a review' })
  @ApiResponse({ status: 200, description: 'Review reported' })
  async reportReview(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    await this.reviewsService.reportReview(id, user.id, body.reason);
    return {
      success: true,
      message: 'Review reported for moderation',
    };
  }
}
