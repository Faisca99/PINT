# Fase 2 - Contrato API x Base de Dados

Este ficheiro define o mapeamento direto entre endpoints da API e a BD.
Objetivo: backend 100% ligado a dados reais sem logica critica duplicada.

## 1. Auth

- POST /api/v1/auth/login
  - Tabelas: users, user_roles, roles, user_sessions
  - Escrita: inserir user_sessions (refresh token)

- POST /api/v1/auth/refresh
  - Tabelas: user_sessions
  - Escrita: atualizar last_used_at

- POST /api/v1/auth/logout
  - Tabelas: user_sessions
  - Escrita: revoked_at = NOW()

## 2. Catalogo de badges

- GET /api/v1/badges
  - Tabelas: badges, levels, areas, service_lines, learning_paths
  - Query base:

```sql
SELECT b.id, b.code, b.name, b.description, b.badge_type, b.points,
       l.code AS level_code, l.name AS level_name,
       a.name AS area_name, sl.name AS service_line_name, lp.name AS learning_path_name
FROM badges b
LEFT JOIN levels l ON l.id = b.level_id
LEFT JOIN areas a ON a.id = l.area_id
LEFT JOIN service_lines sl ON sl.id = a.service_line_id
LEFT JOIN learning_paths lp ON lp.id = sl.learning_path_id
WHERE b.is_active = TRUE
ORDER BY b.name;
```

## 3. Candidaturas

- POST /api/v1/applications
  - Tabelas: badge_applications
  - Escrita: inserir estado open

- POST /api/v1/applications/:id/evidences
  - Tabelas: application_evidences
  - Escrita: inserir evidencia

- POST /api/v1/applications/:id/submit
  - Funcao: fn_submit_application(application_id, actor_user_id)
  - Efeito: atualiza estado + escreve historico

- POST /api/v1/applications/:id/approve
  - Funcao: fn_approve_application(application_id, reviewer_user_id, comment)
  - Efeito: review + fecho + user_badges + points + notificacao

- POST /api/v1/applications/:id/reject
  - Funcao: fn_reject_application(application_id, reviewer_user_id, comment)
  - Efeito: review + fecho + notificacao

## 4. Dashboard consultor

- GET /api/v1/me/dashboard
  - View: v_consultant_badge_progress
  - Query base:

```sql
SELECT *
FROM v_consultant_badge_progress
WHERE user_id = $1;
```

- GET /api/v1/me/points
  - Funcao: fn_user_points_balance(user_id)

```sql
SELECT fn_user_points_balance($1) AS current_points;
```

- GET /api/v1/me/badges
  - Tabelas: user_badges, badges, levels

## 5. Pagina publica de verificacao

- GET /api/v1/public/badges/:token
  - View: v_public_badges

```sql
SELECT *
FROM v_public_badges
WHERE public_token = $1;
```

## 6. Notificacoes

- GET /api/v1/notifications
  - Tabela: notifications

- PATCH /api/v1/notifications/:id/read
  - Tabela: notifications
  - Escrita: is_read = TRUE, read_at = NOW()

## 7. Regras obrigatorias para backend

1. Todas as operacoes de workflow devem usar funcoes SQL da Fase 2.
2. Nao implementar transicao de estado manual no codigo NestJS.
3. Cada endpoint mutavel deve correr em transacao.
4. RBAC deve ser validado antes da chamada SQL.
5. Queries devem filtrar por ownership (consultor) ou scope (SL leader).
