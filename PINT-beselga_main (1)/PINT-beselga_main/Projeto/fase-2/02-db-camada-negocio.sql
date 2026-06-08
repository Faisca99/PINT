-- ============================================================
-- Fase 2 - Camada de Negocio SQL (PostgreSQL / Neon)
-- Dependencias: fase-1/04-BD_FINAL.sql
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Trigger generico para updated_at
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
  tables_with_updated_at TEXT[] := ARRAY[
    'learning_paths',
    'service_lines',
    'areas',
    'levels',
    'requirements',
    'badges',
    'users',
    'user_preferences',
    'info_notices',
    'email_templates',
    'sla_policies',
    'consultant_objectives',
    'translations',
    'integration_configs',
    'platform_config'
  ];
BEGIN
  FOREACH t IN ARRAY tables_with_updated_at
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at()', t, t);
  END LOOP;
END;
$$;

-- ------------------------------------------------------------
-- 2) Views para dashboards e consulta publica
-- ------------------------------------------------------------

-- Estado agregado de progresso de badges por consultor
CREATE OR REPLACE VIEW v_consultant_badge_progress AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.email,
  COUNT(DISTINCT ub.id) AS badges_obtidos,
  COUNT(DISTINCT ba.id) FILTER (WHERE ba.status = 'open') AS candidaturas_abertas,
  COUNT(DISTINCT ba.id) FILTER (WHERE ba.status = 'submitted') AS candidaturas_submetidas,
  COUNT(DISTINCT ba.id) FILTER (WHERE ba.status = 'in_validation') AS candidaturas_em_validacao,
  COUNT(DISTINCT ba.id) FILTER (WHERE ba.status = 'closed' AND ba.final_result = 'approved') AS candidaturas_aprovadas,
  COUNT(DISTINCT ba.id) FILTER (WHERE ba.status = 'closed' AND ba.final_result = 'rejected') AS candidaturas_rejeitadas,
  COALESCE(SUM(pt.points_delta), 0) AS pontos_totais
FROM users u
LEFT JOIN user_badges ub ON ub.user_id = u.id
LEFT JOIN badge_applications ba ON ba.applicant_user_id = u.id
LEFT JOIN point_transactions pt ON pt.user_id = u.id
GROUP BY u.id, u.full_name, u.email;

-- Galeria publica de badges
CREATE OR REPLACE VIEW v_public_badges AS
SELECT
  ub.public_token,
  ub.awarded_at,
  ub.expires_at,
  u.id AS user_id,
  u.full_name,
  b.id AS badge_id,
  b.code AS badge_code,
  b.name AS badge_name,
  b.badge_type,
  b.image_url AS badge_image_url,
  l.code AS level_code,
  l.name AS level_name,
  a.name AS area_name,
  sl.name AS service_line_name,
  lp.name AS learning_path_name
FROM user_badges ub
JOIN users u ON u.id = ub.user_id
JOIN badges b ON b.id = ub.badge_id
LEFT JOIN levels l ON l.id = b.level_id
LEFT JOIN areas a ON a.id = l.area_id
LEFT JOIN service_lines sl ON sl.id = a.service_line_id
LEFT JOIN learning_paths lp ON lp.id = sl.learning_path_id
WHERE ub.is_published = TRUE
  AND ub.rgpd_accepted = TRUE;

-- Pendencias de SLA por candidatura fechada em aberto
CREATE OR REPLACE VIEW v_sla_pending_applications AS
SELECT
  ba.id AS application_id,
  ba.status,
  ba.submitted_at,
  sp.team_type,
  sp.limit_hours,
  ROUND(EXTRACT(EPOCH FROM (NOW() - ba.submitted_at)) / 3600.0, 2) AS elapsed_hours,
  ROUND((EXTRACT(EPOCH FROM (NOW() - ba.submitted_at)) / 3600.0) * 100.0 / sp.limit_hours, 2) AS elapsed_percent
FROM badge_applications ba
JOIN sla_policies sp ON sp.is_active = TRUE
WHERE ba.status IN ('submitted', 'in_validation')
  AND ba.submitted_at IS NOT NULL;

-- ------------------------------------------------------------
-- 3) Funcoes de negocio
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_user_points_balance(p_user_id BIGINT)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(points_delta), 0)
  FROM point_transactions
  WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION fn_submit_application(
  p_application_id BIGINT,
  p_actor_user_id BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_owner BIGINT;
  v_status application_status_t;
BEGIN
  SELECT applicant_user_id, status
    INTO v_owner, v_status
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_owner <> p_actor_user_id THEN
    RAISE EXCEPTION 'Apenas o dono pode submeter a candidatura';
  END IF;

  IF v_status <> 'open' THEN
    RAISE EXCEPTION 'A candidatura deve estar em estado open para submissao';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM application_evidences
    WHERE application_id = p_application_id
  ) THEN
    RAISE EXCEPTION 'A candidatura deve ter pelo menos uma evidencia antes da submissao';
  END IF;

  UPDATE badge_applications
     SET status = 'submitted',
         submitted_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, occurred_at
  )
  VALUES (
    p_application_id, p_actor_user_id, 'open', 'submitted', 'submitted', NOW()
  );
END;
$$;

CREATE OR REPLACE FUNCTION fn_approve_application(
  p_application_id BIGINT,
  p_reviewer_user_id BIGINT,
  p_comment TEXT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  v_applicant_id BIGINT;
  v_badge_id BIGINT;
  v_status application_status_t;
  v_points INTEGER;
  v_user_badge_id BIGINT;
  v_current_balance INTEGER;
BEGIN
  SELECT applicant_user_id, badge_id, status
    INTO v_applicant_id, v_badge_id, v_status
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_status NOT IN ('submitted', 'in_validation') THEN
    RAISE EXCEPTION 'Estado invalido para aprovacao: %', v_status;
  END IF;

  SELECT points INTO v_points
  FROM badges
  WHERE id = v_badge_id;

  v_points := COALESCE(v_points, 0);

  INSERT INTO application_reviews(
    application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    'service_line_leader',
    'approve',
    p_comment,
    NOW()
  );

  UPDATE badge_applications
     SET status = 'closed',
         final_result = 'approved',
         final_comment = p_comment,
         approved_at = NOW(),
         closed_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    v_status,
    'closed',
    'approved',
    p_comment,
    NOW()
  );

  INSERT INTO user_badges(
    user_id, badge_id, source_application_id, awarded_at, points_awarded
  )
  VALUES (
    v_applicant_id, v_badge_id, p_application_id, NOW(), v_points
  )
  RETURNING id INTO v_user_badge_id;

  SELECT COALESCE(SUM(points_delta), 0)
    INTO v_current_balance
  FROM point_transactions
  WHERE user_id = v_applicant_id;

  INSERT INTO point_transactions(
    user_id,
    badge_id,
    user_badge_id,
    transaction_type,
    points_delta,
    balance_after,
    note,
    occurred_at,
    created_by
  )
  VALUES (
    v_applicant_id,
    v_badge_id,
    v_user_badge_id,
    'badge_award',
    v_points,
    v_current_balance + v_points,
    'Aprovacao da candidatura ' || p_application_id,
    NOW(),
    p_reviewer_user_id
  );

  INSERT INTO notifications(user_id, type, title, message, payload, sent_at)
  VALUES (
    v_applicant_id,
    'application_approved',
    'Badge aprovado',
    'A tua candidatura foi aprovada e o badge foi atribuido.',
    jsonb_build_object('application_id', p_application_id, 'user_badge_id', v_user_badge_id),
    NOW()
  );

  RETURN v_user_badge_id;
END;
$$;

CREATE OR REPLACE FUNCTION fn_reject_application(
  p_application_id BIGINT,
  p_reviewer_user_id BIGINT,
  p_comment TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_status application_status_t;
  v_applicant_id BIGINT;
BEGIN
  SELECT status, applicant_user_id
    INTO v_status, v_applicant_id
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_status NOT IN ('submitted', 'in_validation') THEN
    RAISE EXCEPTION 'Estado invalido para rejeicao: %', v_status;
  END IF;

  INSERT INTO application_reviews(
    application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    CASE WHEN v_status = 'submitted' THEN 'talent_manager'::reviewer_type_t ELSE 'service_line_leader'::reviewer_type_t END,
    'reject',
    p_comment,
    NOW()
  );

  UPDATE badge_applications
     SET status = 'closed',
         final_result = 'rejected',
         final_comment = p_comment,
         closed_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    v_status,
    'closed',
    'rejected',
    p_comment,
    NOW()
  );

  INSERT INTO notifications(user_id, type, title, message, payload, sent_at)
  VALUES (
    v_applicant_id,
    'application_rejected',
    'Candidatura rejeitada',
    COALESCE('A tua candidatura foi rejeitada. Motivo: ' || p_comment, 'A tua candidatura foi rejeitada.'),
    jsonb_build_object('application_id', p_application_id),
    NOW()
  );
END;
$$;

COMMIT;

-- ============================================================
-- Uso recomendado no backend:
--   SELECT fn_submit_application($1, $2);
--   SELECT fn_approve_application($1, $2, $3);
--   SELECT fn_reject_application($1, $2, $3);
--   SELECT fn_user_points_balance($1);
-- ============================================================
