# Fase 1 - Endpoints API Principais

## Estilo da API

- REST
- JSON
- Prefixo recomendado: `/api/v1`
- Autenticacao com JWT access token e refresh token

## 1. Auth

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Registo de consultor | Publico |
| POST | `/api/v1/auth/login` | Login | Publico |
| POST | `/api/v1/auth/refresh` | Renovar sessao | Autenticado |
| POST | `/api/v1/auth/logout` | Encerrar sessao | Autenticado |
| POST | `/api/v1/auth/verify-email` | Confirmar email | Publico |
| POST | `/api/v1/auth/forgot-password` | Pedir reset password | Publico |
| POST | `/api/v1/auth/reset-password` | Redefinir password | Publico |
| POST | `/api/v1/auth/change-password` | Alterar password obrigatoria | Autenticado |
| GET | `/api/v1/auth/me` | Perfil autenticado | Autenticado |

## 2. Users, Roles e Organizacao

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/users` | Listar utilizadores | Admin |
| POST | `/api/v1/users` | Criar utilizador interno | Admin |
| GET | `/api/v1/users/:id` | Detalhe de utilizador | Admin |
| PATCH | `/api/v1/users/:id` | Atualizar utilizador | Admin |
| PATCH | `/api/v1/users/:id/status` | Ativar, suspender, desativar | Admin |
| GET | `/api/v1/roles` | Listar roles | Admin |
| POST | `/api/v1/users/:id/roles` | Atribuir role | Admin |
| DELETE | `/api/v1/users/:id/roles/:roleId` | Remover role | Admin |
| POST | `/api/v1/users/:id/service-lines` | Associar service line leader a uma service line | Admin |
| DELETE | `/api/v1/users/:id/service-lines/:serviceLineId` | Remover associacao | Admin |

## 3. Learning Paths, Service Lines, Areas, Niveis

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/learning-paths` | Listar learning paths | Todos autenticados |
| POST | `/api/v1/learning-paths` | Criar learning path | Admin |
| PATCH | `/api/v1/learning-paths/:id` | Editar learning path | Admin |
| GET | `/api/v1/service-lines` | Listar service lines | Todos autenticados |
| POST | `/api/v1/service-lines` | Criar service line | Admin |
| PATCH | `/api/v1/service-lines/:id` | Editar service line | Admin |
| GET | `/api/v1/areas` | Listar areas | Todos autenticados |
| POST | `/api/v1/areas` | Criar area | Admin |
| PATCH | `/api/v1/areas/:id` | Editar area | Admin |
| GET | `/api/v1/levels` | Listar niveis | Todos autenticados |
| POST | `/api/v1/levels` | Criar nivel | Admin |
| PATCH | `/api/v1/levels/:id` | Editar nivel | Admin |

## 4. Badges e Requisitos

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/badges` | Catalogo de badges | Todos autenticados |
| GET | `/api/v1/badges/:id` | Detalhe do badge | Todos autenticados |
| POST | `/api/v1/badges` | Criar badge | Admin |
| PATCH | `/api/v1/badges/:id` | Editar badge | Admin |
| GET | `/api/v1/badges/:id/requirements` | Listar requisitos do badge | Todos autenticados |
| POST | `/api/v1/badges/:id/requirements` | Criar requisito | Admin |
| PATCH | `/api/v1/requirements/:id` | Editar requisito | Admin |
| DELETE | `/api/v1/requirements/:id` | Desativar requisito | Admin |

## 5. Candidaturas e Evidencias

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/applications` | Listar candidaturas com filtros | Admin, Talent Manager, Service Line Leader |
| POST | `/api/v1/applications` | Criar candidatura para badge | Consultor |
| GET | `/api/v1/applications/:id` | Ver detalhe da candidatura | Dono, Admin, Talent Manager, Service Line Leader autorizado |
| PATCH | `/api/v1/applications/:id` | Editar candidatura ainda aberta | Consultor dono |
| POST | `/api/v1/applications/:id/submit` | Submeter candidatura | Consultor dono |
| POST | `/api/v1/applications/:id/evidences` | Upload de evidencia | Consultor dono |
| DELETE | `/api/v1/applications/:id/evidences/:evidenceId` | Remover evidencia enquanto aberta | Consultor dono |
| GET | `/api/v1/applications/:id/history` | Historico da candidatura | Dono, Admin, Talent Manager, Service Line Leader autorizado |

## 6. Workflow de Revisao

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| POST | `/api/v1/applications/:id/reviews/talent-manager` | Decisao do Talent Manager | Talent Manager |
| POST | `/api/v1/applications/:id/reviews/service-line` | Decisao final do Service Line Leader | Service Line Leader autorizado |
| POST | `/api/v1/applications/:id/send-back` | Devolver para correcao | Talent Manager, Service Line Leader autorizado |
| POST | `/api/v1/applications/:id/reject` | Rejeitar candidatura | Talent Manager, Service Line Leader autorizado |
| POST | `/api/v1/applications/:id/approve` | Aprovar e atribuir badge | Service Line Leader autorizado |

## 7. Badges do utilizador e pagina publica

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/me/badges` | Badges do utilizador autenticado | Consultor |
| GET | `/api/v1/me/badges/history` | Historico de badges e processos | Consultor |
| PATCH | `/api/v1/me/badges/:id/publish` | Publicar ou ocultar badge | Consultor |
| GET | `/api/v1/users/:id/public-badges` | Galeria publica de badges | Publico |
| GET | `/api/v1/public/badges/:token` | Pagina publica de verificacao | Publico |
| GET | `/api/v1/badges/:id/certificate` | Download de certificado PDF | Dono, Talent Manager, Service Line Leader, Admin |

## 8. Dashboard, pontos e recomendacoes

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/me/dashboard` | Dashboard do consultor | Consultor |
| GET | `/api/v1/me/recommendations` | Proximos badges recomendados | Consultor |
| GET | `/api/v1/me/points` | Extrato de pontos | Consultor |
| GET | `/api/v1/rankings/service-line/:id` | Ranking por service line | Service Line Leader, Admin |
| GET | `/api/v1/dashboard/talent-manager` | Dashboard operacional | Talent Manager |
| GET | `/api/v1/dashboard/service-line` | Dashboard da service line do leader | Service Line Leader |
| GET | `/api/v1/dashboard/admin` | Dashboard global | Admin |

## 9. Notificacoes, avisos e lembretes

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/notifications` | Listar notificacoes | Autenticado |
| PATCH | `/api/v1/notifications/:id/read` | Marcar como lida | Autenticado |
| GET | `/api/v1/reminders` | Listar lembretes | Consultor |
| POST | `/api/v1/reminders` | Criar lembrete | Consultor, Admin |
| GET | `/api/v1/notices` | Avisos ativos | Autenticado |
| POST | `/api/v1/notices` | Criar aviso | Admin, Talent Manager, Service Line Leader |
| PATCH | `/api/v1/notices/:id` | Editar aviso | Autor, Admin |

## 10. Reporting e exportacao

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/reports/badges` | Relatorio de badges por filtros | Admin, Talent Manager, Service Line Leader |
| GET | `/api/v1/reports/applications` | Relatorio de candidaturas | Admin, Talent Manager, Service Line Leader |
| GET | `/api/v1/reports/users` | Relatorio de consultores | Admin, Talent Manager, Service Line Leader |
| GET | `/api/v1/reports/export?type=excel` | Exportar para Excel | Admin, Talent Manager, Service Line Leader |
| GET | `/api/v1/reports/export?type=pdf` | Exportar para PDF | Admin, Talent Manager, Service Line Leader |

## 11. Admin tecnico

| Metodo | Endpoint | Descricao | Perfis |
|---|---|---|---|
| GET | `/api/v1/admin/sla-policies` | Listar politicas SLA | Admin |
| POST | `/api/v1/admin/sla-policies` | Criar politica SLA | Admin |
| PATCH | `/api/v1/admin/sla-policies/:id` | Editar politica SLA | Admin |
| GET | `/api/v1/admin/translations` | Listar traducoes | Admin |
| POST | `/api/v1/admin/translations` | Criar traducao | Admin |

## Endpoints criticos para o workflow

Se quiseres implementar apenas o minimo funcional na Fase 3, estes sao os endpoints obrigatorios:

1. `POST /api/v1/auth/login`
2. `GET /api/v1/badges`
3. `GET /api/v1/badges/:id`
4. `POST /api/v1/applications`
5. `POST /api/v1/applications/:id/evidences`
6. `POST /api/v1/applications/:id/submit`
7. `GET /api/v1/applications`
8. `GET /api/v1/applications/:id`
9. `POST /api/v1/applications/:id/reviews/talent-manager`
10. `POST /api/v1/applications/:id/reviews/service-line`
11. `GET /api/v1/me/dashboard`
12. `GET /api/v1/me/badges`
13. `GET /api/v1/public/badges/:token`