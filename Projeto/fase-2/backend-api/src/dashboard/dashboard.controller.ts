import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('me')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard')
  async meDashboard(@Headers('x-user-id') userIdHeader: string) {
    const userId = Number(userIdHeader);
    if (!Number.isFinite(userId) || userId <= 0) {
      throw new UnauthorizedException('x-user-id header invalido');
    }

    return this.dashboardService.meDashboard(userId);
  }
}
