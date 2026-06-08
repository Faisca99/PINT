import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { EmailService } from '../common/email/email.service';
import { WebhookService } from '../common/webhook/webhook.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly email: EmailService,
    private readonly webhook: WebhookService,
  ) {}

  private async getApplicationInfo(applicationId: number) {
    const res = await this.db.query(
      `SELECT ba.id, ba.status, ba.final_result,
              u.full_name AS applicant_name, u.email AS applicant_email,
              b.name AS badge_name
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       WHERE ba.id = $1`,
      [applicationId],
    );
    return res.rows[0] ?? null;
  }

  async create(applicantUserId: number, badgeId: number) {
    const res = await this.db.query(
      `INSERT INTO badge_applications (applicant_user_id, badge_id, status)
       VALUES ($1, $2, 'open')
       RETURNING *`,
      [applicantUserId, badgeId],
    );
    return res.rows[0];
  }

  async addEvidence(applicationId: number, uploadedByUserId: number, payload: {
    requirementId: number;
    fileName: string;
    storageKey: string;
    fileUrl: string;
    mimeType?: string;
    sizeBytes?: number;
    description?: string;
  }) {
    const res = await this.db.query(
      `INSERT INTO application_evidences (
         application_id, requirement_id, uploaded_by_user_id,
         file_name, storage_key, file_url, mime_type, size_bytes, description
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        applicationId,
        payload.requirementId,
        uploadedByUserId,
        payload.fileName,
        payload.storageKey,
        payload.fileUrl,
        payload.mimeType ?? null,
        payload.sizeBytes ?? null,
        payload.description ?? null,
      ],
    );

    return res.rows[0];
  }

  async submit(applicationId: number, actorUserId: number) {
    await this.db.query('SELECT fn_submit_application($1, $2)', [applicationId, actorUserId]);

    // Email de confirmação ao consultor
    const info = await this.getApplicationInfo(applicationId);
    if (info) {
      await this.email.send(
        info.applicant_email,
        `Candidatura #${applicationId} submetida — ${info.badge_name}`,
        this.email.applicationConfirmation(info.applicant_name, info.badge_name, applicationId),
      );
      // Notificar Talent Managers (em paralelo, falhas individuais não bloqueiam)
      const tms = await this.db.query(
        `SELECT u.full_name, u.email FROM users u
         JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
         JOIN roles r ON r.id = ur.role_id
         WHERE r.code = 'talent_manager' AND u.account_status = 'active'`,
      );
      for (const tm of tms.rows) {
        await this.email.send(
          tm.email,
          `Nova candidatura para validação — ${info.badge_name}`,
          this.email.newApplicationForValidator(tm.full_name, info.applicant_name, info.badge_name),
        ).catch((err) => console.warn(`[Email] Falha ao notificar ${tm.email}:`, err));
      }
    }
    return { ok: true };
  }

  async approve(applicationId: number, reviewerUserId: number, comment?: string) {
    // Verificar role do revisor E estado da candidatura
    const [stateRes, roleRes] = await Promise.all([
      this.db.query<{ status: string }>(
        `SELECT status FROM badge_applications WHERE id = $1`,
        [applicationId],
      ),
      this.db.query<{ code: string }>(
        `SELECT r.code FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         WHERE ur.user_id = $1 AND ur.is_active = TRUE LIMIT 1`,
        [reviewerUserId],
      ),
    ]);

    const currentStatus = stateRes.rows[0]?.status;
    const reviewerRole = roleRes.rows[0]?.code ?? '';

    console.log(`[APPROVE] app=${applicationId} status=${currentStatus} reviewer=${reviewerUserId} role=${reviewerRole}`);

    // TM só pode agir sobre candidaturas "submitted"
    if (reviewerRole === 'talent_manager') {
      if (currentStatus !== 'submitted') {
        throw new Error(`TM não pode agir sobre candidatura em estado: ${currentStatus}`);
      }
      // Move para in_validation — NÃO atribui badge
      await this.db.query(
        `UPDATE badge_applications SET status = 'in_validation' WHERE id = $1`,
        [applicationId],
      );
      await this.db.query(
        `INSERT INTO application_reviews (application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at)
         VALUES ($1, $2, 'talent_manager', 'forward', $3, NOW())`,
        [applicationId, reviewerUserId, comment ?? null],
      );
      await this.db.query(
        `INSERT INTO application_history (application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at)
         VALUES ($1, $2, $3::application_status_t, $4::application_status_t, $5, $6, NOW())`,
        [applicationId, reviewerUserId, 'submitted', 'in_validation', 'forwarded', comment ?? null],
      );
      await this.db.query(
        `INSERT INTO notifications (user_id, type, title, message, payload, sent_at)
         SELECT u.id, 'application_forwarded'::notification_type_t,
                'Nova candidatura para validação',
                'Uma candidatura foi encaminhada para a tua validação final.',
                jsonb_build_object('application_id', $1::bigint), NOW()
         FROM users u
         JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
         JOIN roles r ON r.id = ur.role_id
         WHERE r.code = 'service_line_leader'`,
        [applicationId],
      );
      console.log(`[APPROVE] TM forwarded app=${applicationId} to in_validation`);
      return { forwarded: true };
    }

    // SLL só pode agir sobre candidaturas "in_validation"
    if (reviewerRole === 'service_line_leader') {
      if (currentStatus !== 'in_validation') {
        throw new Error(`SLL não pode agir sobre candidatura em estado: ${currentStatus}`);
      }
      // Fecha e atribui badge via função SQL
      const res = await this.db.query<{ fn_approve_application: number }>(
        'SELECT fn_approve_application($1, $2, $3)',
        [applicationId, reviewerUserId, comment ?? null],
      );
      const info = await this.getApplicationInfo(applicationId);
      if (info) {
        await this.email.send(
          info.applicant_email,
          `Badge aprovado! — ${info.badge_name}`,
          this.email.applicationApproved(info.applicant_name, info.badge_name),
        );
      }
      console.log(`[APPROVE] SLL approved app=${applicationId} → badge awarded`);
      // Notificar Teams/Slack
      if (info) {
        await this.webhook.badgeAwarded(info.applicant_name, info.badge_name);
      }
      return { userBadgeId: res.rows[0]?.fn_approve_application ?? null };
    }

    throw new Error(`Não foi possível processar aprovação: status=${currentStatus} role=${reviewerRole}`);
  }

  async reject(applicationId: number, reviewerUserId: number, comment: string) {
    const info = await this.getApplicationInfo(applicationId);
    await this.db.query('SELECT fn_reject_application($1, $2, $3)', [applicationId, reviewerUserId, comment]);
    if (info) {
      await this.email.send(
        info.applicant_email,
        `Candidatura rejeitada — ${info.badge_name}`,
        this.email.applicationRejected(info.applicant_name, info.badge_name, comment),
      );
    }
    return { ok: true };
  }

  async sendBack(applicationId: number, reviewerUserId: number, comment: string) {
    const res = await this.db.query(
      `SELECT status FROM badge_applications WHERE id = $1 FOR UPDATE`,
      [applicationId],
    );
    const current = res.rows[0];
    if (!current) throw new Error('Candidatura não encontrada');
    if (!['submitted', 'in_validation'].includes(current.status)) {
      throw new Error(`Estado inválido para send back: ${current.status}`);
    }

    await this.db.query(
      `INSERT INTO application_reviews (application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at)
       VALUES ($1, $2, $3, 'send_back', $4, NOW())`,
      [
        applicationId,
        reviewerUserId,
        current.status === 'submitted' ? 'talent_manager' : 'service_line_leader',
        comment,
      ],
    );

    await this.db.query(
      `UPDATE badge_applications SET status = 'open', submitted_at = NULL WHERE id = $1`,
      [applicationId],
    );

    await this.db.query(
      `INSERT INTO application_history (application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at)
       VALUES ($1, $2, $3::application_status_t, 'open'::application_status_t, 'send_back', $4, NOW())`,
      [applicationId, reviewerUserId, current.status, comment],
    );

    await this.db.query(
      `INSERT INTO notifications (user_id, type, title, message, payload, sent_at)
       SELECT applicant_user_id, 'application_send_back'::notification_type_t,
              'Candidatura devolvida',
              'A tua candidatura foi devolvida para correção. Motivo: ' || $2,
              jsonb_build_object('application_id', $1::bigint),
              NOW()
       FROM badge_applications WHERE id = $1`,
      [applicationId, comment],
    );

    const info = await this.getApplicationInfo(applicationId);
    if (info) {
      await this.email.send(
        info.applicant_email,
        `Candidatura devolvida — ${info.badge_name}`,
        this.email.applicationSentBack(info.applicant_name, info.badge_name, comment),
      );
    }

    return { ok: true };
  }

  async byId(id: number) {
    const res = await this.db.query(
      `SELECT ba.id, ba.applicant_user_id, ba.badge_id, ba.status, ba.final_result,
              ba.created_at, ba.submitted_at, ba.closed_at,
              u.full_name AS applicant_name,
              b.name AS badge_name,
              json_agg(
                json_build_object(
                  'id', ae.id,
                  'requirement_id', ae.requirement_id,
                  'requirement_code', r.code,
                  'requirement_title', r.title,
                  'file_name', ae.file_name,
                  'file_url', ae.file_url,
                  'description', ae.description,
                  'uploaded_at', ae.uploaded_at
                ) ORDER BY ae.id
              ) FILTER (WHERE ae.id IS NOT NULL) AS evidences
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN application_evidences ae ON ae.application_id = ba.id
       LEFT JOIN requirements r ON r.id = ae.requirement_id
       WHERE ba.id = $1
       GROUP BY ba.id, u.full_name, b.name`,
      [id],
    );
    return res.rows[0];
  }

  async history(applicationId: number) {
    const res = await this.db.query(
      `SELECT ah.id, ah.from_status, ah.to_status, ah.event_type, ah.comment, ah.occurred_at,
              u.full_name AS actor_name, r.code AS actor_role
       FROM application_history ah
       JOIN users u ON u.id = ah.actor_user_id
       LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_active = TRUE
       LEFT JOIN roles r ON r.id = ur.role_id
       WHERE ah.application_id = $1
       ORDER BY ah.occurred_at ASC`,
      [applicationId],
    );
    return res.rows;
  }

  async list() {
    const res = await this.db.query(
      `SELECT ba.id, ba.applicant_user_id, ba.badge_id, ba.status, ba.final_result,
              ba.created_at, ba.submitted_at, ba.closed_at,
              u.full_name AS applicant_name,
              b.name AS badge_name,
              l.code AS level_code,
              a.name AS area_name,
              sl.name AS service_line_name
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       LEFT JOIN service_lines sl ON sl.id = a.service_line_id
       ORDER BY ba.created_at DESC
       LIMIT 500`,
    );

    return res.rows;
  }

  async mine(userId: number) {
    const res = await this.db.query(
      `SELECT ba.id, ba.badge_id, ba.status, ba.final_result,
              ba.created_at, ba.submitted_at, ba.closed_at,
              b.name AS badge_name,
              b.description AS badge_description,
              l.code AS level_code,
              l.name AS level_name,
              a.name AS area_name
       FROM badge_applications ba
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN levels l ON l.id = b.level_id
       LEFT JOIN areas a ON a.id = l.area_id
       WHERE ba.applicant_user_id = $1
       ORDER BY ba.created_at DESC`,
      [userId],
    );

    return res.rows;
  }
}

