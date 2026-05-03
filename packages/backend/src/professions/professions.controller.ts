import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfessionsService } from './professions.service';
import { Public } from '../common/decorators';

@ApiTags('professions')
@Controller('api/v1/professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all professions' })
  @ApiResponse({ status: 200, description: 'List of professions' })
  async getAllProfessions() {
    const professions = await this.professionsService.getAllProfessions();
    return {
      success: true,
      data: professions,
    };
  }

  @Public()
  @Get('grouped')
  @ApiOperation({ summary: 'Get professions grouped by category' })
  @ApiResponse({ status: 200, description: 'Grouped professions' })
  async getProfessionsByCategory() {
    const grouped = await this.professionsService.getProfessionsByCategory();
    return {
      success: true,
      data: grouped,
    };
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular professions' })
  @ApiResponse({ status: 200, description: 'Popular professions' })
  async getPopularProfessions(@Query('limit') limit?: string) {
    const professions = await this.professionsService.getPopularProfessions(
      limit ? parseInt(limit, 10) : 10,
    );
    return {
      success: true,
      data: professions,
    };
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get profession by slug' })
  @ApiResponse({ status: 200, description: 'Profession details' })
  @ApiResponse({ status: 404, description: 'Profession not found' })
  async getProfessionBySlug(@Param('slug') slug: string) {
    const profession = await this.professionsService.getProfessionBySlug(slug);
    return {
      success: true,
      data: profession,
    };
  }
}
