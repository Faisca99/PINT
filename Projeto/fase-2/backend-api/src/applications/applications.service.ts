import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly db: DatabaseService) {}

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
    return { ok: true };
  }

  async approve(applicationId: number, reviewerUserId: number, comment?: string) {
    const res = await this.db.query<{ fn_approve_application: number }>(
      'SELECT fn_approve_application($1, $2, $3)',
      [applicationId, reviewerUserId, comment ?? null],
    );

    return { userBadgeId: res.rows[0]?.fn_approve_application ?? null };
  }

  async reject(applicationId: number, reviewerUserId: number, comment: string) {
    await this.db.query('SELECT fn_reject_application($1, $2, $3)', [applicationId, reviewerUserId, comment]);
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
                  'file_name', ae.file_name,
                  'file_url', ae.file_url,
                  'description', ae.description,
                  'uploaded_at', ae.uploaded_at
                )
              ) FILTER (WHERE ae.id IS NOT NULL) AS evidences
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       LEFT JOIN application_evidences ae ON ae.application_id = ba.id
       WHERE ba.id = $1
       GROUP BY ba.id, u.full_name, b.name`,
      [id],
    );
    return res.rows[0];
  }

  async list() {
    const res = await this.db.query(
      `SELECT ba.id, ba.applicant_user_id, ba.badge_id, ba.status, ba.final_result,
              ba.created_at, ba.submitted_at, ba.closed_at,
              u.full_name AS applicant_name,
              b.name AS badge_name
       FROM badge_applications ba
       JOIN users u ON u.id = ba.applicant_user_id
       JOIN badges b ON b.id = ba.badge_id
       ORDER BY ba.created_at DESC`,
    );

    return res.rows;
  }
}

