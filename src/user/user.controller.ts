import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: User) {
    this.userService.createUser(createUserDto);
    return 'User created successfully';
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
