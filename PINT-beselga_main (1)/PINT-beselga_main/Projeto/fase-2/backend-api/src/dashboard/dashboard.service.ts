import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getReminders(userId: number) {
    const res = await this.db.query(
      `SELECT id, title, message, related_entity, scheduled_for, sent_at, dismissed_at
       FROM reminders
       WHERE user_id = $1
       ORDER BY scheduled_for ASC`,
      [userId],
    );
    return res.rows;
  }

  async createReminder(userId: number, data: { title: string; message: string; scheduledFor: string }) {
    const res = await this.db.query(
      `INSERT INTO reminders (user_id, title, message, scheduled_for)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, data.title, data.message, data.scheduledFor],
    );
    return { id: res.rows[0].id };
  }

  async dismissReminder(userId: number, reminderId: number) {
    await this.db.query(
      `UPDATE reminders SET dismissed_at = NOW() WHERE id = $1 AND user_id = $2`,
      [reminderId, userId],
    );
    return { ok: true };
  }

  async getUserName(userId: number) {
    const res = await this.db.query<{ full_name: string; email: string }>(
      `SELECT full_name, email FROM users WHERE id = $1`,
      [userId],
    );
    return res.rows[0] ?? null;
  }

  async timeline(userId: number) {
    // Combina candidaturas + badges atribuídos + conquistas numa timeline cronológica
    const res = await this.db.query(
      `SELECT 'application' AS event_type,
              ba.id, ba.status, ba.final_result,
              ba.created_at AS occurred_at,
              ba.submitted_at, ba.closed_at,
              b.name AS badge_name,
              l.code AS level_code
       FROM badge_applications ba
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       WHERE ba.applicant_user_id = $1

       UNION ALL

       SELECT 'badge_earned' AS event_type,
              ub.id, 'closed' AS status, 'approved' AS final_result,
              ub.awarded_at AS occurred_at,
              ub.awarded_at AS submitted_at,
              ub.awarded_at AS closed_at,
              b.name AS badge_name,
              l.code AS level_code
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       WHERE ub.user_id = $1

       UNION ALL

       SELECT 'achievement' AS event_type,
              ua.id, 'closed' AS status, 'approved' AS final_result,
              ua.awarded_at AS occurred_at,
              ua.awarded_at AS submitted_at,
              ua.awarded_at AS closed_at,
              ad.name AS badge_name,
              NULL AS level_code
       FROM user_achievements ua
       JOIN achievement_definitions ad ON ad.id = ua.achievement_definition_id
       WHERE ua.user_id = $1

       ORDER BY occurred_at DESC
       LIMIT 50`,
      [userId],
    );
    return res.rows;
  }

  async achievements(userId: number) {
    // Todas as definições de conquistas
    const defsRes = await this.db.query(
      `SELECT ad.id, ad.code, ad.name, ad.description, ad.points_bonus,
              ua.awarded_at, ua.celebrated
       FROM achievement_definitions ad
       LEFT JOIN user_achievements ua ON ua.achievement_definition_id = ad.id AND ua.user_id = $1
       WHERE ad.is_active = TRUE
       ORDER BY ua.awarded_at DESC NULLS LAST, ad.id`,
      [userId],
    );
    return defsRes.rows;
  }

  async checkAndAwardAchievements(userId: number) {
    try {
    const badgeCount = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) FROM user_badges WHERE user_id = $1`,
      [userId],
    );
    const count = parseInt(badgeCount.rows[0]?.count ?? '0', 10);

    let totalPoints = 0;
    try {
      const points = await this.db.query<{ fn_user_points_balance: number }>(
        `SELECT fn_user_points_balance($1)`, [userId],
      );
      totalPoints = points.rows[0]?.fn_user_points_balance ?? 0;
    } catch { /* function may not exist */ }

    // Verificar cada conquista baseada em regra simples
    const defs = await this.db.query(
      `SELECT id, code, rule_config, points_bonus FROM achievement_definitions WHERE is_active = TRUE`,
    );

    for (const def of defs.rows) {
      const already = await this.db.query(
        `SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_definition_id = $2`,
        [userId, def.id],
      );
      if (already.rows.length > 0) continue;

      const rule = def.rule_config ?? {};
      let earned = false;

      if (rule.min_badges && count >= rule.min_badges) earned = true;
      if (rule.min_points && totalPoints >= rule.min_points) earned = true;

      if (earned) {
        await this.db.query(
          `INSERT INTO user_achievements (user_id, achievement_definition_id, trigger_context, celebrated)
           VALUES ($1, $2, $3, FALSE)`,
          [userId, def.id, JSON.stringify({ badge_count: count, points: totalPoints })],
        );

        const currentBalance = await this.db.query<{ fn_user_points_balance: number }>(
          `SELECT fn_user_points_balance($1)`, [userId],
        );
        const balance = currentBalance.rows[0]?.fn_user_points_balance ?? 0;

        if (def.points_bonus > 0) {
          await this.db.query(
            `INSERT INTO point_transactions (user_id, achievement_id, transaction_type, points_delta, balance_after, note, occurred_at)
             VALUES ($1, $2, 'achievement_bonus', $3, $4, $5, NOW())`,
            [userId, def.id, def.points_bonus, balance + def.points_bonus, `Conquista: ${def.code}`],
          );
        }

        await this.db.query(
          `INSERT INTO notifications (user_id, type, title, message, payload, sent_at)
           VALUES ($1, 'badge_awarded', 'Conquista desbloqueada!', $2, $3, NOW())`,
          [userId, `Desbloqueaste uma nova conquista!`, JSON.stringify({ achievement_id: def.id })],
        );
      }
    }
    } catch { /* achievements check failed gracefully */ }
  }

  async recommendations(userId: number) {
    // Encontrar o nível máximo obtido em cada área e recomendar o próximo nível
    const res = await this.db.query(
      `WITH earned AS (
         SELECT l.area_id, MAX(l.rank_order) AS max_rank
         FROM user_badges ub
         JOIN badges b ON b.id = ub.badge_id
         JOIN levels l ON l.id = b.level_id
         WHERE ub.user_id = $1
         GROUP BY l.area_id
       ),
       next_levels AS (
         SELECT l.id AS level_id, l.code AS level_code, l.name AS level_name,
                a.id AS area_id, a.name AS area_name, sl.name AS service_line_name,
                e.max_rank
         FROM earned e
         JOIN levels l ON l.area_id = e.area_id AND l.rank_order = e.max_rank + 1 AND l.is_active = TRUE
         JOIN areas a ON a.id = l.area_id
         JOIN service_lines sl ON sl.id = a.service_line_id
       )
       SELECT b.id, b.name AS badge_name, b.description, b.points,
              nl.level_code, nl.level_name, nl.area_name, nl.service_line_name
       FROM next_levels nl
       JOIN badges b ON b.level_id = nl.level_id AND b.is_active = TRUE
       LIMIT 6`,
      [userId],
    );

    // Se não tiver nenhum badge ainda, recomendar nível A de cada área
    if (res.rows.length === 0) {
      const fallback = await this.db.query(
        `SELECT b.id, b.name AS badge_name, b.description, b.points,
                l.code AS level_code, l.name AS level_name,
                a.name AS area_name, sl.name AS service_line_name
         FROM badges b
         JOIN levels l ON l.id = b.level_id AND l.rank_order = 1 AND l.is_active = TRUE
         JOIN areas a ON a.id = l.area_id
         JOIN service_lines sl ON sl.id = a.service_line_id
         WHERE b.is_active = TRUE
         LIMIT 6`,
      );
      return fallback.rows;
    }

    return res.rows;
  }

  async myBadges(userId: number) {
    const res = await this.db.query(
      `SELECT ub.id, ub.awarded_at, ub.expires_at, ub.is_published, ub.public_token,
              b.id AS badge_id, b.name AS badge_name, b.description, b.badge_type, b.points,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE ub.user_id = $1
       ORDER BY ub.awarded_at DESC`,
      [userId],
    );
    return res.rows;
  }

  async publicGallery(userId: number) {
    const userRes = await this.db.query<{ full_name: string; email: string }>(
      `SELECT full_name, email FROM users WHERE id = $1 AND account_status = 'active'`,
      [userId],
    );
    if (!userRes.rows[0]) return null;

    const badgesRes = await this.db.query(
      `SELECT ub.id, ub.awarded_at, ub.expires_at, ub.public_token, ub.points_awarded,
              b.name AS badge_name, b.description, b.badge_type, b.points,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM user_badges ub
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE ub.user_id = $1 AND ub.is_published = TRUE
       ORDER BY ub.awarded_at DESC`,
      [userId],
    );

    return {
      consultant: userRes.rows[0],
      badges: badgesRes.rows,
    };
  }

  async acceptRgpdAndPublish(userId: number, userBadgeId: number) {
    await this.db.query(
      `UPDATE user_badges SET is_published = TRUE, rgpd_accepted = TRUE, rgpd_accepted_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [userBadgeId, userId],
    );
    return { ok: true };
  }

  async verifyBadge(token: string) {
    const res = await this.db.query(
      `SELECT ub.awarded_at, ub.expires_at, ub.points_awarded,
              u.full_name AS consultant_name,
              b.name AS badge_name, b.description AS badge_description,
              b.badge_type, b.points,
              l.code AS level_code, l.name AS level_name,
              a.name AS area_name, sl.name AS service_line_name
       FROM user_badges ub
       JOIN users u ON u.id = ub.user_id
       JOIN badges b ON b.id = ub.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE ub.public_token = $1`,
      [token],
    );
    if (!res.rows[0]) return null;
    return res.rows[0];
  }

  async notifications(userId: number) {
    const res = await this.db.query(
      `SELECT id, type, title, message, is_read, sent_at, payload
       FROM notifications
       WHERE user_id = $1
       ORDER BY sent_at DESC
       LIMIT 30`,
      [userId],
    );
    return res.rows;
  }

  async markNotificationsRead(userId: number) {
    await this.db.query(
      `UPDATE notifications SET is_read = TRUE, read_at = NOW()
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId],
    );
    return { ok: true };
  }

  async leaderboard() {
    const res = await this.db.query(
      `SELECT u.id, u.full_name,
              COALESCE(SUM(pt.points_delta), 0) AS total_points,
              COUNT(DISTINCT ub.id) AS badge_count
       FROM users u
       LEFT JOIN point_transactions pt ON pt.user_id = u.id
       LEFT JOIN user_badges ub ON ub.user_id = u.id
       WHERE u.account_status = 'active'
       GROUP BY u.id, u.full_name
       ORDER BY total_points DESC
       LIMIT 50`,
    );
    return res.rows;
  }

  async meDashboard(userId: number) {
    let points = 0;
    let objectives: any[] = [];
    let badge_count = 0;

    try {
      const pointsRes = await this.db.query<{ fn_user_points_balance: number }>(
        'SELECT fn_user_points_balance($1)',
        [userId],
      );
      points = pointsRes.rows[0]?.fn_user_points_balance ?? 0;
    } catch { /* function may not exist */ }

    try {
      const objectivesRes = await this.db.query(
        `SELECT id, title, description, target_date, completed_at
         FROM consultant_objectives
         WHERE user_id = $1
         ORDER BY target_date ASC
         LIMIT 10`,
        [userId],
      );
      objectives = objectivesRes.rows;
    } catch { /* table may not exist */ }

    try {
      const badgeCountRes = await this.db.query<{ count: string }>(
        `SELECT COUNT(*) FROM user_badges WHERE user_id = $1`,
        [userId],
      );
      badge_count = parseInt(badgeCountRes.rows[0]?.count ?? '0', 10);
    } catch { /* fallback */ }

    return { points, objectives, badge_count };
  }
}
