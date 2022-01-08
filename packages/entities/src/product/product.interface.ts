import { IBaseEntity } from '../base.interface';

export interface IProduct extends IBaseEntity {
    name: string;
    description?: string;
    price: string;
    image?: string;
    offer?: number;
    quantity?: string;
    catagoryId?: string;
}
