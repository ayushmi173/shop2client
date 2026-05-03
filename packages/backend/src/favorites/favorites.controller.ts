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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService, AddFavoriteSchema, UpdateFavoriteSchema, AddFavoriteDto, UpdateFavoriteDto } from './favorites.service';
import { ZodValidate } from '../common/pipes';
import { CurrentUser, Roles } from '../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../common/guards';
import { User, UserRole } from '@prisma/client';

@ApiTags('favorites')
@Controller('api/v1/favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add worker to favorites' })
  @ApiResponse({ status: 201, description: 'Added to favorites' })
  async addFavorite(
    @CurrentUser() user: User,
    @Body(ZodValidate(AddFavoriteSchema)) dto: AddFavoriteDto,
  ) {
    const favorite = await this.favoritesService.addFavorite(user.id, dto);
    return {
      success: true,
      message: 'Added to favorites',
      data: favorite,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get my favorites' })
  @ApiResponse({ status: 200, description: 'List of favorites' })
  async getFavorites(
    @CurrentUser() user: User,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.favoritesService.getFavorites(
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return {
      success: true,
      ...result,
    };
  }

  @Get(':workerId/check')
  @ApiOperation({ summary: 'Check if worker is favorited' })
  @ApiResponse({ status: 200, description: 'Favorite status' })
  async checkFavorite(
    @CurrentUser() user: User,
    @Param('workerId') workerId: string,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(user.id, workerId);
    return {
      success: true,
      data: { isFavorite },
    };
  }

  @Put(':workerId')
  @ApiOperation({ summary: 'Update favorite note' })
  @ApiResponse({ status: 200, description: 'Favorite updated' })
  async updateFavorite(
    @CurrentUser() user: User,
    @Param('workerId') workerId: string,
    @Body(ZodValidate(UpdateFavoriteSchema)) dto: UpdateFavoriteDto,
  ) {
    const result = await this.favoritesService.updateFavorite(user.id, workerId, dto);
    return {
      success: true,
      message: 'Favorite updated',
      data: result,
    };
  }

  @Delete(':workerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove worker from favorites' })
  @ApiResponse({ status: 200, description: 'Removed from favorites' })
  async removeFavorite(
    @CurrentUser() user: User,
    @Param('workerId') workerId: string,
  ) {
    await this.favoritesService.removeFavorite(user.id, workerId);
    return {
      success: true,
      message: 'Removed from favorites',
    };
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync favorites from offline storage' })
  @ApiResponse({ status: 200, description: 'Favorites synced' })
  async syncFavorites(
    @CurrentUser() user: User,
    @Body() body: { workerIds: string[] },
  ) {
    const result = await this.favoritesService.syncFavorites(user.id, body.workerIds);
    return {
      success: true,
      message: 'Favorites synced',
      ...result,
    };
  }
}
