-- ============================================================
-- PINT 2025 — Plataforma de Badges da Softinsa
-- Schema PostgreSQL Final — Neon Compatible
-- Versão: 1.0  |  Substitui: PROJETOAS2025.sql (SQL Server)
-- Cobre 100% dos requisitos + bónus do projeto
-- ============================================================
-- Tabelas originais mantidas (adaptadas):
--   CAMINHOAPRENDIZAGEM → learning_paths
--   LINHASERVICO        → service_lines
--   AREA                → areas
--   NIVEL               → levels
--   REQUISITO           → requirements
--   BADGE               → badges
--   BADGEUTILIZADOR     → user_badges
--   CANDIDATURABADGE    → badge_applications
--   EVIDENCIACANDIDATURA→ application_evidences
--   HISTORICOCANDIDATURA→ application_history
--   REVISAOCANDIDATURA  → application_reviews
--   PERFIL              → roles
--   UTILIZADOR          → users
--   UTILIZADORPERFIL    → user_roles
--   RESPONSABILIDADELINHASERVICO → service_line_assignments
--   NOTIFICACAO         → notifications
--   LEMBRETE            → reminders
--   AVISOINFORMACAO     → info_notices
--   CONFIGURACAOSLA     → sla_policies
--   TOKENRECUPERACAOPASS→ password_reset_tokens
--   TRADUCAOENTIDADE    → translations (corrigida)
--   IDIOMA              → languages
-- Novas tabelas:
--   platform_config, rgpd_policies, certificate_templates,
--   achievement_definitions, user_achievements, user_preferences,
--   user_sessions, email_verification_tokens, push_tokens,
--   point_transactions, email_templates, user_email_signatures,
--   sla_breach_logs, consultant_timeline_events,
--   consultant_objectives, integration_configs,
--   badge_shares, audit_log
-- ============================================================

BEGIN;

-- ============================================================
-- SECTION 1: EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- SECTION 2: ENUMS
-- ============================================================

-- Estado da conta do utilizador
CREATE TYPE IF NOT EXISTS account_status_t AS ENUM (
    'pending_confirmation', -- aguarda confirmação de email (req 1)
    'active',
    'inactive',
    'suspended'
);

-- Tipo de badge (req 8 / req 14)
CREATE TYPE IF NOT EXISTS badge_type_t AS ENUM (
    'level',    -- badge de nível A-E
    'special',  -- conquista especial automática
    'premium'   -- certificação paga ou badge de topo
);

-- Estados do workflow de candidatura (req 6)
CREATE TYPE IF NOT EXISTS application_status_t AS ENUM (
    'open',           -- criada, não submetida
    'submitted',      -- submetida; aguarda Talent Manager
    'in_validation',  -- TM validou; aguarda Service Line Leader
    'closed'          -- fechada (aprovada ou rejeitada)
);

-- Resultado final da candidatura (req 6)
CREATE TYPE IF NOT EXISTS application_result_t AS ENUM (
    'approved',
    'rejected'
);

-- Tipo de revisor no workflow
CREATE TYPE IF NOT EXISTS reviewer_type_t AS ENUM (
    'talent_manager',
    'service_line_leader'
);

-- Decisão tomada numa revisão
CREATE TYPE IF NOT EXISTS review_decision_t AS ENUM (
    'forward',    -- TM → envia para SL Leader
    'send_back',  -- devolve ao consultor com comentário
    'approve',    -- SL Leader → aprova badge
    'reject'      -- SL Leader → rejeita candidatura
);

-- Tipos de notificação in-app (req 20)
CREATE TYPE IF NOT EXISTS notification_type_t AS ENUM (
    'application_submitted',
    'application_forwarded',
    'application_approved',
    'application_rejected',
    'application_send_back',
    'badge_awarded',
    'badge_expiring',   -- req 21
    'badge_expired',
    'sla_warning',      -- bonus admin
    'sla_breach',       -- bonus admin req 1 + 11
    'reminder',         -- req 22
    'announcement',
    'system'
);

-- Tipo de transação de pontos (req 13)
CREATE TYPE IF NOT EXISTS points_tx_type_t AS ENUM (
    'badge_award',
    'achievement_bonus',
    'manual_credit',
    'manual_debit'
);

-- Scope do SLA (bonus admin)
CREATE TYPE IF NOT EXISTS sla_team_t AS ENUM (
    'talent_manager',
    'service_line_leader'
);

-- Plataformas de partilha (req 11 + bonus 12)
CREATE TYPE IF NOT EXISTS share_platform_t AS ENUM (
    'linkedin',
    'email_signature',
    'other'
);

-- Integrações externas (bonus Teams/Slack)
CREATE TYPE IF NOT EXISTS integration_provider_t AS ENUM (
    'teams',
    'slack',
    'webhook'
);

-- ============================================================
-- SECTION 3: TABELAS DE REFERÊNCIA BASE
-- ============================================================

-- Idiomas suportados (bonus — 3 idiomas: PT, EN, ES)
CREATE TABLE IF NOT EXISTS languages (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(10)  NOT NULL UNIQUE,  -- 'pt' | 'en' | 'es'
    name        VARCHAR(80)  NOT NULL,
    native_name VARCHAR(80),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Perfis/roles da plataforma
CREATE TABLE IF NOT EXISTS roles (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(60)  NOT NULL UNIQUE, -- 'admin' | 'consultant' | 'talent_manager' | 'service_line_leader'
    name        VARCHAR(120) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Versões de políticas RGPD (req 10 + admin req 8)
CREATE TABLE IF NOT EXISTS rgpd_policies (
    id             BIGSERIAL   PRIMARY KEY,
    version        VARCHAR(20) NOT NULL UNIQUE,
    content        TEXT        NOT NULL,
    is_current     BOOLEAN     NOT NULL DEFAULT FALSE,
    effective_from DATE        NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 4: ESTRUTURA DE LEARNING PATHS
-- ============================================================

-- Caminhos de aprendizagem (ex: Jornada Técnica, Power Skills)
CREATE TABLE IF NOT EXISTS learning_paths (
    id          BIGSERIAL    PRIMARY KEY,
    code        VARCHAR(80)  NOT NULL UNIQUE,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    image_url   TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Service Lines (ex: Hybrid Cloud, Application Operations)
CREATE TABLE IF NOT EXISTS service_lines (
    id               BIGSERIAL    PRIMARY KEY,
    learning_path_id BIGINT       NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    code             VARCHAR(80)  NOT NULL UNIQUE,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    image_url        TEXT,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Áreas dentro de Service Lines (ex: LowCode/OutSystems, DevOps)
CREATE TABLE IF NOT EXISTS areas (
    id              BIGSERIAL    PRIMARY KEY,
    service_line_id BIGINT       NOT NULL REFERENCES service_lines(id) ON DELETE CASCADE,
    code            VARCHAR(80)  NOT NULL UNIQUE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    image_url       TEXT,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Níveis dentro de Áreas (A=Júnior, B=Intermédio, C=Sénior, D=Especialista, E=Líder)
CREATE TABLE IF NOT EXISTS levels (
    id          BIGSERIAL    PRIMARY KEY,
    area_id     BIGINT       NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    code        VARCHAR(10)  NOT NULL,           -- ex: A, B, C, D, E
    name        VARCHAR(120) NOT NULL,
    rank_order  SMALLINT     NOT NULL CHECK (rank_order BETWEEN 1 AND 26),
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_levels_area_code  UNIQUE (area_id, code),
    CONSTRAINT uq_levels_area_rank  UNIQUE (area_id, rank_order)
);

-- Requisitos de cada nível (A1, A2, A3, B1, B2, ...)
CREATE TABLE IF NOT EXISTS requirements (
    id                    BIGSERIAL    PRIMARY KEY,
    level_id              BIGINT       NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    code                  VARCHAR(20)  NOT NULL,   -- ex: A1, A2
    title                 VARCHAR(255) NOT NULL,
    description           TEXT,
    evidence_instructions TEXT,                    -- o que o consultor deve submeter
    image_url             TEXT,
    display_order         SMALLINT     NOT NULL CHECK (display_order > 0),
    is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_requirements_level_code  UNIQUE (level_id, code),
    CONSTRAINT uq_requirements_level_order UNIQUE (level_id, display_order)
);

-- ============================================================
-- SECTION 5: BADGES E ACHIEVEMENTS
-- ============================================================

-- Definição de badge (1 por nível + badges especiais/premium)
CREATE TABLE IF NOT EXISTS badges (
    id                      BIGSERIAL     PRIMARY KEY,
    level_id                BIGINT        UNIQUE REFERENCES levels(id) ON DELETE SET NULL,  -- NULL = badge especial/premium
    code                    VARCHAR(100)  NOT NULL UNIQUE,
    badge_type              badge_type_t  NOT NULL DEFAULT 'level',
    name                    VARCHAR(200)  NOT NULL,
    description             TEXT,
    image_url               TEXT,
    points                  INTEGER       NOT NULL DEFAULT 0 CHECK (points >= 0),         -- req 13: pontos por badge
    has_expiration          BOOLEAN       NOT NULL DEFAULT FALSE,                          -- req 21
    valid_days              INTEGER       CHECK (valid_days IS NULL OR valid_days > 0),
    has_completion_deadline BOOLEAN       NOT NULL DEFAULT FALSE,                          -- prazo opcional para obter
    completion_days         INTEGER       CHECK (completion_days IS NULL OR completion_days > 0),
    is_active               BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Definições de conquistas especiais (req 14 + req 16 + bonus admin req 9 SL)
CREATE TABLE IF NOT EXISTS achievement_definitions (
    id           BIGSERIAL    PRIMARY KEY,
    code         VARCHAR(100) NOT NULL UNIQUE,
    name         VARCHAR(200) NOT NULL,
    description  TEXT,
    image_url    TEXT,
    badge_id     BIGINT       REFERENCES badges(id) ON DELETE SET NULL,  -- badge premium associado (opcional)
    points_bonus INTEGER      NOT NULL DEFAULT 0 CHECK (points_bonus >= 0),
    rule_config  JSONB,  -- ex: {"type":"badge_count","threshold":10,"period_days":365}
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Templates de certificados PDF por tipo de badge (req 18)
CREATE TABLE IF NOT EXISTS certificate_templates (
    id           BIGSERIAL    PRIMARY KEY,
    badge_type   badge_type_t NOT NULL,
    name         VARCHAR(200) NOT NULL,
    template_url TEXT         NOT NULL,    -- URL do template HTML/handlebars
    config       JSONB,                    -- layout, cores, logo, fontes
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    is_default   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 6: UTILIZADORES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id                   BIGSERIAL        PRIMARY KEY,
    language_id          BIGINT           REFERENCES languages(id) ON DELETE SET NULL,
    preferred_area_id    BIGINT           REFERENCES areas(id) ON DELETE SET NULL,      -- req 2
    full_name            VARCHAR(150)     NOT NULL,
    email                VARCHAR(254)     NOT NULL UNIQUE,
    password_hash        TEXT             NOT NULL,                    -- bcrypt hash
    account_status       account_status_t NOT NULL DEFAULT 'pending_confirmation',
    email_verified       BOOLEAN          NOT NULL DEFAULT FALSE,      -- req 1
    must_change_password BOOLEAN          NOT NULL DEFAULT TRUE,       -- req 1: 1ª entrada
    accepted_rgpd_at     TIMESTAMPTZ,                                  -- req 10
    rgpd_policy_id       BIGINT           REFERENCES rgpd_policies(id) ON DELETE SET NULL,
    first_login_at       TIMESTAMPTZ,                                  -- para saudação "Bem-vindo!"
    last_login_at        TIMESTAMPTZ,                                  -- req bonus: saudação após 15 dias
    created_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- N:M utilizadores ↔ roles
CREATE TABLE IF NOT EXISTS user_roles (
    id          BIGSERIAL   PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id     BIGINT      NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    assigned_by BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_roles UNIQUE (user_id, role_id)
);

-- Service Line Leader → Service Lines que gere
CREATE TABLE IF NOT EXISTS service_line_assignments (
    id              BIGSERIAL   PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_line_id BIGINT      NOT NULL REFERENCES service_lines(id) ON DELETE CASCADE,
    assigned_by     BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_line_assignments UNIQUE (user_id, service_line_id)
);

-- Preferências pessoais do utilizador
CREATE TABLE IF NOT EXISTS user_preferences (
    id                          BIGSERIAL   PRIMARY KEY,
    user_id                     BIGINT      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    remember_login              BOOLEAN     NOT NULL DEFAULT FALSE,         -- req geral login
    badge_public_by_default     BOOLEAN     NOT NULL DEFAULT FALSE,         -- req 24
    email_notifications_enabled BOOLEAN     NOT NULL DEFAULT TRUE,          -- req 20
    push_notifications_enabled  BOOLEAN     NOT NULL DEFAULT TRUE,          -- bonus mobile b
    linkedin_profile_url        TEXT,                                        -- req 11
    softinsa_profile_url        TEXT,                                        -- req 28
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 7: AUTENTICAÇÃO E SESSÕES
-- ============================================================

-- Sessões JWT / refresh tokens persistentes
CREATE TABLE IF NOT EXISTS user_sessions (
    id            BIGSERIAL   PRIMARY KEY,
    user_id       BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT        NOT NULL UNIQUE,
    user_agent    TEXT,
    ip_address    INET,
    device_info   JSONB,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMPTZ NOT NULL,
    revoked_at    TIMESTAMPTZ
);

-- Tokens de confirmação de email (req 1)
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id         BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ
);

-- Tokens de recuperação de password (req geral)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         BIGSERIAL   PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at    TIMESTAMPTZ
);

-- Tokens de dispositivos móveis para push notifications (bonus mobile b)
CREATE TABLE IF NOT EXISTS push_tokens (
    id            BIGSERIAL   PRIMARY KEY,
    user_id       BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token  TEXT        NOT NULL UNIQUE,
    platform      VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android')),
    is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 8: CANDIDATURAS (WORKFLOW)
-- ============================================================

-- Candidatura de um consultor a um badge
CREATE TABLE IF NOT EXISTS badge_applications (
    id                BIGSERIAL            PRIMARY KEY,
    applicant_user_id BIGINT               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id          BIGINT               NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
    status            application_status_t NOT NULL DEFAULT 'open',
    final_result      application_result_t,
    final_comment     TEXT,
    created_at        TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
    submitted_at      TIMESTAMPTZ,
    deadline_at       TIMESTAMPTZ,  -- prazo opcional definido pelo admin/badge
    approved_at       TIMESTAMPTZ,
    closed_at         TIMESTAMPTZ,
    CONSTRAINT chk_app_result CHECK (
        (status = 'closed' AND final_result IS NOT NULL)
        OR (status <> 'closed' AND final_result IS NULL)
    )
);

-- Evidências submetidas por requisito (req 5)
CREATE TABLE IF NOT EXISTS application_evidences (
    id                  BIGSERIAL   PRIMARY KEY,
    application_id      BIGINT      NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    requirement_id      BIGINT      NOT NULL REFERENCES requirements(id) ON DELETE RESTRICT,
    uploaded_by_user_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_name           VARCHAR(255) NOT NULL,
    storage_key         TEXT         NOT NULL, -- chave no object storage (S3/R2/Supabase)
    file_url            TEXT         NOT NULL,
    mime_type           VARCHAR(120),
    size_bytes          BIGINT       CHECK (size_bytes IS NULL OR size_bytes >= 0),
    description         TEXT,
    uploaded_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Decisões de Talent Manager e Service Line Leader (req 4 use case)
CREATE TABLE IF NOT EXISTS application_reviews (
    id               BIGSERIAL         PRIMARY KEY,
    application_id   BIGINT            NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    reviewer_user_id BIGINT            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reviewer_type    reviewer_type_t   NOT NULL,
    decision         review_decision_t NOT NULL,
    comment          TEXT,
    reviewed_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- Histórico auditável de todas as transições (req geral workflow + req SL/TM 19)
CREATE TABLE IF NOT EXISTS application_history (
    id             BIGSERIAL            PRIMARY KEY,
    application_id BIGINT               NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    actor_user_id  BIGINT               NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    from_status    application_status_t,
    to_status      application_status_t NOT NULL,
    event_type     VARCHAR(80)          NOT NULL, -- 'submitted', 'forwarded', 'approved', 'rejected', 'send_back'
    comment        TEXT,
    occurred_at    TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 9: BADGES ATRIBUÍDOS E GAMIFICATION
-- ============================================================

-- Badge atribuído ao utilizador após aprovação (req 7 + req 24-27)
CREATE TABLE IF NOT EXISTS user_badges (
    id                    BIGSERIAL   PRIMARY KEY,
    user_id               BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id              BIGINT      NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
    source_application_id BIGINT      UNIQUE REFERENCES badge_applications(id) ON DELETE SET NULL,
    awarded_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at            TIMESTAMPTZ,                                              -- req 21: expiração
    is_published          BOOLEAN     NOT NULL DEFAULT FALSE,                       -- req 24: galeria pública
    rgpd_accepted         BOOLEAN     NOT NULL DEFAULT FALSE,                       -- req 10: RGPD
    rgpd_accepted_at      TIMESTAMPTZ,
    points_awarded        INTEGER     NOT NULL DEFAULT 0 CHECK (points_awarded >= 0),
    public_token          VARCHAR(128) NOT NULL UNIQUE
                              DEFAULT encode(gen_random_bytes(24), 'hex'),          -- req 25-26: URL pública de verificação
    linkedin_shared_at    TIMESTAMPTZ,                                              -- req 11
    certificate_url       TEXT,                                                     -- req 18: PDF gerado
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ledger de pontos (req 13 + auditoria de gamification)
-- Nunca se actualiza, só se insere — o saldo é balance_after do último registo
CREATE TABLE IF NOT EXISTS point_transactions (
    id               BIGSERIAL        PRIMARY KEY,
    user_id          BIGINT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id         BIGINT           REFERENCES badges(id) ON DELETE SET NULL,
    user_badge_id    BIGINT           REFERENCES user_badges(id) ON DELETE SET NULL,
    achievement_id   BIGINT           REFERENCES achievement_definitions(id) ON DELETE SET NULL,
    transaction_type points_tx_type_t NOT NULL,
    points_delta     INTEGER          NOT NULL,  -- positivo = ganho; negativo = dedução
    balance_after    INTEGER          NOT NULL,  -- snapshot do saldo após esta transação
    note             TEXT,
    occurred_at      TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    created_by       BIGINT           REFERENCES users(id) ON DELETE SET NULL  -- NULL = sistema automático
);

-- Conquistas especiais ganhas pelo utilizador (req 14 + req 16 marcos)
CREATE TABLE IF NOT EXISTS user_achievements (
    id                        BIGSERIAL   PRIMARY KEY,
    user_id                   BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_definition_id BIGINT      NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
    trigger_context           JSONB,      -- dados que despoletaram o achievement
    celebrated                BOOLEAN     NOT NULL DEFAULT FALSE,  -- req 16: celebração mostrada no UI
    awarded_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_achievements UNIQUE (user_id, achievement_definition_id)
);

-- ============================================================
-- SECTION 10: COMUNICAÇÕES E NOTIFICAÇÕES
-- ============================================================

-- Notificações in-app (req 20)
CREATE TABLE IF NOT EXISTS notifications (
    id      BIGSERIAL           PRIMARY KEY,
    user_id BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type    notification_type_t NOT NULL,
    title   VARCHAR(255)        NOT NULL,
    message TEXT                NOT NULL,
    payload JSONB,              -- link, id da candidatura, etc.
    is_read BOOLEAN             NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Lembretes agendados por utilizador ou sistema (req 22)
CREATE TABLE IF NOT EXISTS reminders (
    id             BIGSERIAL   PRIMARY KEY,
    user_id        BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by     BIGINT      REFERENCES users(id) ON DELETE SET NULL,  -- NULL = sistema
    title          VARCHAR(255) NOT NULL,
    message        TEXT         NOT NULL,
    related_entity VARCHAR(60),  -- 'badge', 'level', 'application', 'objective'
    related_id     BIGINT,
    scheduled_for  TIMESTAMPTZ  NOT NULL,
    sent_at        TIMESTAMPTZ,
    dismissed_at   TIMESTAMPTZ
);

-- Avisos e informações genéricos (admin req 12 + bonus push page)
CREATE TABLE IF NOT EXISTS info_notices (
    id                 BIGSERIAL   PRIMARY KEY,
    created_by_user_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title              VARCHAR(255) NOT NULL,
    content            TEXT         NOT NULL,
    target_roles       TEXT[],      -- NULL = todos; ex: ARRAY['consultant','talent_manager']
    is_active          BOOLEAN      NOT NULL DEFAULT TRUE,
    starts_at          TIMESTAMPTZ  NOT NULL,
    ends_at            TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Templates de email configuráveis pelo admin (bonus req 23)
CREATE TABLE IF NOT EXISTS email_templates (
    id          BIGSERIAL   PRIMARY KEY,
    code        VARCHAR(100) NOT NULL UNIQUE,  -- ex: 'registration_confirm', 'badge_approved'
    name        VARCHAR(200) NOT NULL,
    subject     VARCHAR(255) NOT NULL,
    body_html   TEXT         NOT NULL,
    body_text   TEXT,
    variables   JSONB,        -- lista de variáveis suportadas: ["full_name","badge_name",...]
    language_id BIGINT        REFERENCES languages(id) ON DELETE SET NULL,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Config de assinatura de email com badges do utilizador (bonus req 12 + 23)
CREATE TABLE IF NOT EXISTS user_email_signatures (
    id                  BIGSERIAL   PRIMARY KEY,
    user_id             BIGINT      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    include_badges      BOOLEAN     NOT NULL DEFAULT FALSE,
    max_badges_shown    SMALLINT    NOT NULL DEFAULT 3 CHECK (max_badges_shown BETWEEN 1 AND 10),
    show_only_published BOOLEAN     NOT NULL DEFAULT TRUE,
    custom_template     TEXT,       -- HTML personalizado opcional
    generated_html      TEXT,       -- HTML gerado pela última vez pelo backend
    last_generated_at   TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 11: SLA
-- ============================================================

-- Configuração de SLAs por tipo de equipa (bonus admin req 10)
CREATE TABLE IF NOT EXISTS sla_policies (
    id                 BIGSERIAL   PRIMARY KEY,
    created_by_user_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    team_type          sla_team_t  NOT NULL,
    limit_hours        INTEGER     NOT NULL CHECK (limit_hours > 0),
    warning_at_percent SMALLINT    NOT NULL DEFAULT 80 CHECK (warning_at_percent BETWEEN 1 AND 99),
    is_active          BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sla_policies_team UNIQUE (team_type)  -- uma policy activa por tipo de equipa
);

-- Log de violações e avisos de SLA (bonus admin req 1 + 11)
CREATE TABLE IF NOT EXISTS sla_breach_logs (
    id                  BIGSERIAL   PRIMARY KEY,
    application_id      BIGINT      NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    sla_policy_id       BIGINT      NOT NULL REFERENCES sla_policies(id) ON DELETE RESTRICT,
    responsible_user_id BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    breach_type         VARCHAR(20) NOT NULL CHECK (breach_type IN ('warning', 'breach')),
    hours_elapsed       NUMERIC(8,2) NOT NULL,
    notified_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 12: TIMELINE E OBJETIVOS (Bonus mobile req a)
-- ============================================================

-- Eventos da timeline de evolução profissional do consultor
CREATE TABLE IF NOT EXISTS consultant_timeline_events (
    id                    BIGSERIAL   PRIMARY KEY,
    user_id               BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type            VARCHAR(60) NOT NULL,  -- 'badge_obtained','objective_set','milestone','training','certification'
    title                 VARCHAR(255) NOT NULL,
    description           TEXT,
    related_badge_id      BIGINT      REFERENCES badges(id) ON DELETE SET NULL,
    related_user_badge_id BIGINT      REFERENCES user_badges(id) ON DELETE SET NULL,
    event_date            DATE        NOT NULL,
    is_public             BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Objetivos de aprendizagem definidos pelo consultor ou Talent Manager (req 22 + req 16)
CREATE TABLE IF NOT EXISTS consultant_objectives (
    id              BIGSERIAL   PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by      BIGINT      REFERENCES users(id) ON DELETE SET NULL,  -- NULL = próprio consultor
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    target_badge_id BIGINT      REFERENCES badges(id) ON DELETE SET NULL,
    target_date     DATE        NOT NULL,
    completed_at    TIMESTAMPTZ,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 13: INTERNACIONALIZAÇÃO (bonus 3 idiomas)
-- ============================================================

-- Traduções de qualquer campo de qualquer entidade
-- Suporta: learning_paths, service_lines, areas, levels, requirements, badges, info_notices, email_templates
CREATE TABLE IF NOT EXISTS translations (
    id              BIGSERIAL    PRIMARY KEY,
    language_id     BIGINT       NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    entity_type     VARCHAR(60)  NOT NULL,  -- 'badge'|'level'|'requirement'|'area'|...
    entity_id       BIGINT       NOT NULL,
    field_name      VARCHAR(60)  NOT NULL,  -- 'name'|'description'|'evidence_instructions'|...
    translated_text TEXT         NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_translations UNIQUE (language_id, entity_type, entity_id, field_name)
);

-- ============================================================
-- SECTION 14: INTEGRAÇÕES EXTERNAS (bonus Teams/Slack)
-- ============================================================

CREATE TABLE IF NOT EXISTS integration_configs (
    id          BIGSERIAL              PRIMARY KEY,
    provider    integration_provider_t NOT NULL,
    config      JSONB                  NOT NULL,  -- webhook URL, tokens, channel IDs
    event_types TEXT[],                           -- quais eventos disparam esta integração
    is_active   BOOLEAN                NOT NULL DEFAULT FALSE,
    created_by  BIGINT                 REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_integration_provider UNIQUE (provider)
);

-- ============================================================
-- SECTION 15: PARTILHA PÚBLICA DE BADGES (req 11 + bonus 12)
-- ============================================================

CREATE TABLE IF NOT EXISTS badge_shares (
    id            BIGSERIAL        PRIMARY KEY,
    user_badge_id BIGINT           NOT NULL REFERENCES user_badges(id) ON DELETE CASCADE,
    platform      share_platform_t NOT NULL,
    share_url     TEXT,
    shared_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 16: CONFIGURAÇÃO GLOBAL DA PLATAFORMA
-- ============================================================

-- Key-value store para configuração global (admin req 7 + req 8 RGPD + integrações)
CREATE TABLE IF NOT EXISTS platform_config (
    id                 BIGSERIAL    PRIMARY KEY,
    config_key         VARCHAR(120) NOT NULL UNIQUE,
    config_value       TEXT,
    description        TEXT,
    updated_by_user_id BIGINT       REFERENCES users(id) ON DELETE SET NULL,
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 17: AUDITORIA GERAL
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGSERIAL   PRIMARY KEY,
    actor_id    BIGINT      REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,    -- ex: 'user.create', 'badge.update', 'application.approve'
    entity_type VARCHAR(60)  NOT NULL,
    entity_id   BIGINT,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  INET,
    user_agent  TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTION 18: INDEXES
-- ============================================================

-- Estrutura de aprendizagem
CREATE INDEX IF NOT EXISTS idx_service_lines_lp   ON service_lines (learning_path_id);
CREATE INDEX IF NOT EXISTS idx_areas_sl            ON areas (service_line_id);
CREATE INDEX IF NOT EXISTS idx_levels_area         ON levels (area_id);
CREATE INDEX IF NOT EXISTS idx_requirements_level  ON requirements (level_id);

-- Badges
CREATE INDEX IF NOT EXISTS idx_badges_level        ON badges (level_id);
CREATE INDEX IF NOT EXISTS idx_badges_type_active  ON badges (badge_type, is_active);

-- Utilizadores
CREATE INDEX IF NOT EXISTS idx_users_email         ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_area          ON users (preferred_area_id);
CREATE INDEX IF NOT EXISTS idx_users_status        ON users (account_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user     ON user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role     ON user_roles (role_id);
CREATE INDEX IF NOT EXISTS idx_sl_assign_user      ON service_line_assignments (user_id);
CREATE INDEX IF NOT EXISTS idx_sl_assign_sl        ON service_line_assignments (service_line_id);

-- Sessões e tokens
CREATE INDEX IF NOT EXISTS idx_sessions_user       ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires    ON user_sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user    ON push_tokens (user_id);

-- Candidaturas
CREATE INDEX IF NOT EXISTS idx_apps_applicant      ON badge_applications (applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_apps_badge          ON badge_applications (badge_id);
CREATE INDEX IF NOT EXISTS idx_apps_status         ON badge_applications (status);
CREATE INDEX IF NOT EXISTS idx_apps_submitted      ON badge_applications (submitted_at);
CREATE INDEX IF NOT EXISTS idx_evidences_app       ON application_evidences (application_id);
CREATE INDEX IF NOT EXISTS idx_evidences_req       ON application_evidences (requirement_id);
CREATE INDEX IF NOT EXISTS idx_reviews_app         ON application_reviews (application_id);
CREATE INDEX IF NOT EXISTS idx_history_app         ON application_history (application_id);
CREATE INDEX IF NOT EXISTS idx_history_occurred    ON application_history (occurred_at);

-- Badges atribuídos
CREATE INDEX IF NOT EXISTS idx_user_badges_user    ON user_badges (user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge   ON user_badges (badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_pub     ON user_badges (is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_badges_expires ON user_badges (expires_at) WHERE expires_at IS NOT NULL;

-- Pontos e achievements
CREATE INDEX IF NOT EXISTS idx_points_user         ON point_transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_points_occurred     ON point_transactions (occurred_at);
CREATE INDEX IF NOT EXISTS idx_achievements_user   ON user_achievements (user_id);

-- Notificações
CREATE INDEX IF NOT EXISTS idx_notif_user_unread   ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_reminders_due       ON reminders (user_id, scheduled_for) WHERE sent_at IS NULL;

-- SLA
CREATE INDEX IF NOT EXISTS idx_sla_breach_app      ON sla_breach_logs (application_id);

-- Timeline
CREATE INDEX IF NOT EXISTS idx_timeline_user       ON consultant_timeline_events (user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_objectives_user     ON consultant_objectives (user_id, target_date);

-- Traduções
CREATE INDEX IF NOT EXISTS idx_translations_entity ON translations (entity_type, entity_id);

-- Auditoria
CREATE INDEX IF NOT EXISTS idx_audit_actor         ON audit_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity        ON audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_occurred      ON audit_log (occurred_at);

-- ============================================================
-- SECTION 19: DADOS INICIAIS (SEED)
-- ============================================================

-- Idiomas (bonus: PT, EN, ES)
INSERT INTO languages (code, name, native_name) VALUES
    ('pt', 'Portuguese', 'Português'),
    ('en', 'English',    'English'),
    ('es', 'Spanish',    'Español')
ON CONFLICT (code) DO NOTHING;

-- Perfis / roles
INSERT INTO roles (code, name, description) VALUES
    ('admin',               'Administrador',        'Gestão global da plataforma, utilizadores, badges e configurações'),
    ('consultant',          'Consultor',             'Submete candidaturas, consulta badges e acompanha progressão'),
    ('talent_manager',      'Talent Manager',        'Valida evidências de candidaturas, transversal a todas as áreas'),
    ('service_line_leader', 'Service Line Leader',   'Validação final de candidaturas da sua Service Line')
ON CONFLICT (code) DO NOTHING;

-- Política RGPD inicial (req 10)
INSERT INTO rgpd_policies (version, content, is_current, effective_from) VALUES
    ('1.0',
     'Política de privacidade e RGPD da plataforma Softinsa Badges v1.0. O utilizador consente no tratamento dos seus dados pessoais para efeitos de certificação, publicação e partilha de competências profissionais verificáveis, de acordo com o RGPD (Regulamento (UE) 2016/679).',
     TRUE,
     CURRENT_DATE)
ON CONFLICT (version) DO NOTHING;

-- Learning Paths
INSERT INTO learning_paths (code, name, description) VALUES
    ('jornada-tecnica', 'Jornada Técnica', 'Learning path técnico principal da Softinsa — em desenvolvimento'),
    ('power-skills',    'Power Skills',    'Competências transversais e soft skills — suportado na BD, desenvolvimento futuro')
ON CONFLICT (code) DO NOTHING;

-- Configurações globais iniciais da plataforma
INSERT INTO platform_config (config_key, config_value, description) VALUES
    ('softinsa_website_url',        'https://www.softinsa.pt', 'URL do website Softinsa para integração pública (req 28)'),
    ('badge_public_base_url',       '',                        'URL base para páginas públicas de badges (req 25-26)'),
    ('email_sender_name',           'Softinsa Badges',         'Nome do remetente nos emails da plataforma'),
    ('email_sender_address',        '',                        'Endereço de email remetente'),
    ('default_language',            'pt',                      'Idioma padrão da plataforma'),
    ('linkedin_share_enabled',      'true',                    'Activar partilha de badges no LinkedIn (req 11)'),
    ('push_notifications_enabled',  'true',                    'Activar notificações push no mobile (bonus mobile b)'),
    ('teams_integration_enabled',   'false',                   'Activar integração com Microsoft Teams (bonus)'),
    ('slack_integration_enabled',   'false',                   'Activar integração com Slack (bonus)'),
    ('max_evidence_size_mb',        '20',                      'Tamanho máximo por ficheiro de evidência em MB (req 5)'),
    ('sla_warning_email_enabled',   'true',                    'Enviar email de aviso de SLA (bonus admin req 1)'),
    ('greeting_absence_days',       '15',                      'Dias de ausência para saudação especial (bonus greetings)'),
    ('default_completion_timezone', 'Europe/Lisbon',           'Timezone padrão para cálculo de prazos')
ON CONFLICT (config_key) DO NOTHING;

-- Definições de conquistas especiais iniciais (req 14 + req 16)
INSERT INTO achievement_definitions (code, name, description, points_bonus, rule_config) VALUES
    ('first_badge',        'Primeiro Badge',        'Obteve o seu primeiro badge na plataforma',                            50,  '{"type":"badge_count","threshold":1}'),
    ('junior_certified',   'Júnior Certificado',    'Obteve o badge de nível Júnior numa área',                             30,  '{"type":"level_code","level_code":"A"}'),
    ('senior_certified',   'Sénior Certificado',    'Obteve o badge de nível Sénior numa área',                             80,  '{"type":"level_code","level_code":"C"}'),
    ('expert_certified',   'Especialista',          'Obteve o badge de nível Especialista numa área',                       150, '{"type":"level_code","level_code":"D"}'),
    ('knowledge_leader',   'Líder de Conhecimento', 'Obteve o badge de nível Líder de Conhecimento numa área',              300, '{"type":"level_code","level_code":"E"}'),
    ('5_badges',           'Colecionador',          'Obteve 5 badges na plataforma',                                        100, '{"type":"badge_count","threshold":5}'),
    ('10_badges',          'Destaque',              'Obteve 10 badges na plataforma',                                       200, '{"type":"badge_count","threshold":10}'),
    ('all_levels_area',    'Mestre da Área',        'Completou todos os 5 níveis numa mesma área',                          500, '{"type":"all_levels_area"}'),
    ('speed_badge',        'Velocista',             'Obteve um badge em menos de 30 dias após candidatura',                 80,  '{"type":"badge_within_days","days":30}'),
    ('top_year',           'Top Performer do Ano',  'Obteve 10 ou mais badges num período de 365 dias',                    300, '{"type":"badge_count_period","threshold":10,"period_days":365}'),
    ('paid_certification', 'Certificação Paga',     'Completou uma certificação externa paga ou badge premium',             150, '{"type":"badge_type","badge_type":"premium"}'),
    ('multi_area',         'Polivalente',           'Obteve badges em 3 áreas diferentes',                                  200, '{"type":"distinct_areas","threshold":3}')
ON CONFLICT (code) DO NOTHING;

-- Templates de email base (bonus req 23)
INSERT INTO email_templates (code, name, subject, body_html, language_id)
SELECT v.code, v.name, v.subject, v.body_html, l.id
FROM (VALUES
    ('registration_confirm',
     'Confirmação de Registo',
     'Bem-vindo à Softinsa Badges — Confirme o seu email',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>Obrigado por se registar na plataforma Softinsa Badges.</p><p>Por favor confirme o seu email clicando <a href="{{verification_url}}">aqui</a>.</p><p>O link expira em 24 horas.</p>'),
    ('password_reset',
     'Recuperação de Password',
     'Softinsa Badges — Recuperação de password',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>Recebemos um pedido de recuperação de password.</p><p>Clique <a href="{{reset_url}}">aqui</a> para redefinir a sua password.</p><p>O link expira em 1 hora.</p>'),
    ('application_submitted',
     'Candidatura Recebida',
     'A sua candidatura ao badge {{badge_name}} foi recebida',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi recebida com sucesso e encontra-se agora em análise.</p>'),
    ('application_forwarded',
     'Candidatura Enviada para Validação Final',
     'A sua candidatura ao badge {{badge_name}} avançou para validação final',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi validada pelo Talent Manager e encontra-se agora em validação final pelo Service Line Leader.</p>'),
    ('application_approved',
     'Badge Aprovado! 🎉',
     'Parabéns! O seu badge {{badge_name}} foi aprovado',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>Parabéns! O seu badge <strong>{{badge_name}}</strong> foi aprovado.</p><p>Aceda à plataforma para publicar e partilhar a sua conquista.</p>'),
    ('application_rejected',
     'Candidatura Rejeitada',
     'Informação sobre a sua candidatura ao badge {{badge_name}}',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> não foi aprovada.</p><p>Motivo: {{reason}}</p>'),
    ('application_send_back',
     'Candidatura Devolvida para Revisão',
     'A sua candidatura ao badge {{badge_name}} requer revisão',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi devolvida para revisão.</p><p>Comentário: {{comment}}</p><p>Aceda à plataforma para efectuar as correcções necessárias.</p>'),
    ('badge_expiring_soon',
     'Badge a Expirar em Breve',
     'O seu badge {{badge_name}} expira em {{days_remaining}} dias',
     '<p>Olá <strong>{{full_name}}</strong>,</p><p>O seu badge <strong>{{badge_name}}</strong> expira a <strong>{{expiry_date}}</strong>.</p><p>Renove a sua certificação para manter o badge activo.</p>'),
    ('sla_warning',
     'Aviso de SLA — Candidatura Pendente',
     'Candidatura #{{application_id}} pendente há {{hours}} horas',
     '<p>Existe uma candidatura pendente de revisão há <strong>{{hours}} horas</strong>.</p><p>Candidatura: <strong>#{{application_id}}</strong> — Badge: <strong>{{badge_name}}</strong></p><p>Por favor proceda à revisão para evitar violação de SLA.</p>')
) AS v(code, name, subject, body_html)
JOIN languages l ON l.code = 'pt'
ON CONFLICT (code) DO NOTHING;

COMMIT;

-- ============================================================
-- NOTAS DE IMPLEMENTAÇÃO
-- ============================================================
-- 1. HASH DE PASSWORDS: usar bcrypt com cost >= 12. O campo
--    password_hash é TEXT porque o hash bcrypt é uma string.
--
-- 2. OBJECT STORAGE: os ficheiros de evidências e imagens de
--    badges devem ser guardados num bucket S3-compatible
--    (Cloudflare R2, Supabase Storage, AWS S3). O campo
--    storage_key guarda a chave interna; file_url guarda a URL
--    pública ou signed URL.
--
-- 3. PUBLIC TOKEN: o campo user_badges.public_token é gerado
--    automaticamente com gen_random_bytes(24) → 48 chars hex.
--    A URL pública será: {badge_public_base_url}/verify/{public_token}
--
-- 4. PONTOS: o saldo de pontos de um utilizador calcula-se com:
--    SELECT balance_after FROM point_transactions
--    WHERE user_id = $1 ORDER BY occurred_at DESC LIMIT 1;
--
-- 5. RANKING: calcular com:
--    SELECT u.id, u.full_name, SUM(pt.points_delta) AS total
--    FROM point_transactions pt JOIN users u ON u.id = pt.user_id
--    GROUP BY u.id ORDER BY total DESC;
--
-- 6. SAUDAÇÕES (bonus):
--    - Primeiro login (first_login_at IS NULL)      → "Bem-vindo!"
--    - last_login_at < NOW() - INTERVAL '15 days'   → "Seja bem-vindo novamente"
--    - Resto (por hora do dia no client/server)     → "Bom dia/tarde/noite"
--
-- 7. EXPIRAÇÃO DE BADGES: job agendado que verifica:
--    SELECT * FROM user_badges
--    WHERE expires_at IS NOT NULL
--    AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '30 days'
--    AND is_published = TRUE;
--
-- 8. ACHIEVEMENTS AUTOMÁTICOS: após cada atribuição de badge,
--    o backend avalia rule_config de cada achievement_definition
--    activa e, se aplicável, insere em user_achievements e
--    point_transactions.
-- ============================================================
