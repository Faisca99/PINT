# PINT Backend API (Fase 2)

API NestJS com endpoints core ligados a PostgreSQL (Neon), em continuacao da Fase 1 e Fase 2 SQL.

## Endpoints implementados

- POST /api/v1/auth/login
- GET /api/v1/auth/me
- GET /api/v1/badges
- GET /api/v1/badges/:id
- GET /api/v1/applications
- POST /api/v1/applications
- POST /api/v1/applications/:id/evidences
- POST /api/v1/applications/:id/submit
- POST /api/v1/applications/:id/approve
- POST /api/v1/applications/:id/reject
- GET /api/v1/me/dashboard

## Requisitos

- Node.js 20+
- Base com scripts SQL ja executados:
  - Projeto/fase-1/04-BD_FINAL.sql
  - Projeto/fase-2/02-db-camada-negocio.sql

## Arranque local

1. Copiar .env.example para .env e preencher DATABASE_URL.
2. Instalar dependencias:

```bash
npm install
```

3. Correr em desenvolvimento:

```bash
npm run start:dev
```

## Nota de autenticacao nesta fase

Para acelerar entrega da Fase 2, os endpoints protegidos leem o utilizador pelo header `x-user-id`.
Na Fase 3 deve ser substituido por JWT guard + RBAC.
