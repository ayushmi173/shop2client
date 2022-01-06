import { IBaseEntity } from '../../entities/base.interface';
import { IProduct } from '../product/product.interface';

export enum STOCK {
  AVAILABLE = 'available',
  NOT_AVALILABLE = 'not_available',
}

export enum CATAGORY_TYPE {
  SWEET = 'sweet',
  ITALIAN = 'italian',
  SOUTH_INDIAN = 'south_indian',
  INDIAN = 'indian',
  CHINESE = 'chinese',
  NORTH_INDIAN = 'north_indian',
  DESSERT = 'desert',
}

export interface ICatagory extends IBaseEntity {
  name: string;
  description?: string;
  image?: string;
  offer?: number;
  stock?: STOCK;
  catagory_type?: CATAGORY_TYPE;
  products: IProduct[];
}
