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
    const userRes = await this.db.query<{ id: number; full_name: string; email: string }>(
      `SELECT id, full_name, email
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
         sl.name                   AS service_line
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
      },
    };
  }

  async me(userId: number): Promise<UserProfile | null> {
    const res = await this.db.query<UserProfile>(
      `SELECT
         u.id,
         u.full_name,
         u.email,
         r.code                    AS role,
         a.name                    AS area,
         sl.name                   AS service_line
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
