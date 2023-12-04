import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Friend } from './friend.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  repeatPassword: string;

  @Column()
  mobileNumber: string;

  @Column({ type: 'json', default: '[]' })
  friends: Friend[];
}
