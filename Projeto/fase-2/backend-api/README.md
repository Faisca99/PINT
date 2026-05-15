# PINT 2025 — Backend API (NestJS)
> Plataforma de Badges da Softinsa | Fase 2 completa + extensões Fase 4

## Stack

- **Runtime:** Node.js 20+ / TypeScript
- **Framework:** NestJS
- **Base de Dados:** PostgreSQL (Neon cloud)
- **Autenticação:** Header `x-user-id` (suficiente para contexto académico)

## Arranque

```bash
cd fase-2/backend-api
npm install
npm run start:dev
# → http://localhost:3001/api/v1
```

> Variáveis de ambiente em `.env` (já preenchido com a connection string Neon).

## Autenticação

Todos os endpoints protegidos leem o utilizador autenticado pelo header HTTP:
```
x-user-id: [id do utilizador]
```
O frontend injeta este header automaticamente via interceptor Axios em `fase-3-frontend/src/lib/api.ts`.

## Contas de teste

| Email | Password | Role |
|---|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` | Consultor |
| `santos@softinsa.pt` | `Softinsa2025!` | Consultor |
| `rocha@softinsa.pt` | `Softinsa2025!` | Consultor |
| `faisca@softinsa.pt` | `Softinsa2025!` | Talent Manager |
| `beselga@softinsa.pt` | `Softinsa2025!` | Service Line Leader |
| `admin@softinsa.pt` | `Softinsa2025!` | Administrador |

## Endpoints disponíveis

### Auth (`/api/v1/auth`)
```
POST   /login              → { email, password } → token + user
GET    /areas              → áreas para picker de registo
POST   /register           → criar conta de consultor
POST   /change-password    → alterar password (x-user-id obrigatório)
POST   /forgot-password    → iniciar recuperação de password
POST   /reset-password     → redefinir password com token
GET    /me                 → perfil do utilizador autenticado
```

### Badges (`/api/v1/badges`)
```
GET    /badges             → catálogo completo (ativos)
GET    /badges/:id         → detalhe com requisitos
```

### Candidaturas (`/api/v1/applications`)
```
GET    /applications           → todas (para TM/SLL)
GET    /applications/mine      → candidaturas do utilizador autenticado
GET    /applications/:id       → detalhe com evidências (json_agg)
GET    /applications/:id/history → histórico de estados
POST   /applications           → criar candidatura
POST   /applications/:id/evidences → adicionar evidência
POST   /applications/:id/submit    → submeter ao TM
POST   /applications/:id/approve   → TM: validar → SLL | SLL: aprovar → badge
POST   /applications/:id/reject    → SLL rejeitar (só SLL)
POST   /applications/:id/send-back → devolver ao consultor (TM ou SLL)
```

### Perfil (`/api/v1/me`)
```
GET    /me/dashboard           → pontos + badge_count + objetivos
GET    /me/badges              → badges ganhos
GET    /me/recommendations     → próximos badges sugeridos
GET    /me/achievements        → conquistas (verifica e atribui automaticamente)
GET    /me/leaderboard         → ranking global por pontos
GET    /me/timeline            → timeline de eventos
GET    /me/timeline/:userId    → timeline de outro utilizador (para TM/SLL)
GET    /me/reminders           → lembretes
POST   /me/reminders           → criar lembrete
POST   /me/reminders/:id/dismiss → dispensar lembrete
GET    /me/notifications       → notificações in-app
POST   /me/notifications/read  → marcar todas como lidas
POST   /me/badges/:id/publish  → publicar badge (RGPD aceite)
GET    /me/verify/:token       → verificar badge público (sem auth)
GET    /me/gallery/:userId     → galeria pública de badges
```

### Utilizadores (`/api/v1/users`)
```
GET    /users                  → lista de utilizadores ativos (para TM/SLL)
```

### Relatórios (`/api/v1/reports`)
```
GET    /reports/applications   → candidaturas com filtros (status, area, service_line, from, to)
GET    /reports/summary        → contagens globais (pending_tm, pending_sll, approved, rejected, total)
GET    /reports/kpis           → KPIs: mensal, por LP, por nível, por utilizadores
GET    /reports/badges         → lista de badges com contagem de atribuições
```

### Admin (`/api/v1/admin`)
```
GET    /admin/users                     → todos os utilizadores
POST   /admin/users                     → criar utilizador
PATCH  /admin/users/:id/role            → alterar role
PATCH  /admin/users/:id/status          → ativar/suspender

GET    /admin/badges                    → todos os badges (incluindo inativos)
POST   /admin/badges                    → criar badge
PATCH  /admin/badges/:id                → editar badge (nome, pontos, expiração, is_active)

GET    /admin/structure                 → árvore LP → SL → Áreas → Níveis → Requisitos
PATCH  /admin/structure/:entity/:id/status → ativar/inativar entidade
POST   /admin/learning-paths            → criar LP
POST   /admin/service-lines             → criar SL
POST   /admin/areas                     → criar área
POST   /admin/levels                    → criar nível
POST   /admin/requirements              → criar requisito

GET    /admin/notices                   → todos os avisos
GET    /admin/notices/active?role=X     → avisos ativos para um role
POST   /admin/notices                   → criar aviso
PATCH  /admin/notices/:id/status        → ativar/desativar
DELETE /admin/notices/:id               → remover aviso

GET    /admin/slas                      → políticas SLA
POST   /admin/slas                      → criar política SLA
PATCH  /admin/slas/:id/status           → ativar/desativar SLA

GET    /admin/integrations              → configurações Teams/Slack
POST   /admin/integrations              → guardar webhook URL

GET    /admin/rgpd                      → políticas RGPD
POST   /admin/rgpd                      → criar nova política

GET    /admin/roles                     → roles disponíveis
GET    /admin/areas                     → áreas (para pickers)
GET    /admin/levels                    → níveis (para pickers)
```

## Estrutura do código

```
src/
├── common/
│   ├── auth/auth.helper.ts   ← getUserIdFromHeader() — usar em TODOS os novos controllers
│   ├── constants.ts          ← constantes globais (ROLES, PAGINATION, etc.)
│   ├── database/             ← DatabaseService
│   ├── email/                ← EmailService (global, sem SMTP faz log na consola)
│   └── webhook/              ← WebhookService (Teams/Slack)
├── auth/                     ← login, registo, recuperação de password
├── applications/             ← workflow completo de candidaturas
├── badges/                   ← catálogo de badges
├── dashboard/                ← endpoints /me/*
├── users/                    ← lista de utilizadores
├── reports/                  ← relatórios e KPIs
└── admin/                    ← gestão completa da plataforma
```

## Notas importantes

- **Emails:** Sem SMTP configurado no `.env`, os emails são logados na consola. Para envio real, configurar `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- **Teams/Slack:** Configurar webhook em `/admin/integracoes` no frontend. Dispara quando SLL aprova um badge.
- **Workflow:** TM só pode validar (→ in_validation) ou devolver. SLL pode aprovar, rejeitar ou devolver. TM não tem botão de rejeitar.
