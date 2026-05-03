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
import { ServiceRequestsService } from './service-requests.service';
import {
  CreateServiceRequestSchema,
  ServiceRequestQuerySchema,
  WorkerActionSchema,
  CompleteRequestSchema,
  CancelRequestSchema,
  CreateServiceRequestDto,
  ServiceRequestQueryDto,
  WorkerActionDto,
  CompleteRequestDto,
  CancelRequestDto,
} from './dto';
import { ZodValidate } from '../common/pipes';
import { CurrentUser, Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { User, UserRole } from '@prisma/client';

@ApiTags('service-requests')
@Controller('api/v1/service-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  // ============================================
  // USER ENDPOINTS
  // ============================================

  @Post()
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiResponse({ status: 201, description: 'Request created' })
  async createRequest(
    @CurrentUser() user: User,
    @Body(ZodValidate(CreateServiceRequestSchema)) dto: CreateServiceRequestDto,
  ) {
    const request = await this.serviceRequestsService.createRequest(user.id, dto);
    return {
      success: true,
      message: 'Service request created successfully',
      data: request,
    };
  }

  @Get('my-requests')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Get my service requests as a user' })
  @ApiResponse({ status: 200, description: 'List of requests' })
  async getMyRequests(
    @CurrentUser() user: User,
    @Query(ZodValidate(ServiceRequestQuerySchema)) query: ServiceRequestQueryDto,
  ) {
    const result = await this.serviceRequestsService.getUserRequests(user.id, query);
    return {
      success: true,
      ...result,
    };
  }

  // ============================================
  // WORKER ENDPOINTS
  // ============================================

  @Get('worker-requests')
  @Roles(UserRole.WORKER)
  @ApiOperation({ summary: 'Get service requests assigned to me as a worker' })
  @ApiResponse({ status: 200, description: 'List of requests' })
  async getWorkerRequests(
    @CurrentUser() user: User,
    @Query(ZodValidate(ServiceRequestQuerySchema)) query: ServiceRequestQueryDto,
  ) {
    const result = await this.serviceRequestsService.getWorkerRequests(user.id, query);
    return {
      success: true,
      ...result,
    };
  }

  @Post(':id/accept')
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a service request' })
  @ApiResponse({ status: 200, description: 'Request accepted' })
  async acceptRequest(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body(ZodValidate(WorkerActionSchema)) dto: WorkerActionDto,
  ) {
    const request = await this.serviceRequestsService.acceptRequest(id, user.id, dto);
    return {
      success: true,
      message: 'Service request accepted',
      data: request,
    };
  }

  @Post(':id/reject')
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a service request' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  async rejectRequest(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { note?: string },
  ) {
    const result = await this.serviceRequestsService.rejectRequest(id, user.id, body.note);
    return {
      success: true,
      message: 'Service request rejected',
      data: result,
    };
  }

  @Post(':id/start')
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start work on a service request' })
  @ApiResponse({ status: 200, description: 'Work started' })
  async startWork(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const result = await this.serviceRequestsService.startWork(id, user.id);
    return {
      success: true,
      message: 'Work started',
      data: result,
    };
  }

  @Post(':id/complete')
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete a service request' })
  @ApiResponse({ status: 200, description: 'Work completed' })
  async completeWork(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body(ZodValidate(CompleteRequestSchema)) dto: CompleteRequestDto,
  ) {
    const result = await this.serviceRequestsService.completeWork(id, user.id, dto);
    return {
      success: true,
      message: 'Work completed successfully',
      data: result,
    };
  }

  // ============================================
  // SHARED ENDPOINTS
  // ============================================

  @Get(':id')
  @ApiOperation({ summary: 'Get service request details' })
  @ApiResponse({ status: 200, description: 'Request details' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async getRequestById(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const request = await this.serviceRequestsService.getRequestById(id, user.id, user.role);
    return {
      success: true,
      data: request,
    };
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a service request' })
  @ApiResponse({ status: 200, description: 'Request cancelled' })
  async cancelRequest(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body(ZodValidate(CancelRequestSchema)) dto: CancelRequestDto,
  ) {
    const result = await this.serviceRequestsService.cancelRequest(id, user.id, user.role, dto);
    return {
      success: true,
      message: 'Service request cancelled',
      data: result,
    };
  }
}
