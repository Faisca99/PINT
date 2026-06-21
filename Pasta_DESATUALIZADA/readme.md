# PINT 2025 — Plataforma de Badges da Softinsa (V3.2 - Mobile)

---

## Contexto e Objetivo

A Softinsa, empresa de consultoria tecnológica, quer desenvolver uma **plataforma de badges digitais** similar ao Credly.com para certificar e evidenciar competências dos seus colaboradores.

### Problemas que visa resolver:
- Dificuldade em evidenciar e validar competências adquiridas
- Falta de um sistema de gamification que motive a aprendizagem contínua
- Ausência de uma forma padronizada de apresentar credenciais profissionais
- Necessidade de aumentar a visibilidade da empresa e competências dos colaboradores

### O projeto inclui:
- Plataforma **Web** (4 perfis: Administrador, Consultor, Talent Manager, Service Line Leader)
- Aplicação **Mobile** (para o consultor)

---

## Estrutura de Learning Paths

- **Learning Path em desenvolvimento:** Jornada Técnica (existe também "Power Skills", mas não é desenvolvido — a BD deve suportá-lo no futuro)
- Cada Learning Path tem várias **Service Lines**, que têm várias **áreas**, que têm **5 níveis**:

| Nível | Nome |
|---|---|
| A (A1, A2, A3...) | Júnior |
| B (B1, B2, B3...) | Intermédio |
| C (C1, C2, C3...) | Sénior |
| D (D1, D2, D3...) | Especialista |
| E (E1, E2, E3...) | Líder de Conhecimento |

Ao cumprir **todos os requisitos de um nível**, o consultor obtém **1 Badge** desse nível.

### Exemplos de Service Lines/Áreas:
- Hybrid Cloud → LowCode (Outsystems)
- Application Operations → DevSecOps & IT Automation – DevOps
- Sourcing & Talent Management → Talent Management

### Regras importantes:
- Um consultor pode candidatar-se a **qualquer nível** sem ter os badges dos níveis anteriores, desde que tenha os requisitos
- Um badge pode ter (opcionalmente) um **intervalo temporal** para ser obtido
- O Administrador define os requisitos de cada nível (título, descrição, imagem, evidências necessárias)

---

## Workflow de Aprovação

1. **Consultor** submete candidatura com evidências → Estado: **Submitted**
2. **Talent Manager** (vê todas as submissões, independentemente de área/service line):
   - ✅ Correto → envia ao Service Line Leader → Estado: **Em Validação**
   - ❌ Incorreto → devolve ao consultor → Estado: **Open**
3. **Service Line Leader** (da área em questão):
   - ✅ Aprovar → Badge disponível para publicação → Estado: **Fechado**
   - ❌ Rejeitar → envia email ao consultor → Estado: **Fechado**
   - 🔄 Send Back → devolve ao consultor com comentário → Estado: **Open**

---

## Perfil: Consultor (Web e Mobile)

| Nº | Requisito |
|---|---|
| 1 | Email de confirmação de registo; na 1ª entrada tem de alterar a password |
| 2 | Ao registar, escolhe a sua área → badges preferenciais dessa área são mostrados |
| 3 | Pode consultar badges de outras áreas |
| 4 | Dashboard pessoal com progresso nos Learning Paths |
| 5 | Sistema de upload de evidências (certificados, diplomas, relatórios) |
| 6 | Visualização do status dos pedidos de Badges em tempo real |
| 7 | Consultar histórico de badges obtidos e em processo |
| 8 | Catálogo de badges disponíveis com descrições |
| 9 | Consultar os requisitos para cada badge |
| 10 | Aceitação de termos RGPD para publicação e partilha de badges |
| 11 | Partilhar badge no LinkedIn |
| 13 | Sistema de pontos por badges obtidos |
| 14 | Badges de conquistas especiais (ex: certificações pagas) |
| 15 | Métricas de progresso visual |
| 16 | Celebração de marcos alcançados (ex: 3 certificações na timeline, atingir X badges num período) |
| 17 | Recomendações de próximos badges (com base nos níveis já feitos) |
| 18 | Download de certificados personalizados em PDF |
| 19 | Email de confirmação de candidatura nos badges |
| 20 | Notificações de aprovação/rejeição |
| 21 | Alertas de expiração de badges (o admin pode definir opcionalmente data de expiração) |
| 22 | Lembretes (ex: "tem até final do ano para cumprir certos requisitos") |
| 24 | Galeria pública de badges obtidos |
| 25 | Cada badge tem uma página individual da Softinsa acessível via URL |
| 26 | Sistema de verificação por link único para cada badge (página pública) |
| 27 | Informações detalhadas sobre competências certificadas por badge |
| 28 | Integração com www.softinsa.pt para visualizar competências da Softinsa |

### Bónus Consultor:
- (12) Colocar badge na assinatura de email
- (23) Configuração de template de email com badges obtidos
- (Mobile a) Timeline de evolução profissional
- (Mobile b) Notificações PUSH de SLA ultrapassados

---

## Perfil: Service Line Leader

| Nº | Requisito |
|---|---|
| 1 | Consultar badges da plataforma, mesmo fora da sua área |
| 2 | Dashboard pessoal com progresso de todos os consultores da sua Service Line |
| 3 | Visualização do status dos pedidos da sua service line/área em tempo real |
| 4 | Histórico de badges da sua service line/área (obtidos e em processo) |
| 5 | Catálogo de badges com descrições |
| 6 | Consultar requisitos para cada badge |
| 8 | Ver sistema de pontos por badges da sua área (admin define pontos; badge pode ter 0 pontos) |
| 9 | Ver sistema de Badges de conquistas especiais (Badges Premium — apela à criatividade) |
| 10 | Gerar relatórios de badges atribuídos na sua área/período |
| 11 | Exportação de pedidos para Excel/PDF |
| 12 | Exportação de badges para Excel/PDF |
| 13 | Exportação de consultores para Excel/PDF |
| 14 | Exportação de aprovações para Excel/PDF |
| 15 | Download de certificados em PDF personalizados |
| 16 | Receber emails de pedidos de candidatura/validações |
| 17 | Notificações de aprovação/rejeição |
| 18 | Visualizar/comparar ranking de badges dos consultores da sua Service Line |
| 19 | Histórico associado a cada processo de candidatura de badge |

### Bónus Service Line:
- (1) Métricas de comparação entre consultores com a mesma experiência e área
- (7) Colocar badge na assinatura de email

---

## Perfil: Talent Manager

| Nº | Requisito |
|---|---|
| 1 | Consultar badges disponíveis na plataforma |
| 2 | Dashboard com progresso de todos os consultores da sua Service Line/área |
| 3 | Sistema de verificação de evidências para cada badge |
| 4 | Visualização do status dos pedidos de badges em tempo real |
| 5 | Histórico de badges obtidos e em processo |
| 6 | Catálogo de badges com descrições |
| 7 | Consultar requisitos para cada badge |
| 8 | Gerar relatórios de badges atribuídos por área/período |
| 9 | Exportação de pedidos para Excel/PDF |
| 10 | Exportação de badges para Excel/PDF |
| 11 | Exportação de consultores para Excel/PDF |
| 12 | Exportação de aprovações para Excel/PDF |
| 13 | Exportação de rejeições para Excel/PDF |
| 14 | Colocar badge na assinatura de email |
| 15 | Ver sistema de pontos por badges |
| 16 | Ver sistema de Badges de conquistas especiais |
| 17 | Download de certificados em PDF personalizados |
| 18 | Receber emails de pedidos de candidatura/validações |
| 19 | Notificações de aprovação/rejeição (enviadas ao consultor quando aprova/rejeita) |
| 20 | Visualizar badges próximos da data de expiração |
| 21 | Histórico associado a cada processo de candidatura de badge |

### Bónus Talent Manager:
- (1) Criar Timeline de evolução profissional para cada consultor

---

## Perfil: Administrador/Gestor

| Nº | Requisito |
|---|---|
| 1 | Gestão de utilizadores e permissões |
| 2 | Criar utilizadores e definir perfil (Service Line, Talent Manager) |
| 3 | Acrescentar e eliminar badges |
| 4 | Acrescentar e eliminar Learning Paths / Service Lines / Áreas / Níveis / Requisitos |
| 5 | Exportação de dados para Excel/PDF |
| 6 | Gestão de badges (expiração, pontos, ...) |
| 7 | Configuração de notificações |
| 8 | Configuração de políticas RGPD |
| 9 | Consultar e gerir todos os pedidos de badges |
| 12 | Informações Genéricas e Avisos Ativos/Inativos |

### Bónus Administrador:
- (1) Notificar por email equipa de Talent ou Service Line caso o SLA seja ultrapassado
- (10) Definir e gerir SLAs da equipa de Talent e Service Line
- (11) Notificação PUSH de SLA ultrapassados

---

## Sistema de Gamification / Pontos

- O Administrador define o número de pontos de cada badge (um badge pode ter 0 pontos)
- Se um badge expirar, a pontuação obtida **mantém-se**
- O ranking pode ser por pontos — serve para identificar os melhores consultores
- O Service Line Leader pode usar o ranking para justificar aumentos salariais ou compensações (ex: por cada 100 pontos → +X€ de ordenado)
- Os grupos têm liberdade criativa para o sistema de gamification e estatísticas do dashboard

---

## Requisitos Gerais

### Dashboard
- Responsivo para mobile e desktop

### Workflow
- Todas as decisões de aprovação são registadas e auditáveis (histórico de feedbacks)

### Login
- Campos: Email + Password
- Opção de guardar dados de login
- Validações visuais a vermelho para campos inválidos

### Recuperar Password
- Preenchimento de email → Nova Password + Confirmar Password
- Mensagem final: *"A sua password foi redefinida com sucesso"*
- Opção de cancelar o processo

### Terminar Sessão
- Mensagem: *"Pretende terminar a sua sessão?"*
- Após logout, tem de fazer login novamente para aceder ao conteúdo

### Perfis disponíveis no Web
- Consultor, Administrador, Talent Manager, Service Line Leader

### Reporting (mínimo exigível)
- % de Badges com visão mensal
- Nº de Badges por range de datas
- Nº de Badges por Learning Path
- Nº de Badges por nível das Learning Paths
- Nº de utilizadores registados

### Segurança
- Toda a comunicação via **HTTPS**

---

## Bónus Gerais

- Plataforma em **3 idiomas**: Português, Inglês, Espanhol
- **Saudações contextuais:**
  - *"Bem-vindo!"* → após registo ou 1º login
  - *"Seja bem-vindo novamente"* → após 15 dias sem login
  - *"Bom dia / Boa tarde / Boa noite"* → restantes situações (no idioma escolhido)
- **Página de Informações/Avisos** (notificações PUSH): Admins/Service Lines/Talent Managers criam avisos visíveis a todos (ex: novo Learning Path disponível)
- **Integração com Teams ou Slack**

---
---

# 📊 Estado Atual de Implementação

> Última atualização: Junho 2026 · Data de entrega: **27 de junho de 2026**
> Pasta de trabalho atual: `PINT-beselga_main/Projeto`

## Resumo
A **plataforma Web está completa** para os 4 perfis (Consultor, Talent Manager, Service Line Leader, Administrador), incluindo a maioria dos bónus. A **app Mobile** (apenas Consultor) fica para a **Fase 5** (colega).

| Componente | Estado |
|---|---|
| Backend API (Fase 2) | ✅ Completo |
| Frontend Web (Fase 3/4) | ✅ Completo |
| App Mobile (Fase 5) | ⏳ Por iniciar (colega) |

## Stack Tecnológica
- **Backend:** NestJS + TypeScript · PostgreSQL (Neon cloud) · autenticação por header `x-user-id`
- **Frontend:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · jsPDF + jspdf-autotable · xlsx
- **i18n:** sistema próprio PT/EN/ES (`lib/i18n.ts`)
- **Email:** `EmailService` (sem SMTP → loga na consola) · **Webhooks** Teams/Slack (`WebhookService`)
- **Testes:** Jest (25 testes — constants, greeting, i18n)

## Como arrancar
```bash
# Backend  → http://localhost:3001/api/v1
cd Projeto/fase-2/backend-api
npm install && npm run start:dev

# Frontend → http://localhost:3000
cd Projeto/fase-3-frontend
npm install && npm run dev

# Testes
cd Projeto/fase-3-frontend && npm test
```

## Contas de teste
| Email | Password | Perfil |
|---|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` | Consultor |
| `faisca@softinsa.pt` | `Softinsa2025!` | Talent Manager |
| `beselga@softinsa.pt` | `Softinsa2025!` | Service Line Leader |
| `admin@softinsa.pt` | `Softinsa2025!` | Administrador |

## Estado por área de requisitos
| Área | Estado |
|---|---|
| Estrutura (LP/SL/Áreas/Níveis/Requisitos) + Workflow | ✅ |
| **Consultor** (1–28 + bónus 12, 23) | ✅ (ver exceção 1 abaixo) |
| **Service Line Leader** (1–19 + bónus 1, 7) | ✅ |
| **Talent Manager** (1–21 + bónus 1) | ✅ |
| **Administrador** (1–12 + bónus 10) | ✅ |
| Requisitos Gerais (login, recuperar pass, logout, 4 perfis, HTTPS-ready) | ✅ |
| Reporting mínimo (% mensal, range datas, LP, níveis, #users) | ✅ |
| Bónus Gerais (3 idiomas + bandeiras, saudações traduzidas, avisos por SL/TM, Teams/Slack) | ✅ |

## Funcionalidades-chave implementadas
- Workflow completo Open → Submitted → Em Validação → Fechado (TM valida/devolve · SLL aprova/rejeita/devolve) com histórico auditável
- Catálogo de badges com tags de **nível** e de **estado** da candidatura (submetido/em validação/aprovado)
- Upload de evidências · candidaturas · publicação com RGPD · partilha LinkedIn · galeria pública · verificação por link único
- Gamificação: pontos, ranking, conquistas especiais, **celebração de marcos**, recomendações, timeline
- **Alertas de expiração** de badges (consultor) + vista de badges a expirar (Talent Manager)
- Certificados PDF · **exportação Excel e PDF** (relatórios, pedidos, aprovações/rejeições, consultores)
- Admin: gestão de utilizadores, badges, estrutura, avisos, notificações, RGPD, SLA, integrações
- 3 idiomas (PT/EN/ES) com **bandeiras SVG** · **saudações contextuais traduzidas**
- Formulários de login/registo/recuperar password com **validação visual a vermelho**
- Avisos criáveis por **Admin / Service Line / Talent Manager**

## Em falta / Standby
| Item | Estado | Nota |
|---|---|---|
| **Envio real de email (SMTP)** | ⏸️ Standby | Os 5 gatilhos (confirmação candidatura, aviso validador, aprovação, rejeição, devolução) estão programados; logam na consola. Basta configurar `SMTP_*` no `.env`. |
| **Email de confirmação de registo** | ⚠️ Parcial | Existe a coluna `email_verified`; o envio não está ligado (depende do SMTP). O "alterar password no 1º login" está ✅. |
| **Email automático de SLA ultrapassado** (Admin bónus 1) | ❌ | SLA cria-se/gere-se, mas falta a deteção de breach + envio. |
| **App Mobile + Notificações PUSH** | ⏳ Fase 5 | Da responsabilidade do colega. |

## Notas
- **HTTPS:** o frontend usa `NEXT_PUBLIC_API_URL` (env var) — pronto para produção; em desenvolvimento usa `http://localhost`.
- **"Tempo real":** o estado dos pedidos atualiza ao carregar/refrescar a página (o sino de notificações faz polling de 30s).
