import { Body, Controller, Get, Headers, Post, Patch, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginBody = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('areas')
  async areas() {
    return this.authService.getAreas();
  }

  @Post('register')
  async register(@Body() body: { full_name: string; email: string; password: string; area_id?: number }) {
    if (!body.full_name || !body.email || !body.password) {
      throw new BadRequestException('Nome, email e password são obrigatórios');
    }
    const result = await this.authService.register({
      fullName: body.full_name, email: body.email,
      password: body.password, areaId: body.area_id,
    });
    if (!result) throw new BadRequestException('Email já registado');
    return result;
  }

  @Post('login')
  async login(@Body() body: LoginBody) {
    return this.authService.login(body.email, body.password);
  }

  @Post('change-password')
  async changePassword(
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: { password: string },
  ) {
    const userId = Number(userIdHeader);
    if (!Number.isFinite(userId) || userId <= 0) throw new UnauthorizedException('x-user-id header invalido');
    if (!body.password) throw new BadRequestException('Password obrigatória');
    await this.authService.changePassword(userId, body.password);
    return { ok: true };
  }

  @Patch('profile')
  async updateProfile(
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: { area_id?: number; full_name?: string },
  ) {
    const userId = Number(userIdHeader);
    if (!Number.isFinite(userId) || userId <= 0) throw new UnauthorizedException('x-user-id header invalido');
    await this.authService.updateProfile(userId, body);
    return { ok: true };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const result = await this.authService.forgotPassword(body.email);
    if (!result) return { ok: true };
    return { ok: true, reset_token: result.token };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    if (!body.token || !body.password) throw new BadRequestException('Token e password obrigatórios');
    const ok = await this.authService.resetPassword(body.token, body.password);
    if (!ok) throw new BadRequestException('Token inválido ou expirado');
    return { ok: true };
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
