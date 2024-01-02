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
  mobileNumber: string;
  @Column({ type: 'json', default: '[]' })
  receivedFriendRequests: any[];

  @Column({ type: 'json', default: '[]' })
  sentFriendRequests: string[];

  @Column({ type: 'json', default: '[]' })
  friends: Friend[];
}
