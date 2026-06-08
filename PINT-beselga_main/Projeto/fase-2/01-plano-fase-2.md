# Fase 2 - Implementacao Tecnica (Continuacao da Fase 1)

## Objetivo

Implementar a base tecnica executavel do projeto, mantendo:

- arquitetura modular definida na Fase 1
- design base do ficheiro pathway-quest-pro-main.zip
- regras funcionais dos requisitos
- ligacao total a PostgreSQL (Neon) como unica fonte de verdade

## Entregaveis desta fase

1. Camada SQL de negocio em cima do schema final:
- views para dashboards e pagina publica
- funcoes para fluxo de candidatura, aprovacao e pontos
- trigger padrao de updated_at

2. Contrato API x BD:
- mapeamento endpoint -> tabela/view/funcao
- queries base para implementar no backend (NestJS)

3. Mapeamento Design x Requisitos:
- ecras e componentes do design
- binding de dados reais da BD para cada area da UI

## Resultado esperado no fim da Fase 2

- BD pronta para ser consumida por backend sem logica critica espalhada no codigo
- API com contratos claros e consistentes com os requisitos
- frontend com plano de implementacao visual fiel ao design e ligado a dados reais

## Ordem recomendada de execucao

1. Executar schema base (fase-1/04-BD_FINAL.sql ou schema final equivalente)
2. Executar script SQL da Fase 2 (02-db-camada-negocio.sql)
3. Implementar endpoints core com base no ficheiro 03-api-bd-contrato.md
4. Implementar ecras Web/Mobile conforme ficheiro 04-design-mapeamento.md
5. Validar com checklist fim-a-fim

## Criterios de conclusao da Fase 2

- login, listagem de badges e candidatura funcional
- submissao, revisao TM, aprovacao SL Leader e atribuicao de badge funcional
- pontos, historico e notificacoes gerados por transacoes da BD
- pagina publica de verificacao de badge a responder com token valido
- dashboard do consultor alimentado por view da BD
