# Fase 1 - ERD e Modelo de Dados

## Entidades principais

- users
- roles
- user_roles
- learning_paths
- service_lines
- areas
- levels
- badges
- requirements
- badge_applications
- application_evidences
- application_reviews
- application_history
- user_badges
- point_transactions
- notifications
- reminders
- info_notices
- sla_policies
- password_reset_tokens
- translations
- languages

## Mermaid ER Diagram

```mermaid
erDiagram
    LANGUAGES ||--o{ USERS : prefers
    LANGUAGES ||--o{ TRANSLATIONS : contains

    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : grants

    LEARNING_PATHS ||--o{ SERVICE_LINES : contains
    SERVICE_LINES ||--o{ AREAS : contains
    AREAS ||--o{ LEVELS : contains
    LEVELS ||--|| BADGES : awards
    LEVELS ||--o{ REQUIREMENTS : requires

    AREAS ||--o{ USERS : prefers
    SERVICE_LINES ||--o{ SERVICE_LINE_ASSIGNMENTS : scopes
    USERS ||--o{ SERVICE_LINE_ASSIGNMENTS : assigned

    USERS ||--o{ BADGE_APPLICATIONS : submits
    BADGES ||--o{ BADGE_APPLICATIONS : target

    BADGE_APPLICATIONS ||--o{ APPLICATION_EVIDENCES : includes
    REQUIREMENTS ||--o{ APPLICATION_EVIDENCES : proves
    USERS ||--o{ APPLICATION_EVIDENCES : uploads

    BADGE_APPLICATIONS ||--o{ APPLICATION_REVIEWS : reviewed_by
    USERS ||--o{ APPLICATION_REVIEWS : performs

    BADGE_APPLICATIONS ||--o{ APPLICATION_HISTORY : tracks
    USERS ||--o{ APPLICATION_HISTORY : triggers

    USERS ||--o{ USER_BADGES : owns
    BADGES ||--o{ USER_BADGES : awarded_as
    BADGE_APPLICATIONS o|--|| USER_BADGES : generates

    USERS ||--o{ POINT_TRANSACTIONS : receives
    BADGES ||--o{ POINT_TRANSACTIONS : derives
    USER_BADGES ||--o{ POINT_TRANSACTIONS : justified_by

    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ REMINDERS : receives
    USERS ||--o{ INFO_NOTICES : creates
    USERS ||--o{ PASSWORD_RESET_TOKENS : resets
    USERS ||--o{ SLA_POLICIES : configures

    LANGUAGES {
      bigint id PK
      string code UK
      string name
      string native_name
    }

    USERS {
      bigint id PK
      bigint language_id FK
      bigint preferred_area_id FK
      string full_name
      string email UK
      string password_hash
      string account_status
      boolean email_verified
      boolean must_change_password
      timestamptz created_at
    }

    ROLES {
      bigint id PK
      string code UK
      string name
    }

    USER_ROLES {
      bigint id PK
      bigint user_id FK
      bigint role_id FK
      timestamptz assigned_at
    }

    LEARNING_PATHS {
      bigint id PK
      string code UK
      string name
      boolean is_active
    }

    SERVICE_LINES {
      bigint id PK
      bigint learning_path_id FK
      string code UK
      string name
      boolean is_active
    }

    AREAS {
      bigint id PK
      bigint service_line_id FK
      string code UK
      string name
      boolean is_active
    }

    LEVELS {
      bigint id PK
      bigint area_id FK
      string code
      string name
      int rank_order
      boolean is_active
    }

    BADGES {
      bigint id PK
      bigint level_id FK
      string code UK
      string badge_type
      string name
      int points
      boolean has_expiration
      int valid_days
    }

    REQUIREMENTS {
      bigint id PK
      bigint level_id FK
      string code
      string title
      int display_order
      boolean is_active
    }

    BADGE_APPLICATIONS {
      bigint id PK
      bigint applicant_user_id FK
      bigint badge_id FK
      string status
      timestamptz submitted_at
      timestamptz deadline_at
      timestamptz closed_at
    }

    APPLICATION_EVIDENCES {
      bigint id PK
      bigint application_id FK
      bigint requirement_id FK
      bigint uploaded_by_user_id FK
      string file_name
      string file_url
      string mime_type
    }

    APPLICATION_REVIEWS {
      bigint id PK
      bigint application_id FK
      bigint reviewer_user_id FK
      string reviewer_type
      string decision
      timestamptz reviewed_at
    }

    APPLICATION_HISTORY {
      bigint id PK
      bigint application_id FK
      bigint actor_user_id FK
      string from_status
      string to_status
      timestamptz event_at
    }

    USER_BADGES {
      bigint id PK
      bigint user_id FK
      bigint badge_id FK
      bigint source_application_id FK
      string public_token UK
      int points_awarded
      timestamptz awarded_at
      timestamptz expires_at
      boolean is_published
    }

    POINT_TRANSACTIONS {
      bigint id PK
      bigint user_id FK
      bigint badge_id FK
      bigint user_badge_id FK
      int points_delta
      string transaction_type
      timestamptz occurred_at
    }

    NOTIFICATIONS {
      bigint id PK
      bigint user_id FK
      string type
      string title
      boolean is_read
    }

    REMINDERS {
      bigint id PK
      bigint user_id FK
      string title
      timestamptz scheduled_for
      timestamptz sent_at
    }

    INFO_NOTICES {
      bigint id PK
      bigint created_by_user_id FK
      string title
      timestamptz starts_at
      timestamptz ends_at
      boolean is_active
    }

    SLA_POLICIES {
      bigint id PK
      bigint created_by_user_id FK
      string team_type
      int limit_hours
      boolean is_active
    }

    PASSWORD_RESET_TOKENS {
      bigint id PK
      bigint user_id FK
      string token UK
      timestamptz expires_at
      timestamptz used_at
    }

    TRANSLATIONS {
      bigint id PK
      bigint language_id FK
      string entity_type
      bigint entity_id
      string field_name
    }
```

## Regras de modelacao mais importantes

### Badge por nivel

- Cada nivel tem exatamente um badge principal.
- Isto fica garantido com `badges.level_id unique`.

### Candidatura com workflow auditavel

- `badge_applications` guarda o estado atual.
- `application_reviews` guarda as decisoes do Talent Manager e do Service Line Leader.
- `application_history` guarda cada transicao de estado para auditoria.

### Evidencias por requisito

- Uma candidatura pode ter varias evidencias.
- Cada evidencia pode ser associada ao requisito que pretende comprovar.

### Badge atribuido e pagina publica

- `user_badges.public_token` e o identificador publico da pagina de verificacao.
- `is_published` controla se o badge esta ou nao exposto publicamente.

### Pontos imutaveis

- `points_awarded` em `user_badges` preserva os pontos atribuidos na data da aprovacao.
- `point_transactions` garante historico financeiro do sistema de gamification.

### Scoping por service line

- `service_line_assignments` define que leaders podem operar sobre que service lines.
- Para Talent Manager, o acesso global pode ser tratado em autorizacao por role, sem depender desta tabela.