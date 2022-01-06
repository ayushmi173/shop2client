import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCatagoryDTO, ICreateCatagoryDTO } from '../dtos/catagory';
import { CatagoryService } from './catagory.service';

@Controller('catagory')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class CatagoryController {
  constructor(private catagoryService: CatagoryService) {}

  @Post('create')
  async createCatagory(
    @Body() createCatagoryDto: CreateCatagoryDTO,
  ): Promise<ICreateCatagoryDTO> {
    return await this.catagoryService.createCatagory(createCatagoryDto);
  }
}
