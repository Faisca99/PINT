import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../common/database/database.service';

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
};

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(email: string, _password: string): Promise<LoginResult> {
    const userRes = await this.db.query<{ id: number; full_name: string; email: string }>(
      `SELECT id, full_name, email
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email],
    );

    const user = userRes.rows[0];
    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    const refreshToken = randomBytes(48).toString('hex');
    const accessToken = randomBytes(32).toString('hex');

    await this.db.query(
      `INSERT INTO user_sessions (user_id, refresh_token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshToken],
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async me(userId: number): Promise<unknown> {
    const res = await this.db.query(
      `SELECT id, full_name, email, account_status, first_login_at, last_login_at
       FROM users
       WHERE id = $1`,
      [userId],
    );
    return res.rows[0] ?? null;
  }
}
