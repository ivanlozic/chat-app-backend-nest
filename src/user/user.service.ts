import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { UpdateUserDto } from './dto/update-user.dto';
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
      receivedFriendRequests: [],
      sentFriendRequests: [],
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //FRIENDS

  async sendFriendRequest(
    currentUsername: string,
    friendUsername: string,
  ): Promise<void> {
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

    const userRequest = {
      username: currentUsername,
      name: currentUser.firstName,
      lastName: currentUser.lastName,
    };

    if (!currentUser.receivedFriendRequests.includes(friendUsername)) {
      currentUser.sentFriendRequests.push(friendUsername);
      friend.receivedFriendRequests.push(userRequest);

      await this.userRepository.save([currentUser, friend]);
    }
  }

  async addFriend(
    currentUsername: string,
    friendUsername: string,
  ): Promise<void> {
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

    if (currentUser.receivedFriendRequests.includes(friendUsername)) {
      currentUser.receivedFriendRequests =
        currentUser.receivedFriendRequests.filter(
          (username) => username !== friendUsername,
        );

      const newFriend: Friend = {
        id: friend.id,
        username: friend.username,
        messages: [],
      };

      currentUser.friends.push(newFriend);

      friend.sentFriendRequests = friend.sentFriendRequests.filter(
        (username) => username !== currentUsername,
      );

      await this.userRepository.save([currentUser, friend]);
    }
  }

  async getAllFriends(currentUser): Promise<Friend[]> {
    const user = await this.userRepository.findOne({
      where: { username: currentUser },
    });

    return (await user).friends;
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.mobileNumber = updateUserDto.mobileNumber;

    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
