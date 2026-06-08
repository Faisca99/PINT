-- ============================================================
-- Fase 2 - Validacao fim-a-fim
-- Executar apos:
--   1) fase-1/04-BD_FINAL.sql
--   2) fase-2/02-db-camada-negocio.sql
-- ============================================================

-- 1) Confirmar views
SELECT 'v_consultant_badge_progress' AS object, COUNT(*)
FROM information_schema.views
WHERE table_name = 'v_consultant_badge_progress';

SELECT 'v_public_badges' AS object, COUNT(*)
FROM information_schema.views
WHERE table_name = 'v_public_badges';

SELECT 'v_sla_pending_applications' AS object, COUNT(*)
FROM information_schema.views
WHERE table_name = 'v_sla_pending_applications';

-- 2) Confirmar funcoes
SELECT p.proname AS function_name
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'fn_user_points_balance',
    'fn_submit_application',
    'fn_approve_application',
    'fn_reject_application'
  )
ORDER BY p.proname;

-- 3) Confirmar triggers de updated_at
SELECT event_object_table AS table_name, trigger_name
FROM information_schema.triggers
WHERE trigger_name ~ '^trg_.*_updated_at$'
ORDER BY event_object_table;

-- 4) Smoke test de leitura
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_badges FROM badges;
SELECT COUNT(*) AS total_applications FROM badge_applications;

-- 5) Smoke test da view dashboard
SELECT *
FROM v_consultant_badge_progress
ORDER BY user_id
LIMIT 20;

-- 6) Smoke test da view publica
SELECT *
FROM v_public_badges
LIMIT 20;
