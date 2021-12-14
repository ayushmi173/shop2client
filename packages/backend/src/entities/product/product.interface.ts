import { IBaseEntity } from '../../entities/base.interface';
// import { ICatagory } from '../catagory';

export interface IProduct extends IBaseEntity {
  name: string;
  description?: string;
  price: string;
  image?: string;
  offer?: number;
  quantity?: string;
  catagoryId?: string;
}
