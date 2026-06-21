# Fase 1 - Arquitetura Proposta

## Objetivo

Construir a Plataforma de Badges da Softinsa com uma arquitetura simples de operar, mas preparada para crescer para Web, Mobile, workflow de aprovacao, auditoria, gamification e pagina publica de verificacao de badges.

## Arquitetura recomendada

### Estilo arquitetural

- Modular monolith no arranque.
- API unica com modulos bem separados por dominio.
- Web e Mobile como clientes independentes da mesma API.
- PostgreSQL no Neon como fonte de verdade.

Esta escolha reduz complexidade operacional na Fase 1 e Fase 2, evita overhead prematuro de microservices e continua preparada para extrair modulos mais tarde se houver necessidade.

## Stack sugerida

### Web

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui ou biblioteca equivalente para acelerar base UI

### Mobile

- React Native com Expo
- TypeScript
- Expo Router

### Backend

- NestJS
- TypeScript
- Prisma ORM ou Drizzle ORM
- REST API

NestJS encaixa bem porque o projeto tem RBAC, workflow, notificacoes, relatorios e varios modulos de dominio. E mais estruturado do que Express para um projeto deste tamanho.

### Base de dados

- PostgreSQL no Neon

### Infra complementar

- Storage de ficheiros: S3-compatible storage para evidencias e imagens de badges
- Email: Resend, SendGrid ou Microsoft Graph
- Jobs assincromos: Redis + BullMQ apenas quando entrarem emails, alertas SLA, expiracoes e lembtes automáticos
- PDF: react-pdf, pdf-lib ou Puppeteer para certificados

## Estrutura logica do sistema

### Clientes

- Web App
  - Admin
  - Consultor
  - Talent Manager
  - Service Line Leader
- Mobile App
  - Consultor

### Backend API

- Auth Module
- Users and Roles Module
- Learning Structure Module
- Badges Module
- Applications Module
- Review Workflow Module
- Awarding and Verification Module
- Notifications Module
- Reporting Module
- Files Module
- Internationalization Module

### Dados e integracoes

- PostgreSQL para dados transacionais
- Object storage para evidencias e assets
- Email provider para confirmacao, reset password e eventos de aprovacao
- Push notifications para mobile nas fases seguintes

## Modulos de dominio

### 1. Auth

- Registo, login, refresh token e logout
- Confirmacao de email
- Alteracao obrigatoria de password no primeiro acesso
- Recuperacao de password

### 2. Users and Roles

- Gestao de utilizadores
- Associacao de perfis
- Restricoes por area e service line
- Preferencias de idioma

### 3. Learning Structure

- Learning Paths
- Service Lines
- Areas
- Niveis
- Requisitos

### 4. Badges

- Badge por nivel
- Badges especiais ou premium
- Pontos por badge
- Regras de expiracao
- Regras de prazo de obtencao

### 5. Applications and Workflow

- Criacao de candidatura
- Upload de evidencias por requisito
- Validacao pelo Talent Manager
- Validacao final pelo Service Line Leader
- Historico auditavel de estados

### 6. Awarding and Verification

- Emissao de badge ao utilizador
- Token publico unico para verificacao
- Pagina publica do badge
- Controlo de publicacao e RGPD

### 7. Gamification

- Pontos por badge obtido
- Ledger de pontos para auditoria
- Ranking por utilizador, area e service line
- Achievements especiais

### 8. Notifications

- Email
- In-app notifications
- Lembretes
- Alertas SLA
- Alertas de expiracao

### 9. Reporting

- Dashboards por perfil
- KPIs por periodo
- Exportacoes para Excel e PDF

## Fluxo principal de aprovacao

1. O consultor cria ou completa uma candidatura para um badge.
2. Faz upload das evidencias associadas aos requisitos do nivel.
3. Submete a candidatura e passa para Submitted.
4. O Talent Manager valida evidencias.
5. Se estiver correto, a candidatura segue para validacao final.
6. O Service Line Leader aprova, rejeita ou devolve para correcao.
7. Quando aprovado, e criado um registo de badge atribuido ao utilizador.
8. O sistema gera token publico, pontos e notificacoes.

## Regras de autorizacao

- Admin: acesso total.
- Consultor: apenas os seus dados, candidaturas, badges e preferencias.
- Talent Manager: acesso transversal a candidaturas e evidencias para validacao.
- Service Line Leader: acesso apenas aos consultores e badges da sua service line.

## Decisoes tecnicas importantes

### 1. REST em vez de GraphQL

REST e suficiente para este dominio, mais simples de proteger e mais facil para Web e Mobile no arranque.

### 2. Workflow modelado na base de dados

O estado atual da candidatura fica em `badge_applications.status`, mas todas as transicoes ficam auditadas em `application_history` e as decisoes humanas em `application_reviews`.

### 3. Pontos com ledger

Em vez de guardar apenas um total, cada atribuicao entra em `point_transactions`. Isto evita inconsistencias e ajuda relatorios e auditoria.

### 4. Publicacao e RGPD separados da atribuicao

O badge pode estar atribuido ao utilizador sem estar publicado publicamente. Isto responde diretamente ao requisito de consentimento RGPD.

### 5. Design base `pathway-quest-pro-main`

Na Fase 2, o frontend deve replicar o design system, layout, componentes e ritmo visual do ficheiro `pathway-quest-pro-main.zip`. Nesta fase, isso fica apenas definido como restricao arquitetural do frontend.

## Estrutura recomendada de pastas

```text
Projeto/
  fase-1/
    01-arquitetura.md
    02-erd.md
    03-api-endpoints.md
    04-schema-postgres.sql
  backend/
  web/
  mobile/
```

## Deploy recomendado

- Web: Vercel
- API: Railway, Render ou Fly.io
- DB: Neon PostgreSQL
- Storage: Cloudflare R2, Supabase Storage ou S3

## Resultado esperado da Fase 1

No fim desta fase ficam definidos:

- arquitetura alvo
- modelo de dados principal
- SQL PostgreSQL inicial
- API surface principal para suportar workflow e dashboards