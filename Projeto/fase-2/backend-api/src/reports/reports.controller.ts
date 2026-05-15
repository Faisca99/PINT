import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('applications')
  async applications(
    @Query('status') status?: string,
    @Query('area') areaName?: string,
    @Query('service_line') serviceLineName?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.applications({ status, areaName, serviceLineName, from, to });
  }

  @Get('summary')
  async summary() {
    return this.reportsService.summary();
  }

  @Get('kpis')
  async kpis() {
    return this.reportsService.kpis();
  }

  @Get('badges')
  async badgesList() {
    return this.reportsService.badgesList();
  }
}
