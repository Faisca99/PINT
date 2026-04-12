import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginBody = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginBody) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  async me(@Headers('x-user-id') userIdHeader: string) {
    const userId = Number(userIdHeader);
    if (!Number.isFinite(userId) || userId <= 0) {
      throw new UnauthorizedException('x-user-id header invalido');
    }

    return this.authService.me(userId);
  }
}
