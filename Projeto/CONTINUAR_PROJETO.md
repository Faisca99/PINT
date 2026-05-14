# Ponto de Situação - Projeto Pathway / Quest Pro

Este documento serve para passar o contexto do projeto a outro membro do grupo (ou ao assistente AI) para continuar o desenvolvimento a partir deste exato ponto.

## 📋 Checklist de Progresso

### Fase 1 — Arquitetura & Base de Dados ✅
- [x] ERD com 27 tabelas, schema SQL
- [x] Especificação de 100+ endpoints REST
- [x] Decisões arquiteturais (NestJS + Next.js + PostgreSQL Neon)

### Fase 2 — Backend (NestJS) ✅
- [x] Auth: `POST /auth/login`, `GET /auth/me`
- [x] Badges: listagem e detalhe com requisitos
- [x] Candidaturas: criar, adicionar evidências, submeter
- [x] Aprovação: `POST /applications/:id/approve`, `POST /applications/:id/reject`
- [x] Dashboard do consultor
- [x] Camada de negócio em SQL (views, functions, triggers)
- [x] Seed de dados de teste

### Fase 3 — Frontend (Next.js) ✅ COMPLETA
- [x] **Setup**: Next.js 15, Tailwind CSS v4, shadcn/ui, framer-motion
- [x] **Login**: Formulário real conectado ao backend (`/auth/login`), gestão de sessão por localStorage, redirect automático para `/login` se não autenticado
- [x] **Contexto de utilizador**: role, nome, email guardados; sidebar adapta-se ao role
- [x] **Fluxo do Consultor**:
  - `/badges` — catálogo de badges
  - `/badges/[id]` — detalhe com botão de candidatura
  - `/candidaturas` — lista real das candidaturas do utilizador (via `GET /applications/mine`)
  - `/candidaturas/[id]` — formulário de evidências + submissão final
- [x] **Fluxo de Validação (Talent Manager & Service Line Leader)**:
  - `/validacao` — Inbox com filtros por role e status, stats de pendentes/aprovadas/rejeitadas
  - `/validacao/[id]` — detalhe com todas as evidências + botões Aprovar / Rejeitar
- [x] **RBAC básico**: sidebar e botões de decisão adaptam-se ao role do utilizador autenticado

---

## 🚀 Estado atual do sistema

### Fluxo completo funcional:
1. Consultor faz login → é direcionado ao dashboard
2. Consultor vai ao catálogo → candidata-se a um badge → preenche evidências → submete
3. Talent Manager entra → vê candidatura na Caixa de Entrada → aprova (avança para SLL) ou rejeita
4. Service Line Leader → vê candidatura em validação → aprova (badge atribuído) ou rejeita

### Endpoints backend relevantes:
- `GET /api/v1/applications/mine` — candidaturas do utilizador autenticado (novo)
- `GET /api/v1/applications` — todas as candidaturas (para TM/SLL)
- `GET /api/v1/applications/:id` — detalhe com evidências (json_agg)
- `POST /api/v1/applications/:id/approve` — aprovar
- `POST /api/v1/applications/:id/reject` — rejeitar (comment obrigatório)

---

## 🔜 Fase 4 — O que continuar

O colega que continuar pode focar-se em:

### Prioridade alta:
- [ ] **Dashboard do consultor** (`/`) — atualmente estático, ligar ao `GET /me/dashboard`
- [ ] **Meus Badges** (`/my-badges`) — listar badges ganhos via `GET /me/badges`
- [ ] **Página pública de badge** — URL única verificável por token (requisito do projeto)
- [ ] **Relatórios** (`/relatorios`) — exportar candidaturas para Excel/PDF

### Prioridade média:
- [ ] **Dashboard Service Line Leader** (`/dashboard-sl`) — progresso dos consultores da área
- [ ] **Utilizadores** (`/utilizadores`) — listagem de consultores para TM/SLL
- [ ] **Conquistas** (`/achievements`) — milestones e badges especiais (Premium Badges)
- [ ] **Leaderboard** (`/leaderboard`) — ranking por pontos

### Notas técnicas:
- Auth usa `x-user-id` header (injetado automaticamente pelo interceptor em `lib/api.ts`)
- Backend corre em `localhost:3001`, frontend em `localhost:3000`
- Para correr: backend → `cd fase-2/backend-api && npm run start:dev`; frontend → `cd fase-3-frontend && npm run dev`
- Conta de teste: `joao.silva@softinsa.pt` / `Softinsa2025!`

---

## 🤖 Prompt para o AI (Fase 4)

```text
Olá! Estou a trabalhar num projeto full-stack de badges (Softinsa Badges Platform).

Stack: NestJS (backend em `fase-2/backend-api`, porta 3001) + Next.js 15 (frontend em `fase-3-frontend`, porta 3000) + PostgreSQL Neon.

A Fase 3 está completa: login real, fluxo completo do consultor (candidatura + evidências + submissão) e fluxo de validação (TM e SLL com aprovação/rejeição). O auth usa x-user-id header injetado automaticamente pelo interceptor em `lib/api.ts`.

O objetivo agora é a Fase 4. Começa por:
1. Ligar o dashboard do consultor (`/`) ao endpoint real `GET /api/v1/me/dashboard`
2. Implementar a página "Meus Badges" (`/my-badges`) com os badges ganhos via `GET /api/v1/me/badges`
3. Implementar a página de relatórios para TM/SLL

Analisa primeiro os endpoints disponíveis no backend e o estado atual das páginas antes de implementar. Avança passo-a-passo.
```
