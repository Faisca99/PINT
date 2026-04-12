# Ponto de Situação - Projeto Pathway / Quest Pro

Este documento serve para passar o contexto do projeto a outro membro do grupo (ou ao assistente AI) para continuar o desenvolvimento a partir deste exato ponto.

## 📋 Checklist de Progresso

### Concluído (✅)
- [x] **Setup Inicial**: Criação do projeto frontend em Next.js (`fase-3-frontend`) e resolução de conflitos de portas (3000 vs 3001).
- [x] **UI & Design**: Integração do template base, configuração do Tailwind CSS (compatibilidade v4 vs v3) e instalação de dependências (`lucide-react`, framer-motion, etc).
- [x] **Backend Extensions**: Modificação do `applications.service.ts` e `controller` para incluir endpoints adicionais necessários ao frontend (ex: `GET /applications/:id` com agregação JSON `json_agg` das evidências).
- [x] **Fluxo do Consultor (Frontend)**:
  - Página de Detalhe da Badge (`/badges/[id]`).
  - Criação da Candidatura (`POST /applications`).
  - Formulário Dinâmico de Candidatura (`/candidaturas/[id]`).
  - Submissão de Evidências (`POST /applications/:id/evidences`).
  - Submissão Final da Candidatura (`POST /applications/:id/submit`).

### Pendente / Próximos Passos (⏳)
- [ ] **Vista de Validação (Talent Manager & Service Line Leader)**: Criar a Caixa de Entrada (Inbox) que lista todas as candidaturas nos estados `submitted` ou `in_validation`.
- [ ] **Revisão de Evidências**: Criar a vista de detalhe para os aprovadores poderem ver as evidências submetidas por um consultor.
- [ ] **Botões de Decisão**: Integrar as ações de `Aprovar` / `Rejeitar` no frontend e conectá-las aos respetivos endpoints do backend (`POST /applications/:id/approve` ou equivalente).
- [ ] **Gestão de Autenticação / Utilizadores**: Atualmente os testes estão a ser feitos injetando um utilizador *hardcoded* (ex: userId 1). Implementar/Simular o login corretamente.

---

## 🤖 Prompt para o AI (Para copiar e colar na próxima sessão)

Copia o texto abaixo e envia ao assistente para retomar imediatamente o trabalho:

```text
Olá! Estou a trabalhar num projeto full-stack (NestJS no backend na pasta `fase-2/backend-api` e Next.js no frontend na pasta `fase-3-frontend`).

O fluxo do "Consultor" (pesquisa de badges e submissão de candidaturas com evidências) já está finalizado. Os componentes visuais base e o Tailwind já estão configurados. 

O objetivo agora é focar-nos no Fluxo de Validação (Talent Manager e Service Line Leader), seguindo rigorosamente os requisitos do projeto. 

Por favor:
1. Analisa os endpoints existentes no backend (`applications.controller.ts` e `applications.service.ts`) para ver como recuperar as candidaturas submetidas e como realizar a aprovação/rejeição.
2. Cria a página de "Caixa de Entrada" no Next.js onde os líderes podem listar as candidaturas pendentes de aprovação.
3. Cria a vista de detalhe para os líderes reverem as evidências e aprovarem/rejeitarem.

Avança passo-a-passo. Podes começar por criar a página de lista de candidaturas pendentes no frontend caso o backend já tenha o endpoint de listagem, ou se precisares, cria o endpoint no backend primeiro. Mostra-me o plano.
```