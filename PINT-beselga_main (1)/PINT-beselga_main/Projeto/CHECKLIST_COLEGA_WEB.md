# PINT 2025 — Checklist para o Colega (Web)
> Plataforma de Badges da Softinsa — Fase 3 & 4 concluídas
> Data: Maio 2026 | Entrega: 27 Junho 2026

---

## 🚀 Como arrancar o projeto

```bash
# Backend
cd fase-2/backend-api
npm install
npm run start:dev
# → http://localhost:3001/api/v1

# Frontend
cd fase-3-frontend
npm install
npm run dev
# → http://localhost:3000
```

**Contas de teste (BD actualizada 15/05/2026):**

| Email | Password | Role | Nome |
|---|---|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` | Consultor | Francisco Abreu |
| `santos@softinsa.pt` | `Softinsa2025!` | Consultor | Tiago Santos |
| `rocha@softinsa.pt` | `Softinsa2025!` | Consultor | Victor Rocha |
| `faisca@softinsa.pt` | `Softinsa2025!` | Talent Manager | Daniel Faísca |
| `beselga@softinsa.pt` | `Softinsa2025!` | Service Line Leader | José Beselga |
| `admin@softinsa.pt` | `Softinsa2025!` | Administrador | Administrador Softinsa |

---

## 🔴 VERIFICAÇÃO OBRIGATÓRIA — Testar antes da entrega

### Workflow completo (testar ponta a ponta)
- [ ] Login como **consultor** → criar candidatura → submeter com evidências
- [ ] Login como **TM** → inbox → "Validar e Enviar para SLL" → confirmar estado `in_validation`
- [ ] Login como **SLL** → inbox → "Aprovar e Atribuir Badge" → badge aparece em "Meus Badges"
- [ ] Testar "Devolver (Incorreto)" pelo TM → candidatura volta a `open`
- [ ] Testar "Devolver ao Consultor" pelo SLL → candidatura volta a `open`
- [ ] Testar "Rejeitar" pelo SLL → candidatura fecha como `rejected`
- [ ] Verificar que TM **não tem** botão de Rejeitar (só Validar e Devolver)
- [ ] Verificar que badge ganho aparece com `public_token` em "Meus Badges"
- [ ] Testar link de verificação pública `/verify/[token]`

### Estado actual da BD (dump 15/05/2026) ✅

Os scripts SQL já foram executados — a BD está completa:

| Entidade | Quantidade |
|---|---|
| Service Lines | 3 (Hybrid Cloud, Application Operations, Sourcing & Talent Management) |
| Áreas | 3 (LowCode, DevSecOps & IT Automation, Talent Management) |
| Níveis | 15 (A-E × 3 áreas) |
| Badges | 15 (um por nível) |
| Requisitos | 30+ (2 por badge) |
| Conquistas | 19 definições (first_badge, junior_certified, BADGES_3, etc.) |

> ~~`fase-2/09-seed-achievements.sql`~~ ✅ já na BD
> ~~`fase-2/10-seed-estrutura-completa.sql`~~ ✅ já na BD

---

## 🟡 FUNCIONALIDADES A COMPLETAR/MELHORAR

### Email (configuração SMTP)
Para envio real de emails, adicionar ao `.env` do backend:
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=[obtido no mailtrap.io]
SMTP_PASS=[obtido no mailtrap.io]
SMTP_FROM=badges@softinsa.pt
```
> Mailtrap é gratuito para desenvolvimento: https://mailtrap.io
> Sem SMTP configurado, os emails são apenas logados na consola do backend.

- [ ] Configurar SMTP e testar envio de email após submissão de candidatura
- [ ] Testar email de aprovação/rejeição ao consultor
- [ ] Testar email de notificação ao TM quando consultor submete

### Integrações Teams/Slack
- [ ] Ir a `/admin/integracoes`, inserir o webhook URL do Teams ou Slack
- [ ] Testar aprovação de badge → confirmar notificação chega ao canal

### Constantes centralizadas (boa prática)
O ficheiro `fase-3-frontend/src/lib/constants.ts` tem as constantes centralizadas mas alguns componentes ainda usam `PAGE_SIZE = 10` local.
- [ ] Substituir `const PAGE_SIZE = 10` locais por `import { PAGE_SIZE } from "@/lib/constants"`

### Queries sem LIMIT (performance)
- [ ] `users.service.ts` — `list()` devolve TODOS os utilizadores sem limite
- [ ] `applications.service.ts` — `list()` devolve TODAS as candidaturas sem limite
- [ ] Adicionar `LIMIT 500 OFFSET $N` para evitar problemas com datasets grandes

---

## 🟢 BÓNUS — Se houver tempo

- [ ] **Traduções completas** — `src/lib/i18n.ts` tem PT/EN/ES mas só o sidebar usa. Aplicar `t("chave")` ao dashboard, login, catálogo, etc.
- [ ] **Testes unitários** — nenhum existe actualmente. Usar Jest + React Testing Library
- [ ] **Saudação contextual** aplicada a mais páginas além do dashboard

---

## 🏗️ ESTRUTURA DO CÓDIGO

### Backend (`fase-2/backend-api/src/`)

```
common/
├── auth/auth.helper.ts       ← getUserIdFromHeader() — usar em TODOS os novos controllers
├── constants.ts              ← constantes globais (ROLES, PAGINATION, etc.)
├── database/                 ← DatabaseService (injetar via módulo)
├── email/                    ← EmailService (global — disponível sem importar)
└── webhook/                  ← WebhookService (Teams/Slack — global)

auth/           → login, registo, recuperar/alterar password
applications/   → candidaturas + workflow completo (approve, reject, send-back)
badges/         → catálogo de badges
dashboard/      → endpoints /me/* (dados do utilizador autenticado)
users/          → listagem de utilizadores (para TM/SLL)
reports/        → relatórios, KPIs, exportação
admin/          → gestão completa (utilizadores, badges, estrutura, avisos, SLA, RGPD, integrações)
```

**Regras para novos endpoints:**
1. Usar sempre `getUserIdFromHeader(header)` para validar o `x-user-id`
2. Injetar `EmailService` e `WebhookService` via constructor (são globais)
3. Queries com parâmetros de enum PostgreSQL → usar cast explícito: `$1::application_status_t`
4. `jsonb_build_object` com parâmetros numéricos → usar `$1::bigint`

### Frontend (`fase-3-frontend/src/`)

```
app/                     ← páginas Next.js (App Router)
├── admin/               ← dashboard + gestão admin
│   ├── page.tsx         ← dashboard do admin
│   ├── utilizadores/    ← gestão de utilizadores
│   ├── badges/          ← gestão de badges
│   ├── estrutura/       ← LP/SL/Áreas/Níveis/Requisitos
│   ├── avisos/          ← avisos
│   ├── notificacoes/    ← configuração notificações
│   ├── rgpd/            ← políticas RGPD
│   ├── integracoes/     ← Teams/Slack
│   └── sla/             ← SLAs
├── validacao/           ← inbox TM e SLL (com paginação + pesquisa)
├── candidaturas/        ← candidaturas do consultor
├── badges/              ← catálogo público
└── ...

components/
├── AppLayout.tsx         ← wrapper com sidebar, header, logout modal, selector de língua
├── AppSidebar.tsx        ← nav adaptada por role + traduções i18n
├── NotificationBell.tsx  ← sino de notificações (polling 30s)
└── SoftinsaLogo.tsx      ← logo SVG hexágono com gradient

lib/
├── api.ts               ← axios com interceptor automático de x-user-id
├── user-context.tsx     ← estado global de autenticação (useUser())
├── constants.ts         ← PAGE_SIZE=10, LEVEL_COLORS, STATUS_LABELS, etc.
├── i18n.ts              ← traduções PT/EN/ES + getLang()/setLang()
├── greeting.ts          ← saudação contextual (Bom dia/tarde/noite)
└── certificate.ts       ← gerador de PDF (jspdf)
```

**Regras para novos componentes:**
1. **NUNCA** fazer `return null` ou `return <X />` antes de todos os hooks — causa "Rendered fewer hooks than expected"
2. Declarar interfaces FORA da função componente (ao nível do módulo)
3. Usar `AppLayout` como wrapper em todas as páginas autenticadas
4. Usar `useUser()` para aceder ao utilizador autenticado
5. Paginação: usar `PAGE_SIZE` de `constants.ts` e padrão dos botões ‹ 1 2 3 … ›

---

## 📋 CHECKLIST PDF — Estado final

| Perfil | Req | Estado |
|---|---|---|
| Consultor | Todos 1-28 | ✅ |
| Consultor Bónus 12, 23 | Assinatura email, template | ✅ |
| Service Line Leader | Todos 1-19 | ✅ |
| Talent Manager | Todos 1-21 | ✅ |
| Administrador | Todos 1-12 | ✅ |
| Workflow TM/SLL | Correto | ✅ |
| Reporting mínimo | % mensal, LP, nível, utilizadores | ✅ |
| Login/Logout/Recuperar pass | Completo | ✅ |
| Saudação contextual | Dashboard | ✅ |
| 3 línguas | PT/EN/ES (sidebar) | ✅ parcial |
| Integração Teams/Slack | Backend + UI | ✅ |
| SLAs | Definir e gerir | ✅ |
| Mobile | Fase 5 (colega) | ⏳ |

---

## 🐛 Bugs conhecidos / Pontos de atenção

1. **Emails sem SMTP** — sem configuração SMTP, os emails são logados na consola. Funciona para demonstração mas não envia de verdade.
2. **Traduções parciais** — mudar a língua em Definições → página recarrega com sidebar traduzido, mas o conteúdo das páginas ainda está em português.
3. **Paginação na BD** — os endpoints `GET /applications` e `GET /users` devolvem todos os registos sem LIMIT. Para datasets grandes pode ser lento.
4. **x-user-id vs JWT** — o sistema usa header `x-user-id` (suficiente para académico). Numa versão de produção real, seria substituído por JWT Bearer tokens.


POS ESSAS ALTERÇÕES TENS DE 
Falta COLCOAR A CENA DAS LINGUAS os Achivements, os ver dealhes do badge e as tags tipo junior etc etc tipo no
  dashboard esya mas no badge catalog nao, o submetido aprvado em validacao tambem nao
  esta, e procura pelo projeto os que faltem mais e tambem esta a dar este erro
  corrije
  [Pasted text #1 +7 lines]
