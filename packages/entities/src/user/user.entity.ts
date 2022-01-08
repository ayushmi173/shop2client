import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '..';
import { IUser } from './user.interface';

@Entity('users')
@Unique(['username'])
export class UserEntity extends BaseEntity implements IUser {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  contactNumber: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async usernameToLowerCase() {
    this.username = this.username.toLowerCase();
  }
}
