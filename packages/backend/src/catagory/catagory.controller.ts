import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCatagoryDTO, ICreateCatagoryDTO } from 'src/dtos/catagory';
import { CatagoryService } from './catagory.service';

@Controller('catagory')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    // transform: true,
  }),
)
export class CatagoryController {
  constructor(private catagoryService: CatagoryService) {}

  @Post('create')
  async createCatagory(
    @Body() createCatagoryDto: CreateCatagoryDTO,
  ): Promise<ICreateCatagoryDTO> {
    console.log('enter in controller', createCatagoryDto);
    return await this.catagoryService.createCatagory(createCatagoryDto);
  }
}
