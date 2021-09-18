import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDTO } from 'src/dtos/product';
import { IProduct } from 'src/entities';
import { ProductService } from './product.service';

@Controller('product')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create')
  async createProduct(
    @Body() createProductDto: CreateProductDTO,
  ): Promise<IProduct> {
    return await this.productService.createProduct(createProductDto);
  }

  @Get('catagory/:id')
  async getProductsById(@Param('id') id: string): Promise<IProduct[]> {
    return await this.productService.getProductsByCatagoryId(id);
  }
}
