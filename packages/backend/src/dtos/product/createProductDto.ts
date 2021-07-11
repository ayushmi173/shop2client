import { IsNumber, IsOptional, IsString } from 'class-validator';

export interface ICreateProductDTO {
  name: string;
  description?: string;
  price: string;
  imageFile?: Express.Multer.File;
  offer?: number;
  catagoryId: string;
}

export class CreateProductDTO implements ICreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsString()
  price: string;

  @IsOptional()
  imageFile?: Express.Multer.File;

  @IsNumber()
  @IsOptional()
  offer?: number;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  catagoryId: string;
}
