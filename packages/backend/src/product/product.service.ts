import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDTO } from '../dtos/product';
import { IProduct, ProductEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(dto: CreateProductDTO): Promise<IProduct> {
    const productEntity = this.productRepository.create(dto);
    const product = await this.productRepository.save(productEntity);
    if (!product) throw new BadRequestException('Product can not be created');
    return product;
  }

  async getProductsByCatagoryId(catagoryId: string): Promise<IProduct[]> {
    const products = await this.productRepository.findByIds([catagoryId]);
    if (!products) throw new NotFoundException('product not found');
    return products;
  }
}
