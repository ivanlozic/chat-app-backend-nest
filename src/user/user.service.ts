import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: CreateUserDto[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      friends: [],
    });
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  /*
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  */

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //FRIENDS

  async addFriend(
    currentUsername: string,
    friendUsername: string,
  ): Promise<Friend> {
    const currentUser = await this.userRepository.findOne({
      where: { username: currentUsername },
    });

    if (!currentUser) {
      throw new Error(`User with username ${currentUsername} not found`);
    }

    const friend = await this.userRepository.findOne({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new Error(`Friend with username ${friendUsername} not found`);
    }

    const { id, username } = friend;

    const newFriend: Friend = {
      id,
      name: username,
      messages: [],
    };

    currentUser.friends.push(newFriend);
    await this.userRepository.save(currentUser);

    return newFriend;
  }

  async getAllFriends(currentUser): Promise<Friend[]> {
    const user = await this.userRepository.findOne({
      where: { username: currentUser },
    });

    return (await user).friends;
  }
}
