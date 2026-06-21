# 🗃️ _desatualizado — Fase 3 (Frontend Web)

Pasta de **quarentena** para conteúdo que já **não é usado** pela aplicação.
Nada aqui é importado/compilado (está excluído no `tsconfig.json`). Pode ser apagado com segurança após confirmação.

## Conteúdo

| Item | Porque foi movido |
|---|---|
| `pages-design/` | Scaffolding antigo do Figma/protótipo (LoginPage, BadgeCatalog, etc.). **Não era importado por nenhuma página real** (as páginas reais estão em `src/app/`). Usava `react-router-dom` e imagens estáticas que geravam **erros de TypeScript**. |
| `hero-bg.jpg` | Imagem de fundo do login **gerada por IA** (com defeitos). Substituída pelo componente `src/components/AuthHero.tsx` (fundo gráfico SVG). Já não é referenciada em `src/`. |

> Verificado em Junho 2026: mover estes itens **não quebrou o build** (type-check sem erros novos; os erros de `pages-design` desapareceram).
