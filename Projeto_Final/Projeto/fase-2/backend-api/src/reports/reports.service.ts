import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class ReportsService {
  constructor(private readonly db: DatabaseService) {}

  async applications(filters: {
    status?: string;
    areaName?: string;
    serviceLineName?: string;
    from?: string;
    to?: string;
  }) {
    const conditions: string[] = [];
    const params: any[] = [];
    let i = 1;

    if (filters.status) {
      conditions.push(`ba.status = $${i++}`);
      params.push(filters.status);
    }
    if (filters.areaName) {
      conditions.push(`a.name ILIKE $${i++}`);
      params.push(`%${filters.areaName}%`);
    }
    if (filters.serviceLineName) {
      conditions.push(`sl.name = $${i++}`);
      params.push(filters.serviceLineName);
    }
    if (filters.from) {
      conditions.push(`ba.created_at >= $${i++}`);
      params.push(filters.from);
    }
    if (filters.to) {
      conditions.push(`ba.created_at <= $${i++}`);
      params.push(filters.to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const res = await this.db.query(
      `SELECT ba.id, ba.status, ba.final_result,
              ba.created_at, ba.submitted_at, ba.closed_at,
              u.full_name AS applicant_name, u.email AS applicant_email,
              b.name AS badge_name, b.badge_type, b.points,
              l.code AS level_code,
              a.name AS area_name,
              sl.name AS service_line_name
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       ${where}
       ORDER BY ba.created_at DESC`,
      params,
    );

    return res.rows;
  }

  async summary() {
    const res = await this.db.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'submitted') AS pending_tm,
         COUNT(*) FILTER (WHERE status = 'in_validation') AS pending_sll,
         COUNT(*) FILTER (WHERE status = 'closed' AND final_result = 'approved') AS approved,
         COUNT(*) FILTER (WHERE status = 'closed' AND final_result = 'rejected') AS rejected,
         COUNT(*) AS total
       FROM badge_applications`,
    );
    return res.rows[0];
  }

  async badgesList() {
    const res = await this.db.query(
      `SELECT b.id, b.code, b.name, b.description, b.badge_type, b.points,
              b.has_expiration, b.valid_days, b.is_active,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name, lp.name AS learning_path,
              COUNT(ub.id) AS total_awarded
       FROM badges b
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       LEFT JOIN learning_paths lp ON lp.id = sl.learning_path_id
       LEFT JOIN user_badges ub ON ub.badge_id = b.id
       GROUP BY b.id, l.code, l.name, a.name, sl.name, lp.name
       ORDER BY b.is_active DESC, b.name`,
    );
    return res.rows;
  }

  /**
   * Badges atribuídos que estão próximos da data de expiração (ou já expirados
   * recentemente). Usado pelo Talent Manager / Service Line Leader.
   * @param days janela de aviso em dias (default 30)
   * @param serviceLineName filtra pela service line (para o SLL)
   */
  async expiring(days = 30, serviceLineName?: string) {
    const params: any[] = [days];
    let slFilter = '';
    if (serviceLineName) {
      params.push(serviceLineName);
      slFilter = `AND sl.name = $${params.length}`;
    }

    const res = await this.db.query(
      `SELECT ub.id, ub.awarded_at, ub.expires_at,
              (ub.expires_at::date - CURRENT_DATE) AS days_left,
              u.full_name AS consultant_name, u.email AS consultant_email,
              b.name AS badge_name, l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM user_badges ub
       JOIN users u ON u.id = ub.user_id
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE ub.expires_at IS NOT NULL
         AND ub.expires_at <= NOW() + ($1 || ' days')::interval
         ${slFilter}
       ORDER BY ub.expires_at ASC`,
      params,
    );
    return res.rows;
  }

  async kpis() {
    // % badges aprovados por mês (últimos 12 meses)
    const monthlyRes = await this.db.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', closed_at), 'YYYY-MM') AS month,
         COUNT(*) FILTER (WHERE final_result = 'approved') AS approved,
         COUNT(*) AS total
       FROM badge_applications
       WHERE status = 'closed'
         AND closed_at >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', closed_at)
       ORDER BY DATE_TRUNC('month', closed_at)`,
    );

    // # badges por Learning Path
    const byLpRes = await this.db.query(
      `SELECT lp.name AS learning_path,
              COUNT(ba.id) FILTER (WHERE ba.final_result = 'approved') AS approved_count
       FROM learning_paths lp
       JOIN service_lines sl ON sl.learning_path_id = lp.id
       JOIN areas a ON a.service_line_id = sl.id
       JOIN levels lv ON lv.area_id = a.id
       JOIN badges b ON b.level_id = lv.id
       LEFT JOIN badge_applications ba ON ba.badge_id = b.id AND ba.status = 'closed'
       GROUP BY lp.id, lp.name
       ORDER BY approved_count DESC`,
    );

    // # badges por nível (A/B/C/D/E)
    const byLevelRes = await this.db.query(
      `SELECT lv.code AS level_code, lv.name AS level_name,
              COUNT(ba.id) FILTER (WHERE ba.final_result = 'approved') AS approved_count
       FROM levels lv
       JOIN badges b ON b.level_id = lv.id
       LEFT JOIN badge_applications ba ON ba.badge_id = b.id AND ba.status = 'closed'
       GROUP BY lv.code, lv.name
       ORDER BY lv.code`,
    );

    // # utilizadores registados (total e por role)
    const usersRes = await this.db.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE r.code = 'consultant') AS consultants,
         COUNT(*) FILTER (WHERE r.code = 'talent_manager') AS talent_managers,
         COUNT(*) FILTER (WHERE r.code = 'service_line_leader') AS service_line_leaders,
         COUNT(*) FILTER (WHERE r.code = 'admin') AS admins
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
       LEFT JOIN roles r ON r.id = ur.role_id
       WHERE u.account_status = 'active'`,
    );

    return {
      monthly: monthlyRes.rows,
      by_learning_path: byLpRes.rows,
      by_level: byLevelRes.rows,
      users: usersRes.rows[0],
    };
  }
}
