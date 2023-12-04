import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() credentials: { username: string; password: string },
  ): Promise<{ token: string; user: User }> {
    return this.authService.login(credentials.username, credentials.password);
  }
}
