import { Body, Controller, Get, Headers, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { getUserIdFromHeader } from '../common/auth/auth.helper';

type CreateApplicationBody = {
  badgeId: number;
};

type AddEvidenceBody = {
  requirementId: number;
  fileName: string;
  storageKey: string;
  fileUrl: string;
  mimeType?: string;
  sizeBytes?: number;
  description?: string;
};

type ReviewBody = {
  comment?: string;
};

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async list() {
    return this.applicationsService.list();
  }

  @Get('mine')
  async mine(@Headers('x-user-id') userIdHeader: string) {
    const userId = getUserIdFromHeader(userIdHeader);
    return this.applicationsService.mine(userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.byId(id);
  }

  @Get(':id/history')
  async history(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.history(id);
  }

  @Post()
  async create(
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: CreateApplicationBody,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.create(userId, body.badgeId);
  }

  @Post(':id/evidences')
  async addEvidence(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: AddEvidenceBody,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.addEvidence(id, userId, body);
  }

  @Post(':id/submit')
  async submit(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.submit(id, userId);
  }

  @Post(':id/approve')
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: ReviewBody,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.approve(id, userId, body.comment);
  }

  @Post(':id/reject')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: Required<Pick<ReviewBody, 'comment'>>,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.reject(id, userId, body.comment);
  }

  @Post(':id/send-back')
  async sendBack(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
    @Body() body: Required<Pick<ReviewBody, 'comment'>>,
  ) {
    const userId = getUserIdFromHeader(userIdHeader);

    return this.applicationsService.sendBack(id, userId, body.comment);
  }
}
