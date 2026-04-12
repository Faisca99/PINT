import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async meDashboard(userId: number) {
    const progressRes = await this.db.query(
      `SELECT *
       FROM v_consultant_badge_progress
       WHERE user_id = $1`,
      [userId],
    );

    const pointsRes = await this.db.query<{ fn_user_points_balance: number }>(
      'SELECT fn_user_points_balance($1)',
      [userId],
    );

    const objectivesRes = await this.db.query(
      `SELECT id, title, description, target_date, completed_at
       FROM consultant_objectives
       WHERE user_id = $1
       ORDER BY target_date ASC
       LIMIT 10`,
      [userId],
    );

    return {
      progress: progressRes.rows[0] ?? null,
      points: pointsRes.rows[0]?.fn_user_points_balance ?? 0,
      objectives: objectivesRes.rows,
    };
  }
}
