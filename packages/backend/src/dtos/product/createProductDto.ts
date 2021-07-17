import { IsNumber, IsOptional, IsString } from 'class-validator';

export interface ICreateProductDTO {
  name: string;
  description?: string;
  price: string;
  image?: string;
  offer?: number;
  catagoryId: string;
}

export class CreateProductDTO implements ICreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  offer?: number;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  catagoryId: string;
}
