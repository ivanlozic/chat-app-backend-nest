import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt'; // Dodato za bcrypt heširanje

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await this.comparePasswords(password, user.password))) {
      const token = this.generateAuthToken();
      return { token, user };
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  private generateAuthToken(): string {
    return this.jwtService.sign({ sub: 'user_id' });
  }

  private async comparePasswords(
    enteredPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPasswordHash);
  }
}
