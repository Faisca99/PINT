Quero que faças uma auditoria completa à frontend mobile da app “PINT 2025 — Plataforma de Badges da Softinsa”.

Objetivo:
Verificar se a app mobile implementa TODAS as funcionalidades necessárias da plataforma Web, mas adaptadas a mobile. A app é apenas frontend, sem backend real. Por isso, aceita dados mockados, JSON local ou serviços simulados, desde que todos os fluxos, ecrãs, estados e interações estejam representados.

Muito importante:
Não assumes que algo está implementado só porque existe uma página parecida. Verifica e marca cada ponto como:
- OK — implementado corretamente
- PARCIAL — existe mas incompleto
- FALTA — não existe
- ERRO — existe mas está mal ligado, partido ou incoerente

No final, cria uma lista de correções prioritárias.

Formato da resposta:
Organiza a resposta em tabelas por secção:
1. Autenticação
2. Navegação e layout mobile
3. Consultor
4. Talent Manager
5. Service Line Leader
6. Administrador
7. Funcionalidades públicas
8. Gamification
9. Notificações
10. Relatórios e exports
11. RGPD, SLA e integrações
12. Estados visuais e UX
13. Dados mockados e preparação para backend
14. Problemas encontrados
15. Checklist final de aprovação

Para cada item, mostra:
- Funcionalidade
- Estado: OK / PARCIAL / FALTA / ERRO
- Onde aparece na app
- Observações
- O que falta corrigir

==================================================
1. AUTENTICAÇÃO
==================================================

Verifica se existem ecrãs e fluxos para:

[ ] Splash screen
[ ] Onboarding / welcome
[ ] Login com email e password
[ ] Guardar dados de login
[ ] Validação visual de campos inválidos
[ ] Mensagem de erro em login inválido
[ ] Registo de novo consultor
[ ] Escolha de área/service line no registo
[ ] Aceitação de termos RGPD no registo
[ ] Confirmação de registo
[ ] Confirmação de email
[ ] Primeira entrada com alteração obrigatória de password
[ ] Recuperar password
[ ] Nova password + confirmar password
[ ] Mensagem: “A sua password foi redefinida com sucesso”
[ ] Cancelar processo de recuperação
[ ] Logout com modal: “Pretende terminar a sua sessão?”
[ ] Após logout, voltar ao login
[ ] Suporte visual para 3 idiomas: PT, EN, ES

==================================================
2. NAVEGAÇÃO E LAYOUT MOBILE
==================================================

Verifica se a app tem:

[ ] Layout mobile-first
[ ] Bottom navigation por perfil
[ ] Header com saudação, avatar e sino de notificações
[ ] Menu “Mais” ou drawer para funcionalidades secundárias
[ ] Navegação separada por role
[ ] Botão voltar nos detalhes
[ ] Tabs para estados/listas
[ ] Bottom sheets para filtros e ações
[ ] Modais de confirmação
[ ] Cards em vez de tabelas largas
[ ] Design consistente com a Web
[ ] Cores, fontes, espaçamentos e botões consistentes
[ ] Layout responsivo para iOS/Android
[ ] Estados de loading
[ ] Empty states
[ ] Error states
[ ] Pull-to-refresh ou equivalente visual em listas

==================================================
3. PERFIL CONSULTOR
==================================================

Verifica se existem ecrãs e funcionalidades para:

Dashboard:
[ ] Dashboard pessoal do consultor
[ ] Saudação contextual
[ ] Nome, avatar, área e service line
[ ] Badges obtidos
[ ] Candidaturas em curso
[ ] Pontos totais
[ ] Ranking atual
[ ] Progresso nos Learning Paths
[ ] Jornada Técnica
[ ] Recomendações de próximos badges
[ ] Badges próximos de expiração
[ ] Últimas notificações
[ ] Próximos lembretes

Catálogo de badges:
[ ] Lista de badges disponíveis
[ ] Badges preferenciais da área do consultor
[ ] Consulta de badges de outras áreas
[ ] Pesquisa de badges
[ ] Filtros por Learning Path
[ ] Filtros por Service Line
[ ] Filtros por Área
[ ] Filtros por nível A/B/C/D/E
[ ] Filtros por estado
[ ] Filtros por pontos
[ ] Tabs: Recomendados / Minha Área / Todos / Obtidos
[ ] Badge card com imagem, título, nível, área, pontos e estado

Detalhe de badge:
[ ] Imagem/ícone do badge
[ ] Título
[ ] Descrição
[ ] Learning Path
[ ] Service Line
[ ] Área
[ ] Nível
[ ] Pontos
[ ] Competências certificadas
[ ] Requisitos necessários
[ ] Evidências exigidas
[ ] Intervalo temporal opcional
[ ] Expiração opcional
[ ] Botão “Candidatar-me”
[ ] Botão “Continuar candidatura”
[ ] Botão “Ver certificado” quando obtido
[ ] Badges relacionados ou próximos níveis

Candidaturas:
[ ] Criar nova candidatura
[ ] Guardar rascunho
[ ] Submeter candidatura
[ ] Estado Open
[ ] Estado Submitted
[ ] Estado Em Validação
[ ] Estado Fechado
[ ] Lista de candidaturas
[ ] Filtros por estado
[ ] Pesquisa por badge
[ ] Detalhe da candidatura
[ ] Timeline de estado
[ ] Histórico auditável
[ ] Comentários do Talent Manager
[ ] Comentários do Service Line Leader
[ ] Reenviar candidatura após devolução
[ ] Cancelar candidatura, se aplicável

Evidências:
[ ] Adicionar evidência por requisito
[ ] Upload visual de ficheiro
[ ] Escolher imagem
[ ] Escolher PDF/documento
[ ] Adicionar link como evidência
[ ] Preview do ficheiro
[ ] Remover evidência
[ ] Substituir evidência
[ ] Validação de tipo de ficheiro
[ ] Validação de tamanho
[ ] Estado de upload
[ ] Upload com dados mockados

Meus badges:
[ ] Galeria privada de badges obtidos
[ ] Filtro por nível
[ ] Filtro por área
[ ] Filtro por validade
[ ] Estado ativo
[ ] Estado expirado
[ ] Estado publicado
[ ] Estado privado
[ ] Publicar badge na galeria
[ ] Copiar link de verificação
[ ] Partilhar badge no LinkedIn
[ ] Download/preview de certificado PDF
[ ] Usar badge na assinatura de email

Certificados:
[ ] Preview de certificado
[ ] Nome do consultor
[ ] Nome do badge
[ ] Competências certificadas
[ ] Data de emissão
[ ] Validade
[ ] Link/código de verificação
[ ] Botão download PDF, mesmo que mockado
[ ] Botão partilhar

Timeline:
[ ] Timeline de evolução profissional
[ ] Eventos de candidaturas
[ ] Eventos de badges obtidos
[ ] Eventos de conquistas especiais
[ ] Marcos alcançados
[ ] Filtros por data/tipo
[ ] Visual vertical adequado a mobile

Outros:
[ ] Recomendações de próximos badges
[ ] Lembretes
[ ] Alertas de expiração
[ ] Configuração de assinatura de email
[ ] Template de email com badges
[ ] Settings do consultor
[ ] Preferências de idioma
[ ] Preferências de privacidade/RGPD
[ ] Preferências de notificações

==================================================
4. PERFIL TALENT MANAGER
==================================================

Verifica se existem:

Dashboard:
[ ] Dashboard Talent Manager
[ ] Total de candidaturas pendentes
[ ] Total de candidaturas submetidas
[ ] Total em validação
[ ] Total aprovadas/rejeitadas
[ ] Badges próximos da expiração
[ ] Total de consultores
[ ] Gráficos compactos
[ ] Lista de candidaturas recentes
[ ] Alertas importantes

Validações:
[ ] Lista de candidaturas submetidas
[ ] Talent Manager vê todas as submissões
[ ] Tabs por estado
[ ] Pesquisa por consultor
[ ] Pesquisa por badge
[ ] Filtros por área
[ ] Filtros por service line
[ ] Filtros por nível
[ ] Filtros por data
[ ] Detalhe da candidatura
[ ] Ver evidências
[ ] Ver requisitos
[ ] Ver histórico
[ ] Enviar para Service Line Leader
[ ] Devolver ao consultor
[ ] Comentário obrigatório ao devolver
[ ] Confirmação de ação
[ ] Estado muda para Em Validação quando enviado ao SLL
[ ] Histórico atualizado visualmente

Relatórios:
[ ] Relatórios por área/período
[ ] Nº de badges por range de datas
[ ] Nº de badges por Learning Path
[ ] Nº de badges por nível
[ ] Nº de utilizadores registados
[ ] Exportar pedidos Excel/PDF
[ ] Exportar badges Excel/PDF
[ ] Exportar consultores Excel/PDF
[ ] Exportar aprovações Excel/PDF
[ ] Exportar rejeições Excel/PDF

Consultores:
[ ] Lista de consultores
[ ] Detalhe de consultor
[ ] Badges do consultor
[ ] Timeline do consultor
[ ] Progresso do consultor
[ ] Pontos do consultor

==================================================
5. PERFIL SERVICE LINE LEADER
==================================================

Verifica se existem:

Dashboard:
[ ] Dashboard Service Line Leader
[ ] Dados limitados à sua Service Line/Área
[ ] Consultores da service line
[ ] Candidaturas em validação
[ ] Badges atribuídos
[ ] Pontos da equipa
[ ] SLA em risco
[ ] Ranking resumido
[ ] Progresso da equipa
[ ] Gráficos por nível
[ ] Gráficos por consultor

Aprovações:
[ ] Lista de candidaturas em validação
[ ] Apenas candidaturas da sua área/service line
[ ] Detalhe de aprovação
[ ] Ver evidências
[ ] Ver comentários do Talent Manager
[ ] Aprovar candidatura
[ ] Rejeitar candidatura
[ ] Send Back / devolver ao consultor
[ ] Comentário obrigatório em rejeição
[ ] Comentário obrigatório em send back
[ ] Estado Fechado quando aprova
[ ] Estado Fechado quando rejeita
[ ] Estado Open quando devolve
[ ] Histórico atualizado visualmente

Ranking:
[ ] Ranking da Service Line
[ ] Pontos por consultor
[ ] Badges por consultor
[ ] Comparação entre consultores
[ ] Top performers destacados

Relatórios:
[ ] Badges atribuídos por área/período
[ ] Exportação pedidos Excel/PDF
[ ] Exportação badges Excel/PDF
[ ] Exportação consultores Excel/PDF
[ ] Exportação aprovações Excel/PDF

==================================================
6. PERFIL ADMINISTRADOR
==================================================

Verifica se existem:

Dashboard:
[ ] Dashboard Admin
[ ] Total utilizadores
[ ] Total badges
[ ] Total candidaturas pendentes
[ ] Total badges atribuídos
[ ] Total avisos ativos
[ ] Total SLA ultrapassado
[ ] Gráficos globais
[ ] Ações rápidas

Utilizadores:
[ ] Lista de utilizadores
[ ] Pesquisa de utilizadores
[ ] Filtros por role
[ ] Filtros por área
[ ] Filtros por service line
[ ] Criar utilizador
[ ] Editar utilizador
[ ] Ativar/desativar utilizador
[ ] Definir perfil/role
[ ] Definir service line
[ ] Definir área
[ ] Obrigar alteração de password

Badges:
[ ] Lista de badges
[ ] Criar badge
[ ] Editar badge
[ ] Eliminar/desativar badge
[ ] Definir título
[ ] Definir descrição
[ ] Definir imagem
[ ] Definir Learning Path
[ ] Definir Service Line
[ ] Definir Área
[ ] Definir nível
[ ] Definir pontos
[ ] Definir expiração opcional
[ ] Definir intervalo temporal opcional
[ ] Definir competências certificadas
[ ] Definir requisitos/evidências necessárias
[ ] Preview do badge

Estrutura:
[ ] Gestão de Learning Paths
[ ] Gestão de Service Lines
[ ] Gestão de Áreas
[ ] Gestão de Níveis
[ ] Gestão de Requisitos
[ ] Visualização hierárquica
[ ] Criar/editar/eliminar entidades
[ ] Suporte futuro a Power Skills

Avisos:
[ ] Lista de avisos
[ ] Avisos ativos/inativos
[ ] Criar aviso
[ ] Editar aviso
[ ] Desativar aviso
[ ] Público-alvo
[ ] Data início/fim
[ ] Preview do aviso
[ ] Push notification visual/mockada

Notificações:
[ ] Configuração de notificações
[ ] Email on/off
[ ] Push on/off
[ ] In-app on/off
[ ] Templates de notificação
[ ] Preview de template

RGPD:
[ ] Lista de políticas RGPD
[ ] Criar política
[ ] Editar política
[ ] Ativar/desativar política
[ ] Histórico de versões
[ ] Ver aceitação dos utilizadores

SLA:
[ ] Configurar SLA Talent Manager
[ ] Configurar SLA Service Line Leader
[ ] Definir tempo limite
[ ] Ativar/desativar SLA
[ ] Ver incumprimentos
[ ] Alertas de SLA
[ ] Notificar por email
[ ] Notificar por push
[ ] Notificar Teams/Slack

Integrações:
[ ] Teams
[ ] Slack
[ ] Softinsa.pt
[ ] LinkedIn
[ ] Configurar webhook
[ ] Testar integração
[ ] Estado conectado/desconectado

Relatórios:
[ ] % de badges com visão mensal
[ ] Nº badges por range de datas
[ ] Nº badges por Learning Path
[ ] Nº badges por nível
[ ] Nº utilizadores registados
[ ] Exportações Excel/PDF

==================================================
7. FUNCIONALIDADES PÚBLICAS
==================================================

Verifica se existem:

[ ] Galeria pública de consultor
[ ] Página pública individual de badge
[ ] Verificação por link/token único
[ ] Estado “Badge válido”
[ ] Estado “Badge expirado”
[ ] Estado “Badge não encontrado”
[ ] Dados do consultor
[ ] Dados do badge
[ ] Competências certificadas
[ ] Data de emissão
[ ] Validade
[ ] Link para outros badges do consultor

==================================================
8. GAMIFICATION
==================================================

Verifica se existem:

[ ] Sistema visual de pontos
[ ] Ranking geral
[ ] Ranking por área
[ ] Ranking por service line
[ ] Ranking mensal/anual
[ ] Badges de conquistas especiais
[ ] Estados bloqueado/em progresso/conquistado
[ ] Celebração de marcos
[ ] Pontuação mantida mesmo se badge expirar
[ ] Visual premium/gamificado

==================================================
9. NOTIFICAÇÕES
==================================================

Verifica se existem notificações para:

[ ] Candidatura submetida
[ ] Candidatura enviada ao SLL
[ ] Candidatura aprovada
[ ] Candidatura rejeitada
[ ] Candidatura devolvida
[ ] Badge próximo de expiração
[ ] SLA ultrapassado
[ ] Novo aviso
[ ] Lembretes
[ ] Marcar notificação como lida
[ ] Centro de notificações
[ ] Badge counter no sino
[ ] Push notification mockada

==================================================
10. RELATÓRIOS E EXPORTS
==================================================

Verifica se existem:

[ ] Relatórios em cards/gráficos mobile
[ ] Filtros por data
[ ] Filtros por área
[ ] Filtros por service line
[ ] Filtros por nível
[ ] Filtros por estado
[ ] Exportar Excel visual/mockado
[ ] Exportar PDF visual/mockado
[ ] Mensagem de sucesso ao exportar
[ ] Empty state quando não há dados

==================================================
11. RGPD, SLA E INTEGRAÇÕES
==================================================

Verifica:

[ ] Aceitação de termos RGPD no registo
[ ] Gestão de preferências RGPD
[ ] Políticas RGPD no admin
[ ] Configuração de SLA
[ ] Alertas de SLA
[ ] Incumprimentos SLA
[ ] Integração Teams
[ ] Integração Slack
[ ] Integração LinkedIn
[ ] Integração Softinsa.pt
[ ] Estados mockados de ligação/desligado/erro

==================================================
12. ESTADOS VISUAIS E UX
==================================================

Verifica se existem estados para:

[ ] Loading
[ ] Empty
[ ] Erro
[ ] Sucesso
[ ] Confirmação
[ ] Sem internet
[ ] Formulário inválido
[ ] Upload em progresso
[ ] Upload concluído
[ ] Upload falhado
[ ] Candidatura aprovada
[ ] Candidatura rejeitada
[ ] Candidatura devolvida
[ ] Badge conquistado
[ ] Badge expirado
[ ] SLA ultrapassado

Também verifica:

[ ] Botões com área confortável para toque
[ ] Textos legíveis
[ ] Contraste adequado
[ ] Espaçamento consistente
[ ] Uso correto de cards
[ ] Evita tabelas largas
[ ] Bottom sheets funcionais
[ ] Modais claros
[ ] Ações destrutivas com confirmação

==================================================
13. DADOS MOCKADOS E PREPARAÇÃO PARA BACKEND
==================================================

Verifica se a frontend tem dados mockados para:

[ ] Utilizadores
[ ] Roles
[ ] Learning Paths
[ ] Service Lines
[ ] Áreas
[ ] Níveis
[ ] Badges
[ ] Requisitos
[ ] Candidaturas
[ ] Evidências
[ ] Reviews/comentários
[ ] Histórico
[ ] Badges obtidos
[ ] Pontos
[ ] Achievements
[ ] Notificações
[ ] Lembretes
[ ] Relatórios
[ ] Avisos
[ ] RGPD
[ ] SLA
[ ] Integrações

Verifica também:

[ ] Existe camada de serviços/mock API
[ ] A app está preparada para trocar mocks por API real
[ ] Os dados não estão todos hardcoded dentro dos componentes
[ ] Existe estrutura organizada de componentes
[ ] Existe estrutura organizada de screens/pages
[ ] Existe tema global de cores/tipografia
[ ] Existe sistema de navegação por role

==================================================
14. PROBLEMAS A REPORTAR
==================================================

No final da auditoria, lista:

1. Funcionalidades em falta
2. Funcionalidades parciais
3. Ecrãs que existem mas não estão ligados
4. Botões sem ação
5. Formulários sem validação
6. Estados não implementados
7. Incoerências de design face à Web
8. Funcionalidades duplicadas/confusas
9. Problemas de navegação
10. Funcionalidades que precisam de mock data

==================================================
15. CHECKLIST FINAL DE APROVAÇÃO
==================================================

Dá uma nota final de 0 a 100 para:

[ ] Cobertura funcional
[ ] Qualidade visual
[ ] Consistência com a Web
[ ] Experiência mobile
[ ] Organização dos ecrãs
[ ] Preparação para backend
[ ] Completude por perfil
[ ] Qualidade de protótipo/demo

Depois diz claramente:

- A app está pronta para apresentação? Sim/Não
- A app está pronta para ligar à backend? Sim/Não
- O que falta obrigatoriamente antes da entrega?
- Quais são as 10 correções mais importantes?