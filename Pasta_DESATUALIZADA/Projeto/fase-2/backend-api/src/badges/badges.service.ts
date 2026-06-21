import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class BadgesService {
  constructor(private readonly db: DatabaseService) {}

  async list() {
    const res = await this.db.query(
      `SELECT b.id, b.code, b.name, b.description, b.badge_type, b.points,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name, lp.name AS learning_path_name
       FROM badges b
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       LEFT JOIN learning_paths lp ON lp.id = sl.learning_path_id
       WHERE b.is_active = TRUE
       ORDER BY b.name`,
    );

    return res.rows;
  }

  async byId(id: number) {
    const badgeRes = await this.db.query(
      `SELECT b.id, b.code, b.name, b.description, b.badge_type, b.points,
              b.has_expiration, b.valid_days, b.has_completion_deadline, b.completion_days,
              l.id AS level_id, l.code AS level_code, l.name AS level_name,
              a.id AS area_id, a.name AS area_name,
              sl.id AS service_line_id, sl.name AS service_line_name,
              lp.id AS learning_path_id, lp.name AS learning_path_name
       FROM badges b
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       LEFT JOIN learning_paths lp ON lp.id = sl.learning_path_id
       WHERE b.id = $1`,
      [id],
    );

    const requirementsRes = await this.db.query(
      `SELECT r.id, r.code, r.title, r.description, r.evidence_instructions, r.display_order
       FROM requirements r
       JOIN levels l ON l.id = r.level_id
       JOIN badges b ON b.level_id = l.id
       WHERE b.id = $1
       ORDER BY r.display_order`,
      [id],
    );

    return {
      badge: badgeRes.rows[0] ?? null,
      requirements: requirementsRes.rows,
    };
  }
}
