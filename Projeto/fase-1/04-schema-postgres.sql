CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('pending_confirmation', 'active', 'inactive', 'suspended');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'badge_type') THEN
        CREATE TYPE badge_type AS ENUM ('level', 'special', 'premium');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('open', 'submitted', 'in_review', 'send_back', 'approved', 'rejected', 'closed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reviewer_type') THEN
        CREATE TYPE reviewer_type AS ENUM ('talent_manager', 'service_line_leader');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_decision') THEN
        CREATE TYPE review_decision AS ENUM ('approve', 'reject', 'send_back', 'request_changes');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('system', 'application', 'badge', 'reminder', 'sla', 'announcement');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'points_transaction_type') THEN
        CREATE TYPE points_transaction_type AS ENUM ('badge_award', 'achievement_bonus', 'manual_adjustment');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS languages (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_lines (
    id BIGSERIAL PRIMARY KEY,
    learning_path_id BIGINT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS areas (
    id BIGSERIAL PRIMARY KEY,
    service_line_id BIGINT NOT NULL REFERENCES service_lines(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS levels (
    id BIGSERIAL PRIMARY KEY,
    area_id BIGINT NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    rank_order SMALLINT NOT NULL CHECK (rank_order > 0),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_levels_area_code UNIQUE (area_id, code),
    CONSTRAINT uq_levels_area_rank UNIQUE (area_id, rank_order)
);

CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    level_id BIGINT UNIQUE REFERENCES levels(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    badge_type badge_type NOT NULL DEFAULT 'level',
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    has_expiration BOOLEAN NOT NULL DEFAULT FALSE,
    valid_days INTEGER CHECK (valid_days IS NULL OR valid_days > 0),
    has_completion_deadline BOOLEAN NOT NULL DEFAULT FALSE,
    completion_days INTEGER CHECK (completion_days IS NULL OR completion_days > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requirements (
    id BIGSERIAL PRIMARY KEY,
    level_id BIGINT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    evidence_instructions TEXT,
    display_order SMALLINT NOT NULL CHECK (display_order > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_requirements_level_code UNIQUE (level_id, code),
    CONSTRAINT uq_requirements_level_order UNIQUE (level_id, display_order)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    language_id BIGINT REFERENCES languages(id) ON DELETE SET NULL,
    preferred_area_id BIGINT REFERENCES areas(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    account_status account_status NOT NULL DEFAULT 'pending_confirmation',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
    accepted_rgpd_at TIMESTAMPTZ,
    first_login_completed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_roles UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS service_line_assignments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_line_id BIGINT NOT NULL REFERENCES service_lines(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_line_assignments UNIQUE (user_id, service_line_id)
);

CREATE TABLE IF NOT EXISTS badge_applications (
    id BIGSERIAL PRIMARY KEY,
    applicant_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
    status application_status NOT NULL DEFAULT 'open',
    final_result VARCHAR(50),
    final_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    deadline_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS application_evidences (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    requirement_id BIGINT NOT NULL REFERENCES requirements(id) ON DELETE RESTRICT,
    uploaded_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_name VARCHAR(255) NOT NULL,
    storage_key TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(120),
    size_bytes BIGINT CHECK (size_bytes IS NULL OR size_bytes >= 0),
    description TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_reviews (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    reviewer_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reviewer_type reviewer_type NOT NULL,
    decision review_decision NOT NULL,
    comment TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_history (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES badge_applications(id) ON DELETE CASCADE,
    actor_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    from_status application_status,
    to_status application_status NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    comment TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE RESTRICT,
    source_application_id BIGINT UNIQUE REFERENCES badge_applications(id) ON DELETE SET NULL,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    rgpd_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    rgpd_accepted_at TIMESTAMPTZ,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    public_token VARCHAR(128) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex')
);

CREATE TABLE IF NOT EXISTS point_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id BIGINT REFERENCES badges(id) ON DELETE SET NULL,
    user_badge_id BIGINT REFERENCES user_badges(id) ON DELETE SET NULL,
    transaction_type points_transaction_type NOT NULL,
    points_delta INTEGER NOT NULL,
    note TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievement_definitions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    points_bonus INTEGER NOT NULL DEFAULT 0,
    rule_config JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_definition_id BIGINT NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
    source_context JSONB,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_achievements UNIQUE (user_id, achievement_definition_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    payload JSONB,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    payload JSONB
);

CREATE TABLE IF NOT EXISTS info_notices (
    id BIGSERIAL PRIMARY KEY,
    created_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_roles TEXT[],
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sla_policies (
    id BIGSERIAL PRIMARY KEY,
    created_by_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    team_type reviewer_type NOT NULL,
    limit_hours INTEGER NOT NULL CHECK (limit_hours > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sla_policies_team UNIQUE (team_type)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(128) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS translations (
    id BIGSERIAL PRIMARY KEY,
    language_id BIGINT NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_translations_entity UNIQUE (language_id, entity_type, entity_id, field_name)
);

CREATE INDEX IF NOT EXISTS idx_service_lines_learning_path ON service_lines (learning_path_id);
CREATE INDEX IF NOT EXISTS idx_areas_service_line ON areas (service_line_id);
CREATE INDEX IF NOT EXISTS idx_levels_area ON levels (area_id);
CREATE INDEX IF NOT EXISTS idx_requirements_level ON requirements (level_id);
CREATE INDEX IF NOT EXISTS idx_users_preferred_area ON users (preferred_area_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON badge_applications (applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_applications_badge ON badge_applications (badge_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON badge_applications (status);
CREATE INDEX IF NOT EXISTS idx_application_reviews_application ON application_reviews (application_id);
CREATE INDEX IF NOT EXISTS idx_application_history_application ON application_history (application_id);
CREATE INDEX IF NOT EXISTS idx_evidences_application ON application_evidences (application_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders (user_id, scheduled_for);

INSERT INTO roles (code, name, description)
VALUES
    ('admin', 'Administrador', 'Gestao global da plataforma'),
    ('consultant', 'Consultor', 'Submete candidaturas e acompanha badges'),
    ('talent_manager', 'Talent Manager', 'Valida evidencias e acompanha workflow'),
    ('service_line_leader', 'Service Line Leader', 'Valida badges da sua service line')
ON CONFLICT (code) DO NOTHING;

INSERT INTO languages (code, name, native_name)
VALUES
    ('pt', 'Portuguese', 'Portugues'),
    ('en', 'English', 'English'),
    ('es', 'Spanish', 'Espanol')
ON CONFLICT (code) DO NOTHING;