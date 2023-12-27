import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Message } from './entities/message.entity';
import * as bcrypt from 'bcrypt';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users: CreateUserDto[] = [];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
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
  ): Promise<User> {
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
      return currentUser;
    }
  }

  async addFriend(
    currentUsername: string,
    friendUsername: string,
  ): Promise<User> {
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

    if (
      currentUser.receivedFriendRequests.some(
        (f) => f.username === friendUsername,
      )
    ) {
      currentUser.receivedFriendRequests =
        currentUser.receivedFriendRequests.filter(
          (f) => f.username !== friendUsername,
        );

      const newFriend: Friend = {
        id: friend.id,
        username: friend.username,
        messages: [],
      };

      const currentUserAsFriend = {
        id: currentUser.id,
        username: currentUser.username,
        messages: [],
      };

      currentUser.friends.push(newFriend);
      friend.friends.push(currentUserAsFriend);

      friend.sentFriendRequests = friend.sentFriendRequests.filter(
        (username) => username !== currentUsername,
      );

      try {
        await this.userRepository.save(currentUser);
        await this.userRepository.save(friend);
        return currentUser;
      } catch (error) {
        console.error('Error adding friend:', error);
        throw new Error('Failed to save friend changes');
      }
    }
  }

  async rejectFriendRequest(
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

    if (
      currentUser.receivedFriendRequests.some(
        (f) => f.username === friendUsername,
      )
    ) {
      currentUser.receivedFriendRequests =
        currentUser.receivedFriendRequests.filter(
          (f) => f.username !== friendUsername,
        );

      friend.sentFriendRequests = friend.sentFriendRequests.filter(
        (username) => username !== currentUsername,
      );

      try {
        await this.userRepository.save(currentUser);
        await this.userRepository.save(friend);
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        throw new Error('Failed to save friend request rejection');
      }
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

    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.mobileNumber = updateUserDto.mobileNumber;

    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async sendMessage(
    currentUserUsername: string,
    friendUsername: string,
    message: Message,
  ): Promise<User> {
    const currentUser = await this.userRepository.findOne({
      where: { username: currentUserUsername },
    });

    if (!currentUser) {
      throw new Error(`User with username ${currentUserUsername} not found`);
    }

    const friend = currentUser.friends.find(
      (f) => f.username === friendUsername,
    );

    if (!friend) {
      throw new Error(`Friend with username ${friendUsername} not found`);
    }

    const friendBase = await this.userRepository.findOne({
      where: { username: friendUsername },
    });

    if (!friendBase) {
      throw new Error(`Friend with username ${friendUsername} not found`);
    }

    const currentUserAsFriend = friendBase.friends.find(
      (f) => f.username === currentUserUsername,
    );

    friend.messages.push(message);
    currentUserAsFriend.messages.push(message);

    await this.userRepository.save(currentUser);
    await this.userRepository.save(friendBase);

    return currentUser;
  }
}
