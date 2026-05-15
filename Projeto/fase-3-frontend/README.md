# PINT 2025 — Frontend Web (Next.js)
> Plataforma de Badges da Softinsa | Fase 3 & 4 completas

## Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **Animações:** Framer Motion
- **PDF:** jsPDF
- **Excel:** xlsx
- **i18n:** Sistema próprio PT/EN/ES

## Arranque

```bash
cd fase-3-frontend
npm install
npm run dev
# → http://localhost:3000
```

> O backend tem de estar a correr em `localhost:3001` para o frontend funcionar.

## Contas de teste

| Email | Password | Role |
|---|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` | Consultor |
| `faisca@softinsa.pt` | `Softinsa2025!` | Talent Manager |
| `beselga@softinsa.pt` | `Softinsa2025!` | Service Line Leader |
| `admin@softinsa.pt` | `Softinsa2025!` | Administrador |

## Páginas por Role

### Consultor
| Rota | Descrição |
|---|---|
| `/` | Dashboard com pontos, progresso, recomendações |
| `/badges` | Catálogo de badges com pesquisa e filtros |
| `/badges/[id]` | Detalhe do badge com requisitos |
| `/candidaturas` | Minhas candidaturas com estados e paginação |
| `/candidaturas/[id]` | Submeter evidências + submissão final |
| `/my-badges` | Badges ganhos + publicar + download PDF + LinkedIn |
| `/achievements` | Conquistas desbloqueadas e bloqueadas |
| `/leaderboard` | Ranking por pontos |
| `/timeline` | Timeline de evolução profissional |
| `/lembretes` | Criar e gerir lembretes |
| `/assinatura` | Gerar HTML para assinatura de email |
| `/galeria/[userId]` | Galeria pública de badges (sem auth) |
| `/verify/[token]` | Verificar badge por link único (sem auth) |

### Talent Manager
| Rota | Descrição |
|---|---|
| `/dashboard-tm` | Dashboard com candidaturas pendentes e top consultores |
| `/validacao` | Inbox com pesquisa e paginação |
| `/validacao/[id]` | Rever evidências + Validar/Devolver |

### Service Line Leader
| Rota | Descrição |
|---|---|
| `/dashboard-sl` | Dashboard da SL + comparação + candidaturas pendentes |
| `/validacao` | Inbox filtrado pela sua SL |
| `/validacao/[id]` | Rever evidências + Aprovar/Rejeitar/Devolver |
| `/leaderboard` | Ranking filtrado pela sua SL |

### Administrador
| Rota | Descrição |
|---|---|
| `/admin` | Dashboard global com KPIs e candidaturas recentes |
| `/admin/utilizadores` | Gestão de utilizadores (criar, editar role, suspender) |
| `/admin/badges` | Gestão de badges com filtro e paginação |
| `/admin/estrutura` | Árvore LP/SL/Áreas/Níveis/Requisitos (criar e inativar) |
| `/admin/avisos` | Criar/gerir avisos para utilizadores |
| `/admin/notificacoes` | Configurar tipos de notificação |
| `/admin/rgpd` | Gestão de políticas RGPD |
| `/admin/integracoes` | Webhooks Teams/Slack |
| `/admin/sla` | Definir e gerir políticas SLA |

### Páginas comuns (todos os roles)
| Rota | Descrição |
|---|---|
| `/avisos` | Ver avisos ativos da plataforma |
| `/relatorios` | Relatórios com KPIs, filtros e export Excel |
| `/utilizadores` | Lista de consultores com export Excel |
| `/settings` | Definições (idioma PT/EN/ES) |

## Estrutura de ficheiros importantes

```
src/
├── app/                    ← páginas (App Router Next.js)
├── components/
│   ├── AppLayout.tsx       ← wrapper com sidebar, header, logout, selector de língua
│   ├── AppSidebar.tsx      ← navegação adaptada por role + traduções
│   ├── NotificationBell.tsx ← sino de notificações (polling 30s)
│   └── SoftinsaLogo.tsx    ← logo SVG hexágono
└── lib/
    ├── api.ts              ← axios com interceptor automático de x-user-id
    ├── user-context.tsx    ← estado global de autenticação (useUser())
    ├── constants.ts        ← PAGE_SIZE=10, cores de nível, labels de estado
    ├── i18n.ts             ← traduções PT/EN/ES
    ├── greeting.ts         ← saudação contextual (Bom dia/tarde/noite)
    └── certificate.ts      ← gerador de certificados PDF (jspdf)
```

## Regras importantes ao adicionar páginas

1. **NUNCA** fazer `return null` antes de todos os hooks — causa "Rendered fewer hooks than expected"
2. Declarar `interface` e `type` FORA do corpo da função componente
3. Usar `<AppLayout>` como wrapper em todas as páginas autenticadas
4. Usar `useUser()` para aceder ao utilizador e role
5. Paginação: usar `PAGE_SIZE` de `src/lib/constants.ts`
6. `api.ts` injeta `x-user-id` automaticamente — não adicionar manualmente nos pedidos
