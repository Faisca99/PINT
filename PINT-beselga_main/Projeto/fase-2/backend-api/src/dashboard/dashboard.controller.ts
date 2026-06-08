import { Body, Controller, Get, Post, Param, ParseIntPipe, Headers, NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { getUserIdFromHeader } from '../common/auth/auth.helper';

@Controller('me')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  private getUserId(header: string): number {
    return getUserIdFromHeader(header);
  }

  @Get('dashboard')
  async meDashboard(@Headers('x-user-id') h: string) {
    return this.dashboardService.meDashboard(this.getUserId(h));
  }

  @Get('badges')
  async myBadges(@Headers('x-user-id') h: string) {
    return this.dashboardService.myBadges(this.getUserId(h));
  }

  @Get('recommendations')
  async recommendations(@Headers('x-user-id') h: string) {
    return this.dashboardService.recommendations(this.getUserId(h));
  }

  @Get('timeline')
  async timeline(@Headers('x-user-id') h: string) {
    return this.dashboardService.timeline(this.getUserId(h));
  }

  @Get('timeline/:userId')
  async timelineForUser(@Param('userId', ParseIntPipe) userId: number) {
    const [events, consultant] = await Promise.all([
      this.dashboardService.timeline(userId),
      this.dashboardService.getUserName(userId),
    ]);
    if (!consultant) throw new NotFoundException('Consultor não encontrado');
    return { events, consultant };
  }

  @Get('reminders')
  async getReminders(@Headers('x-user-id') h: string) {
    return this.dashboardService.getReminders(this.getUserId(h));
  }

  @Post('reminders')
  async createReminder(@Headers('x-user-id') h: string, @Body() body: any) {
    return this.dashboardService.createReminder(this.getUserId(h), {
      title: body.title,
      message: body.message,
      scheduledFor: body.scheduled_for,
    });
  }

  @Post('reminders/:id/dismiss')
  async dismissReminder(@Headers('x-user-id') h: string, @Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.dismissReminder(this.getUserId(h), id);
  }

  @Get('achievements')
  async achievements(@Headers('x-user-id') h: string) {
    const userId = this.getUserId(h);
    await this.dashboardService.checkAndAwardAchievements(userId);
    return this.dashboardService.achievements(userId);
  }

  @Post('achievements/celebrate')
  async celebrateAchievements(@Headers('x-user-id') h: string) {
    return this.dashboardService.markAchievementsCelebrated(this.getUserId(h));
  }

  @Get('leaderboard')
  async leaderboard() {
    return this.dashboardService.leaderboard();
  }

  @Get('notifications')
  async notifications(@Headers('x-user-id') h: string) {
    return this.dashboardService.notifications(this.getUserId(h));
  }

  @Post('notifications/read')
  async markRead(@Headers('x-user-id') h: string) {
    return this.dashboardService.markNotificationsRead(this.getUserId(h));
  }

  @Get('gallery/:userId')
  async publicGallery(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.dashboardService.publicGallery(userId);
    if (!result) throw new NotFoundException('Consultor não encontrado');
    return result;
  }

  @Post('badges/:id/publish')
  async publishBadge(@Param('id', ParseIntPipe) badgeId: number, @Headers('x-user-id') h: string) {
    return this.dashboardService.acceptRgpdAndPublish(this.getUserId(h), badgeId);
  }

  @Get('verify/:token')
  async verifyBadge(@Param('token') token: string) {
    const result = await this.dashboardService.verifyBadge(token);
    if (!result) throw new NotFoundException('Badge não encontrado ou token inválido');
    return result;
  }
}
