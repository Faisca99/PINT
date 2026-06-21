import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async list() {
    const res = await this.db.query(
      `SELECT u.id, u.full_name, u.email, u.account_status,
              u.created_at, u.last_login_at,
              r.code AS role,
              a.name AS area_name,
              sl.name AS service_line_name,
              COUNT(DISTINCT ub.id) AS badge_count,
              COALESCE(SUM(pt.points_delta), 0) AS total_points
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
       LEFT JOIN roles r ON r.id = ur.role_id
       LEFT JOIN areas a ON a.id = u.preferred_area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       LEFT JOIN user_badges ub ON ub.user_id = u.id
       LEFT JOIN point_transactions pt ON pt.user_id = u.id
       WHERE u.account_status = 'active'
       GROUP BY u.id, u.full_name, u.email, u.account_status,
                u.created_at, u.last_login_at, r.code, a.name, sl.name
       ORDER BY u.full_name`,
    );
    return res.rows;
  }
}
