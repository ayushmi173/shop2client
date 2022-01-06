import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CATAGORY_TYPE, STOCK } from '../../entities';

export interface ICreateCatagoryDTO {
  name: string;
  description?: string;
  image?: string;
  offer?: number;
  stoke?: STOCK;
  quantity?: string;
  catagory_type?: CATAGORY_TYPE;
}

export class CreateCatagoryDTO implements ICreateCatagoryDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  offer?: number;

  @IsString()
  @IsOptional()
  stock?: STOCK;

  @IsString()
  @IsOptional()
  quantity?: string;

  @IsString()
  @IsOptional()
  catagory_type?: CATAGORY_TYPE;
}
