Atua como um Arquiteto de Software Sénior e Full-Stack Developer. O meu objetivo é desenvolver do zero o projeto "PINT 2025 — Plataforma de Badges da Softinsa (V3.2 - Mobile)". 



Abaixo estão os requisitos completos do projeto. Lê-os atentamente para entenderes as regras de negócio, os diferentes perfis de utilizador e o fluxo de aprovação.



<requisitos>

# PINT 2025 — Plataforma de Badges da Softinsa (V3.2 - Mobile)



---## Contexto e Objetivo



A Softinsa, empresa de consultoria tecnológica, quer desenvolver uma **plataforma de badges digitais** similar ao Credly.com para certificar e evidenciar competências dos seus colaboradores.### Problemas que visa resolver:- Dificuldade em evidenciar e validar competências adquiridas- Falta de um sistema de gamification que motive a aprendizagem contínua- Ausência de uma forma padronizada de apresentar credenciais profissionais- Necessidade de aumentar a visibilidade da empresa e competências dos colaboradores### O projeto inclui:- Plataforma **Web** (4 perfis: Administrador, Consultor, Talent Manager, Service Line Leader)- Aplicação **Mobile** (para o consultor)



---## Estrutura de Learning Paths- **Learning Path em desenvolvimento:** Jornada Técnica (existe também "Power Skills", mas não é desenvolvido — a BD deve suportá-lo no futuro)- Cada Learning Path tem várias **Service Lines**, que têm várias **áreas**, que têm **5 níveis**:



| Nível | Nome |

|---|---|

| A (A1, A2, A3...) | Júnior |

| B (B1, B2, B3...) | Intermédio |

| C (C1, C2, C3...) | Sénior |

| D (D1, D2, D3...) | Especialista |

| E (E1, E2, E3...) | Líder de Conhecimento |



Ao cumprir **todos os requisitos de um nível**, o consultor obtém **1 Badge** desse nível.### Exemplos de Service Lines/Áreas:- Hybrid Cloud → LowCode (Outsystems)- Application Operations → DevSecOps & IT Automation – DevOps- Sourcing & Talent Management → Talent Management### Regras importantes:- Um consultor pode candidatar-se a **qualquer nível** sem ter os badges dos níveis anteriores, desde que tenha os requisitos- Um badge pode ter (opcionalmente) um **intervalo temporal** para ser obtido- O Administrador define os requisitos de cada nível (título, descrição, imagem, evidências necessárias)



---## Workflow de Aprovação1. **Consultor** submete candidatura com evidências → Estado: **Submitted**2. **Talent Manager** (vê todas as submissões, independentemente de área/service line): - ✅ Correto → envia ao Service Line Leader → Estado: **Em Validação** - ❌ Incorreto → devolve ao consultor → Estado: **Open**3. **Service Line Leader** (da área em questão): - ✅ Aprovar → Badge disponível para publicação → Estado: **Fechado** - ❌ Rejeitar → envia email ao consultor → Estado: **Fechado** - 🔄 Send Back → devolve ao consultor com comentário → Estado: **Open**



---## Perfil: Consultor (Web e Mobile)



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

| 28 | Integração com www.softinsa.pt para visualizar competências da Softinsa |### Bónus Consultor:- (12) Colocar badge na assinatura de email- (23) Configuração de template de email com badges obtidos- (Mobile a) Timeline de evolução profissional- (Mobile b) Notificações PUSH de SLA ultrapassados



---## Perfil: Service Line Leader



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

| 13 | Exportação de consultores para Excel/PDF |</requisitos>



### DIRETRIZES DE DESENVOLVIMENTO



Para garantir que o projeto é construído de forma estruturada e sem erros, vamos dividir o desenvolvimento em fases. Não escrevas o código todo de uma vez. Responde apenas à **Fase 1** agora e aguarda a minha aprovação para avançar para a Fase 2.



**Stack Tecnológica Preferencial:**

* Web (Frontend): [Ex: Next.js]

* Mobile: [Ex: React Native]

* Backend/API: [Ex: Node.js]

* Base de Dados: [Ex: PostgreSQL]

*(Nota: Se alguma estiver em branco, sugere a melhor arquitetura com base nos requisitos).*

*Design: Adapatar totalmente(100% identico) o design do ficheiro "pathway-quest-pro-main".*



---



### PLANO DE EXECUÇÃO (O que deves fazer)



**Fase 1: Arquitetura e Base de Dados (A tua primeira resposta)**

1. Sugere a arquitetura geral do sistema.

2. Cria o Esquema da Base de Dados (Entity-Relationship) em formato Markdown ou Mermaid.js. Precisamos de tabelas para Users, Roles, Learning Paths, Service Lines, Níveis, Badges, Submissions, Evidences, Points, etc.

3. Lista os Endpoints de API principais (REST ou GraphQL) necessários para suportar o Workflow de Aprovação.



**Fase 2: Setup e Autenticação (Apenas após a minha aprovação da Fase 1)**

1. Cria a estrutura inicial do projeto (Backend e Frontend Web).

2. Implementa o sistema de login, registo e gestão de sessões (com JWT ou similar) e encriptação de passwords.

3. Garante o redirecionamento baseado nos 4 perfis (Admin, Consultor, Talent Manager, Service Line Leader).



**Fase 3: CRUD Principal e Workflow (Backend)**

1. Implementa a criação de Learning Paths, Service Lines, Áreas, Níveis e Badges (Admin).

2. Implementa o sistema de candidatura (upload de evidências) do Consultor (estado "Submitted").

3. Implementa a lógica de aprovação (Talent Manager -> Service Line Leader -> Final) com as mudanças de estado.



**Fase 4: Frontend Web e Dashboards**

1. Desenvolve o dashboard do Consultor e o catálogo de badges.

2. Desenvolve as vistas de aprovação para o Talent Manager e Service Line Leader.

3. Desenvolve as tabelas de relatórios, gestão de utilizadores e exportação (Excel/PDF).



**Fase 5: Aplicação Mobile (Consultor)**

1. Cria a estrutura da app mobile.

2. Consome as APIs de listagem de badges, timeline de evolução e notificações push.



**Fase 6: Gamification e Bónus**

1. Implementa o sistema de pontos e o ranking.

2. Adiciona a lógica de expiração de badges, SLAs, geração de PDF de certificados personalizados e avisos contextuais/idiomas.



Entendeste o projeto e as diretrizes? Se sim, por favor, avança imediatamente com a **Fase 1**.