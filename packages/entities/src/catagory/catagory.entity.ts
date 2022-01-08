import { BaseEntity } from '../base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductEntity } from '../product';
import { CATAGORY_TYPE, ICatagory, STOCK } from './catagory.interface';

@Entity('catagories')
export class CatagoryEntity extends BaseEntity implements ICatagory {
    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ nullable: true })
    offer?: number;

    @Column({ nullable: true })
    stock?: STOCK;

    @Column({ nullable: true })
    catagory_type?: CATAGORY_TYPE;

    @OneToMany(() => ProductEntity, (product) => product.catagory)
    products: ProductEntity[];
}
