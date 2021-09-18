import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
/**
 * this class is the base entity for all the tables
 */
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly dateCreated: Date;

  @UpdateDateColumn({
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly dateUpdated: Date;

  @DeleteDateColumn({ type: 'time with time zone', nullable: true })
  readonly dateDeleted?: Date;
}
