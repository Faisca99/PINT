# PINT 2025 — Plataforma de Badges Softinsa (Mobile)

Aplicação mobile da plataforma de badges da Softinsa, desenvolvida em React + Vite, simulada num frame de iPhone 15 Pro.

## Tecnologias

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts

## Como correr

Instalar dependências:
```
npm install
```

Criar ficheiro `.env` na raiz com:
```
VITE_API_URL=http://localhost:3001/api/v1
VITE_WEB_URL=http://localhost:5173
```

Iniciar o servidor de desenvolvimento:
```
npm run dev
```

Abrir em: http://localhost:5173

## Contas de teste

| Email | Password | Perfil |
|---|---|---|
| abreu@softinsa.pt | Softinsa2025! | Consultor |
| faisca@softinsa.pt | Softinsa2025! | Talent Manager |
| beselga@softinsa.pt | Softinsa2025! | Service Line Leader |
| admin@softinsa.pt | Softinsa2025! | Administrador |

## Backend

O backend NestJS encontra-se em `fase-2/backend-api`. Necessita de uma base de dados PostgreSQL (Neon) configurada no ficheiro `.env` com a variável `DATABASE_URL`.
