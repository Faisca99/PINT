import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../common/database/database.service';

type UserProfile = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  area: string | null;
  service_line: string | null;
  must_change_password?: boolean;
};

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
};

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(email: string, password: string): Promise<LoginResult> {
    // Validate credentials with pgcrypto: crypt() compares against the stored hash
    const userRes = await this.db.query<{ id: number; full_name: string; email: string; must_change_password: boolean }>(
      `SELECT id, full_name, email, must_change_password
       FROM users
       WHERE email = $1
         AND password_hash = crypt($2, password_hash)
         AND account_status = 'active'
       LIMIT 1`,
      [email, password],
    );

    const user = userRes.rows[0];
    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    // Fetch role, area name and service line name for this user
    const profileRes = await this.db.query<{
      role: string;
      area: string | null;
      service_line: string | null;
    }>(
      `SELECT
         r.code                    AS role,
         a.name                    AS area,
         COALESCE(
           -- Para SLL: pegar a SL da tabela de assignments
           (SELECT sl2.name FROM service_line_assignments sla
            JOIN service_lines sl2 ON sl2.id = sla.service_line_id
            WHERE sla.user_id = $1 LIMIT 1),
           -- Para outros: pegar a SL da área preferencial
           sl.name
         )                         AS service_line
       FROM user_roles ur
       JOIN roles r  ON r.id  = ur.role_id
       LEFT JOIN users u  ON u.id  = $1
       LEFT JOIN areas a  ON a.id  = u.preferred_area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE ur.user_id = $1
         AND ur.is_active = TRUE
       LIMIT 1`,
      [user.id],
    );

    const profile = profileRes.rows[0];

    const refreshToken = randomBytes(48).toString('hex');
    const accessToken = randomBytes(32).toString('hex');

    await this.db.query(
      `INSERT INTO user_sessions (user_id, refresh_token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshToken],
    );

    // Update last_login_at (and first_login_at on first login)
    await this.db.query(
      `UPDATE users
       SET last_login_at  = NOW(),
           first_login_at = COALESCE(first_login_at, NOW())
       WHERE id = $1`,
      [user.id],
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: profile?.role ?? 'consultant',
        area: profile?.area ?? null,
        service_line: profile?.service_line ?? null,
        must_change_password: user.must_change_password ?? false,
      },
    };
  }

  async register(data: { fullName: string; email: string; password: string; areaId?: number }): Promise<{ id: number } | null> {
    const existing = await this.db.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [data.email],
    );
    if (existing.rows[0]) return null; // email já existe

    const res = await this.db.query(
      `INSERT INTO users (full_name, email, password_hash, account_status, email_verified, preferred_area_id, must_change_password)
       VALUES ($1, $2, crypt($3, gen_salt('bf', 10)), 'active', TRUE, $4, FALSE)
       RETURNING id`,
      [data.fullName, data.email, data.password, data.areaId ?? null],
    );
    const userId = res.rows[0].id;

    // Atribuir role de consultant por defeito
    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE code = 'consultant'`,
      [userId],
    );

    // Preferências
    await this.db.query(`INSERT INTO user_preferences (user_id) VALUES ($1)`, [userId]);

    return { id: userId };
  }

  async changePassword(userId: number, newPassword: string): Promise<boolean> {
    await this.db.query(
      `UPDATE users
       SET password_hash = crypt($1, gen_salt('bf', 10)),
           must_change_password = FALSE
       WHERE id = $2`,
      [newPassword, userId],
    );
    return true;
  }

  async forgotPassword(email: string): Promise<{ token: string } | null> {
    const userRes = await this.db.query<{ id: number }>(
      `SELECT id FROM users WHERE email = $1 AND account_status = 'active' LIMIT 1`,
      [email],
    );
    const user = userRes.rows[0];
    if (!user) return null;

    const token = randomBytes(32).toString('hex');
    await this.db.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.id, token],
    );
    return { token };
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const res = await this.db.query<{ user_id: number }>(
      `SELECT user_id FROM password_reset_tokens
       WHERE token = $1 AND expires_at > NOW() AND used_at IS NULL
       LIMIT 1`,
      [token],
    );
    const row = res.rows[0];
    if (!row) return false;

    await this.db.query(
      `UPDATE users SET password_hash = crypt($1, gen_salt('bf', 10)) WHERE id = $2`,
      [newPassword, row.user_id],
    );
    await this.db.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE token = $1`,
      [token],
    );
    return true;
  }

  async updateProfile(userId: number, data: { area_id?: number; full_name?: string }) {
    await this.db.query(
      `UPDATE users SET
         full_name = COALESCE($1, full_name),
         preferred_area_id = COALESCE($2, preferred_area_id),
         updated_at = NOW()
       WHERE id = $3`,
      [data.full_name ?? null, data.area_id ?? null, userId],
    );
    return true;
  }

  async getAreas() {
    const res = await this.db.query(
      `SELECT a.id, a.name, a.code, sl.name AS service_line_name
       FROM areas a JOIN service_lines sl ON sl.id = a.service_line_id
       WHERE a.is_active = TRUE ORDER BY a.name`,
    );
    return res.rows;
  }

  async me(userId: number): Promise<UserProfile | null> {
    const res = await this.db.query<UserProfile>(
      `SELECT
         u.id,
         u.full_name,
         u.email,
         r.code                    AS role,
         a.name                    AS area,
         COALESCE(
           (SELECT sl2.name FROM service_line_assignments sla
            JOIN service_lines sl2 ON sl2.id = sla.service_line_id
            WHERE sla.user_id = u.id LIMIT 1),
           sl.name
         )                         AS service_line
       FROM users u
       LEFT JOIN user_roles ur     ON ur.user_id = u.id AND ur.is_active = TRUE
       LEFT JOIN roles r           ON r.id  = ur.role_id
       LEFT JOIN areas a           ON a.id  = u.preferred_area_id
       LEFT JOIN service_lines sl  ON sl.id = a.service_line_id
       WHERE u.id = $1
       LIMIT 1`,
      [userId],
    );

    return res.rows[0] ?? null;
  }
}
