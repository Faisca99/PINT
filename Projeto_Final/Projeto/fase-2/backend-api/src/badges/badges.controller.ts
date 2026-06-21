import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BadgesService } from './badges.service';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  async list() {
    return this.badgesService.list();
  }

  @Get(':id')
  async byId(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.byId(id);
  }
}
