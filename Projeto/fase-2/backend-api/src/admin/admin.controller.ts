import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Utilizadores
  @Get('users')
  listUsers() { return this.adminService.listUsers(); }

  @Post('users')
  createUser(@Body() body: any) {
    return this.adminService.createUser({
      fullName: body.full_name, email: body.email, password: body.password,
      roleCode: body.role_code, areaId: body.area_id,
    });
  }

  @Patch('users/:id/role')
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() body: { role_code: string }) {
    return this.adminService.updateUserRole(id, body.role_code);
  }

  @Patch('users/:id/status')
  toggleStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    return this.adminService.toggleUserStatus(id, body.active);
  }

  // Badges
  @Get('badges')
  listBadges() { return this.adminService.listBadges(); }

  @Post('badges')
  createBadge(@Body() body: any) {
    return this.adminService.createBadge({
      levelId: body.level_id, code: body.code, name: body.name,
      description: body.description, badgeType: body.badge_type ?? 'level',
      points: body.points ?? 0, hasExpiration: body.has_expiration ?? false,
      validDays: body.valid_days,
    });
  }

  @Patch('badges/:id')
  updateBadge(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.adminService.updateBadge(id, {
      name: body.name, description: body.description, points: body.points,
      hasExpiration: body.has_expiration, validDays: body.valid_days, isActive: body.is_active,
    });
  }

  // Avisos
  @Get('notices')
  listNotices() { return this.adminService.listNotices(); }

  @Get('notices/active')
  listActiveNotices(@Query('role') role?: string) {
    return this.adminService.listActiveNotices(role);
  }

  @Post('notices')
  createNotice(@Headers('x-user-id') h: string, @Body() body: any) {
    const userId = Number(h);
    if (!Number.isFinite(userId) || userId <= 0) throw new UnauthorizedException();
    return this.adminService.createNotice({
      title: body.title, content: body.content,
      targetRoles: body.target_roles, startsAt: body.starts_at,
      endsAt: body.ends_at, createdBy: userId,
    });
  }

  @Patch('notices/:id/status')
  toggleNotice(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    return this.adminService.toggleNotice(id, body.active);
  }

  @Delete('notices/:id')
  deleteNotice(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteNotice(id);
  }

  // Estrutura
  @Get('structure')
  getStructure() { return this.adminService.getStructure(); }

  @Get('roles')
  listRoles() { return this.adminService.listRoles(); }

  @Get('areas')
  listAreas() { return this.adminService.listAreas(); }

  @Get('levels')
  listLevels() { return this.adminService.listLevels(); }

  @Get('learning-paths')
  listLPs() { return this.adminService.listLearningPaths(); }

  @Get('service-lines')
  listSLs() { return this.adminService.listServiceLines(); }

  @Patch('structure/:entity/:id/status')
  toggleEntity(
    @Param('entity') entity: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { active: boolean },
  ) {
    const allowed = ['learning_paths', 'service_lines', 'areas', 'levels', 'requirements'];
    if (!allowed.includes(entity)) throw new Error('Entidade inválida');
    return this.adminService.toggleEntity(entity as any, id, body.active);
  }

  @Post('learning-paths')
  createLP(@Body() body: any) {
    return this.adminService.createLearningPath({ code: body.code, name: body.name, description: body.description });
  }

  @Post('service-lines')
  createSL(@Body() body: any) {
    return this.adminService.createServiceLine({ learningPathId: body.learning_path_id, code: body.code, name: body.name, description: body.description });
  }

  @Post('areas')
  createArea(@Body() body: any) {
    return this.adminService.createArea({ serviceLineId: body.service_line_id, code: body.code, name: body.name, description: body.description });
  }

  @Post('levels')
  createLevel(@Body() body: any) {
    return this.adminService.createLevel({ areaId: body.area_id, code: body.code, name: body.name, rankOrder: body.rank_order, description: body.description });
  }

  // SLAs
  @Get('slas')
  listSlas() { return this.adminService.listSlas(); }

  @Post('slas')
  createSla(@Headers('x-user-id') h: string, @Body() body: any) {
    const userId = Number(h);
    if (!Number.isFinite(userId) || userId <= 0) throw new UnauthorizedException();
    return this.adminService.createSla({
      createdBy: userId,
      teamType: body.team_type,
      limitHours: body.limit_hours,
      warningAtPercent: body.warning_at_percent ?? 80,
    });
  }

  @Patch('slas/:id/status')
  toggleSla(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    return this.adminService.toggleSla(id, body.active);
  }

  // Integrações Teams/Slack
  @Get('integrations')
  getIntegrations() { return this.adminService.getIntegrations(); }

  @Post('integrations')
  saveIntegration(@Body() body: { provider: string; webhook_url: string; active: boolean }) {
    return this.adminService.saveIntegration(body.provider, body.webhook_url, body.active);
  }

  // RGPD
  @Get('rgpd')
  listRgpd() { return this.adminService.listRgpdPolicies(); }

  @Post('rgpd')
  createRgpd(@Body() body: any) {
    return this.adminService.createRgpdPolicy({ version: body.version, content: body.content, effectiveFrom: body.effective_from });
  }

  @Post('requirements')
  createRequirement(@Body() body: any) {
    return this.adminService.createRequirement({
      levelId: body.level_id, code: body.code, title: body.title,
      description: body.description, evidenceInstructions: body.evidence_instructions,
      displayOrder: body.display_order,
    });
  }
}
