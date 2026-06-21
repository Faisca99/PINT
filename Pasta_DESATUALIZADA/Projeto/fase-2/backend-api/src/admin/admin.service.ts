import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UPDATABLE_STRUCTURE_ENTITIES, type StructureEntity } from '../common/constants';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  // ── UTILIZADORES ──────────────────────────────────────────────

  async listUsers() {
    const res = await this.db.query(
      `SELECT u.id, u.full_name, u.email, u.account_status, u.created_at, u.last_login_at,
              r.code AS role, r.name AS role_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
       LEFT JOIN roles r ON r.id = ur.role_id
       LEFT JOIN areas a ON a.id = u.preferred_area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       ORDER BY u.created_at DESC`,
    );
    return res.rows;
  }

  async createUser(data: {
    fullName: string; email: string; password: string;
    roleCode: string; areaId?: number;
  }) {
    const userRes = await this.db.query(
      `INSERT INTO users (full_name, email, password_hash, account_status, email_verified, preferred_area_id)
       VALUES ($1, $2, crypt($3, gen_salt('bf', 10)), 'active', TRUE, $4)
       RETURNING id`,
      [data.fullName, data.email, data.password, data.areaId ?? null],
    );
    const userId = userRes.rows[0].id;

    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE code = $2`,
      [userId, data.roleCode],
    );

    await this.db.query(
      `INSERT INTO user_preferences (user_id) VALUES ($1)`,
      [userId],
    );

    return { id: userId };
  }

  async updateUserRole(userId: number, roleCode: string) {
    await this.db.query(
      `UPDATE user_roles SET is_active = FALSE WHERE user_id = $1`,
      [userId],
    );
    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE code = $2`,
      [userId, roleCode],
    );
    return { ok: true };
  }

  async toggleUserStatus(userId: number, active: boolean) {
    await this.db.query(
      `UPDATE users SET account_status = $1 WHERE id = $2`,
      [active ? 'active' : 'suspended', userId],
    );
    return { ok: true };
  }

  // ── BADGES ────────────────────────────────────────────────────

  async listBadges() {
    const res = await this.db.query(
      `SELECT b.id, b.code, b.name, b.description, b.badge_type, b.points,
              b.has_expiration, b.valid_days, b.is_active,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM badges b
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       ORDER BY b.created_at DESC`,
    );
    return res.rows;
  }

  async createBadge(data: {
    levelId: number; code: string; name: string; description?: string;
    badgeType: string; points: number; hasExpiration: boolean; validDays?: number;
  }) {
    const res = await this.db.query(
      `INSERT INTO badges (level_id, code, name, description, badge_type, points, has_expiration, valid_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [data.levelId, data.code, data.name, data.description ?? null,
       data.badgeType, data.points, data.hasExpiration, data.validDays ?? null],
    );
    return { id: res.rows[0].id };
  }

  async updateBadge(id: number, data: {
    name?: string; description?: string; points?: number;
    hasExpiration?: boolean; validDays?: number; isActive?: boolean;
  }) {
    await this.db.query(
      `UPDATE badges SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         points = COALESCE($3, points),
         has_expiration = COALESCE($4, has_expiration),
         valid_days = COALESCE($5, valid_days),
         is_active = COALESCE($6, is_active),
         updated_at = NOW()
       WHERE id = $7`,
      [data.name, data.description, data.points,
       data.hasExpiration, data.validDays, data.isActive, id],
    );
    return { ok: true };
  }

  // ── ESTRUTURA (LP / SL / ÁREAS / NÍVEIS / REQUISITOS) ────────

  async getStructure() {
    const [lps, sls, areas, levels, reqs] = await Promise.all([
      this.db.query(`SELECT * FROM learning_paths WHERE is_active = TRUE ORDER BY name`),
      this.db.query(`SELECT sl.*, lp.name AS learning_path_name FROM service_lines sl JOIN learning_paths lp ON lp.id = sl.learning_path_id WHERE sl.is_active = TRUE ORDER BY sl.name`),
      this.db.query(`SELECT a.*, sl.name AS service_line_name FROM areas a JOIN service_lines sl ON sl.id = a.service_line_id WHERE a.is_active = TRUE ORDER BY a.name`),
      this.db.query(`SELECT l.*, a.name AS area_name FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.is_active = TRUE ORDER BY l.area_id, l.rank_order`),
      this.db.query(`SELECT r.*, l.code AS level_code, l.name AS level_name FROM requirements r JOIN levels l ON l.id = r.level_id WHERE r.is_active = TRUE ORDER BY r.level_id, r.display_order`),
    ]);
    return {
      learning_paths: lps.rows,
      service_lines: sls.rows,
      areas: areas.rows,
      levels: levels.rows,
      requirements: reqs.rows,
    };
  }

  async createRequirement(data: {
    levelId: number; code: string; title: string;
    description?: string; evidenceInstructions?: string; displayOrder: number;
  }) {
    const res = await this.db.query(
      `INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [data.levelId, data.code, data.title, data.description ?? null,
       data.evidenceInstructions ?? null, data.displayOrder],
    );
    return { id: res.rows[0].id };
  }

  async listNotices() {
    const res = await this.db.query(
      `SELECT id, title, content, target_roles, is_active, starts_at, ends_at, created_at
       FROM info_notices ORDER BY created_at DESC`,
    );
    return res.rows;
  }

  async listActiveNotices(userRole?: string) {
    const res = await this.db.query(
      `SELECT id, title, content, target_roles, starts_at, ends_at, created_at
       FROM info_notices
       WHERE is_active = TRUE
         AND starts_at <= NOW()
         AND (ends_at IS NULL OR ends_at >= NOW())
       ORDER BY created_at DESC`,
    );
    // Filtrar por role se necessário
    if (userRole) {
      return res.rows.filter((n: any) =>
        !n.target_roles || n.target_roles.length === 0 || n.target_roles.includes(userRole)
      );
    }
    return res.rows;
  }

  async createNotice(data: { title: string; content: string; targetRoles?: string[]; startsAt: string; endsAt?: string; createdBy: number }) {
    const res = await this.db.query(
      `INSERT INTO info_notices (created_by_user_id, title, content, target_roles, is_active, starts_at, ends_at)
       VALUES ($1, $2, $3, $4, TRUE, $5, $6) RETURNING id`,
      [data.createdBy, data.title, data.content, data.targetRoles ?? null, data.startsAt, data.endsAt ?? null],
    );
    return { id: res.rows[0].id };
  }

  async toggleNotice(id: number, active: boolean) {
    await this.db.query(`UPDATE info_notices SET is_active = $1 WHERE id = $2`, [active, id]);
    return { ok: true };
  }

  async deleteNotice(id: number) {
    await this.db.query(`DELETE FROM info_notices WHERE id = $1`, [id]);
    return { ok: true };
  }

  async toggleEntity(entity: StructureEntity, id: number, active: boolean) {
    // Validação explícita contra lista de entidades permitidas (evita SQL injection)
    if (!UPDATABLE_STRUCTURE_ENTITIES.includes(entity)) {
      throw new BadRequestException(`Entidade inválida: ${entity}`);
    }
    await this.db.query(
      `UPDATE ${entity} SET is_active = $1 WHERE id = $2`,
      [active, id],
    );
    return { ok: true };
  }

  async createLearningPath(data: { code: string; name: string; description?: string }) {
    const res = await this.db.query(
      `INSERT INTO learning_paths (code, name, description, is_active) VALUES ($1, $2, $3, TRUE) RETURNING id`,
      [data.code, data.name, data.description ?? null],
    );
    return { id: res.rows[0].id };
  }

  async createServiceLine(data: { learningPathId: number; code: string; name: string; description?: string }) {
    const res = await this.db.query(
      `INSERT INTO service_lines (learning_path_id, code, name, description, is_active) VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
      [data.learningPathId, data.code, data.name, data.description ?? null],
    );
    return { id: res.rows[0].id };
  }

  async createArea(data: { serviceLineId: number; code: string; name: string; description?: string }) {
    const res = await this.db.query(
      `INSERT INTO areas (service_line_id, code, name, description, is_active) VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
      [data.serviceLineId, data.code, data.name, data.description ?? null],
    );
    return { id: res.rows[0].id };
  }

  async createLevel(data: { areaId: number; code: string; name: string; rankOrder: number; description?: string }) {
    const res = await this.db.query(
      `INSERT INTO levels (area_id, code, name, rank_order, description, is_active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id`,
      [data.areaId, data.code, data.name, data.rankOrder, data.description ?? null],
    );
    return { id: res.rows[0].id };
  }

  async listSlas() {
    const res = await this.db.query(
      `SELECT sp.id, sp.team_type, sp.limit_hours, sp.warning_at_percent, sp.is_active, sp.created_at,
              u.full_name AS created_by_name
       FROM sla_policies sp
       LEFT JOIN users u ON u.id = sp.created_by_user_id
       ORDER BY sp.team_type`,
    );
    return res.rows;
  }

  async createSla(data: { createdBy: number; teamType: string; limitHours: number; warningAtPercent: number }) {
    const res = await this.db.query(
      `INSERT INTO sla_policies (created_by_user_id, team_type, limit_hours, warning_at_percent, is_active)
       VALUES ($1, $2, $3, $4, TRUE) RETURNING id`,
      [data.createdBy, data.teamType, data.limitHours, data.warningAtPercent],
    );
    return { id: res.rows[0].id };
  }

  async toggleSla(id: number, active: boolean) {
    await this.db.query(`UPDATE sla_policies SET is_active = $1 WHERE id = $2`, [active, id]);
    return { ok: true };
  }

  async getIntegrations() {
    const res = await this.db.query(`SELECT id, provider, config, is_active FROM integration_configs ORDER BY provider`);
    return res.rows;
  }

  async saveIntegration(provider: string, webhookUrl: string, active: boolean) {
    const existing = await this.db.query(`SELECT id FROM integration_configs WHERE provider = $1`, [provider]);
    if (existing.rows[0]) {
      await this.db.query(
        `UPDATE integration_configs SET config = $1, is_active = $2 WHERE provider = $3`,
        [JSON.stringify({ webhook_url: webhookUrl }), active, provider],
      );
    } else {
      await this.db.query(
        `INSERT INTO integration_configs (provider, config, is_active) VALUES ($1, $2, $3)`,
        [provider, JSON.stringify({ webhook_url: webhookUrl }), active],
      );
    }
    return { ok: true };
  }

  async listRgpdPolicies() {
    const res = await this.db.query(`SELECT id, version, content, is_current, effective_from, created_at FROM rgpd_policies ORDER BY created_at DESC`);
    return res.rows;
  }

  async createRgpdPolicy(data: { version: string; content: string; effectiveFrom: string }) {
    await this.db.query(`UPDATE rgpd_policies SET is_current = FALSE WHERE is_current = TRUE`);
    const res = await this.db.query(
      `INSERT INTO rgpd_policies (version, content, is_current, effective_from) VALUES ($1, $2, TRUE, $3) RETURNING id`,
      [data.version, data.content, data.effectiveFrom],
    );
    return { id: res.rows[0].id };
  }

  async listLearningPaths() {
    const res = await this.db.query(`SELECT id, code, name, description FROM learning_paths WHERE is_active = TRUE ORDER BY name`);
    return res.rows;
  }

  async listServiceLines() {
    const res = await this.db.query(
      `SELECT sl.id, sl.code, sl.name, sl.learning_path_id, lp.name AS learning_path_name
       FROM service_lines sl JOIN learning_paths lp ON lp.id = sl.learning_path_id
       WHERE sl.is_active = TRUE ORDER BY sl.name`,
    );
    return res.rows;
  }

  async listRoles() {
    const res = await this.db.query(`SELECT id, code, name FROM roles ORDER BY name`);
    return res.rows;
  }

  async listAreas() {
    const res = await this.db.query(
      `SELECT a.id, a.name, a.code, sl.name AS service_line_name
       FROM areas a JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE a.is_active = TRUE ORDER BY a.name`,
    );
    return res.rows;
  }

  async listLevels() {
    const res = await this.db.query(
      `SELECT l.id, l.code, l.name, l.rank_order, a.name AS area_name
       FROM levels l JOIN areas a ON a.id = l.area_id
       WHERE l.is_active = TRUE ORDER BY a.name, l.rank_order`,
    );
    return res.rows;
  }
}
