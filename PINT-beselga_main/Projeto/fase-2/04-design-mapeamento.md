# Fase 2 - Mapeamento Design x Requisitos x BD

Base visual: Informacoes/Design/pathway-quest-pro-main.zip

## Principio

Cada ecran do frontend deve ligar diretamente a endpoints que, por sua vez, leem/escrevem tabelas ou views da BD.
Nada de dados mock em ambiente de desenvolvimento principal.

## 1. Auth screens

- Ecras: Login, Confirm Email, Change Password, Forgot Password
- Endpoints: /auth/login, /auth/verify-email, /auth/change-password, /auth/forgot-password
- BD: users, user_sessions, email_verification_tokens, password_reset_tokens

## 2. Consultant Dashboard

- Ecras: Home dashboard, resumo de progresso, pontos, proximos objetivos
- Endpoint principal: /me/dashboard
- BD: v_consultant_badge_progress + consultant_objectives + notifications

## 3. Catalogo de badges

- Ecras: Lista de badges, detalhe de badge, requisitos por nivel
- Endpoints: /badges, /badges/:id
- BD: badges, levels, areas, service_lines, learning_paths, requirements

## 4. Candidatura e upload de evidencias

- Ecras: Nova candidatura, upload de ficheiros, estado da candidatura
- Endpoints: /applications, /applications/:id/evidences, /applications/:id/submit
- BD: badge_applications, application_evidences, application_history

## 5. Workflow de validacao

- Ecras: Inbox TM, Inbox Service Line Leader, detalhe e decisao
- Endpoints: /applications (com filtros), /applications/:id/approve, /applications/:id/reject
- BD: application_reviews, application_history, badge_applications, notifications

## 6. Badges do consultor e pagina publica

- Ecras: Meus badges, toggle publicar, pagina publica de validacao
- Endpoints: /me/badges, /me/badges/:id/publish, /public/badges/:token
- BD: user_badges, badge_shares, v_public_badges

## 7. Notificacoes e lembretes

- Ecras: Centro de notificacoes, lembretes pendentes
- Endpoints: /notifications, /reminders
- BD: notifications, reminders

## 8. Admin configuracao

- Ecras: Politicas SLA, traducoes, templates de email, avisos
- Endpoints: /admin/sla-policies, /admin/translations, /notices
- BD: sla_policies, translations, email_templates, info_notices

## Criterio de aceitacao UI da fase

- Cada ecran principal tem endpoint real integrado
- Sem JSON local hardcoded para dados de negocio
- Estados visuais alinhados a status reais da BD (open, submitted, in_validation, closed)
- Componentes do design reutilizados com dados dinamicos
