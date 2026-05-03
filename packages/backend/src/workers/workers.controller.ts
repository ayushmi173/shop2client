import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import {
  WorkerSearchSchema,
  UpdateWorkerProfileSchema,
  UpdateAvailabilitySchema,
  AddProfessionSchema,
  WorkerSearchDto,
  UpdateWorkerProfileDto,
  UpdateAvailabilityDto,
  AddProfessionDto,
} from './dto';
import { ZodValidate } from '../common/pipes';
import { Public, CurrentUser, Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { User, UserRole } from '@prisma/client';

@ApiTags('workers')
@Controller('api/v1/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search workers with filters' })
  @ApiResponse({ status: 200, description: 'List of workers' })
  @ApiQuery({ name: 'latitude', required: false })
  @ApiQuery({ name: 'longitude', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'professionSlug', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'isVerified', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['distance', 'rating', 'trustScore', 'price', 'experience'] })
  async searchWorkers(
    @Query(ZodValidate(WorkerSearchSchema)) query: WorkerSearchDto,
  ) {
    const result = await this.workersService.searchWorkers(query);
    return {
      success: true,
      ...result,
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get worker details by ID' })
  @ApiResponse({ status: 200, description: 'Worker details' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  async getWorkerById(@Param('id') id: string) {
    const worker = await this.workersService.getWorkerById(id);
    return {
      success: true,
      data: worker,
    };
  }

  // ============================================
  // WORKER PROFILE MANAGEMENT
  // ============================================

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own worker profile' })
  @ApiResponse({ status: 200, description: 'Worker profile' })
  async getMyProfile(@CurrentUser() user: User) {
    const worker = await this.workersService.getWorkerByUserId(user.id);
    return {
      success: true,
      data: worker,
    };
  }

  @Put('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update worker profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body(ZodValidate(UpdateWorkerProfileSchema)) dto: UpdateWorkerProfileDto,
  ) {
    const result = await this.workersService.updateProfile(user.id, dto);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: result,
    };
  }

  @Put('me/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update availability slots' })
  @ApiResponse({ status: 200, description: 'Availability updated' })
  async updateAvailability(
    @CurrentUser() user: User,
    @Body(ZodValidate(UpdateAvailabilitySchema)) dto: UpdateAvailabilityDto,
  ) {
    const result = await this.workersService.updateAvailability(user.id, dto);
    return {
      success: true,
      message: 'Availability updated successfully',
      data: result,
    };
  }

  // ============================================
  // PROFESSION MANAGEMENT
  // ============================================

  @Post('me/professions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add profession to profile' })
  @ApiResponse({ status: 201, description: 'Profession added' })
  async addProfession(
    @CurrentUser() user: User,
    @Body(ZodValidate(AddProfessionSchema)) dto: AddProfessionDto,
  ) {
    const result = await this.workersService.addProfession(user.id, dto);
    return {
      success: true,
      message: 'Profession added successfully',
      data: result,
    };
  }

  @Delete('me/professions/:professionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove profession from profile' })
  @ApiResponse({ status: 200, description: 'Profession removed' })
  async removeProfession(
    @CurrentUser() user: User,
    @Param('professionId') professionId: string,
  ) {
    await this.workersService.removeProfession(user.id, professionId);
    return {
      success: true,
      message: 'Profession removed successfully',
    };
  }
}
