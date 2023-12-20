import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('send-friend-request')
  async sendFriendRequest(
    @Body() body: { currentUser: string; friendUsername: string },
  ) {
    return this.userService.sendFriendRequest(
      body.currentUser,
      body.friendUsername,
    );
  }

  @Post('add-friend')
  async addFriend(
    @Body() body: { currentUser: string; friendUsername: string },
  ) {
    return this.userService.addFriend(body.currentUser, body.friendUsername);
  }

  @Post('reject-friend-request')
  async rejectFriendRequest(
    @Body() body: { currentUser: string; friendUsername: string },
  ) {
    return this.userService.rejectFriendRequest(
      body.currentUser,
      body.friendUsername,
    );
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
*/

  @Put(':id')
  updateProfile(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
