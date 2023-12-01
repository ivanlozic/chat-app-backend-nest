import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(user: User) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }
}
