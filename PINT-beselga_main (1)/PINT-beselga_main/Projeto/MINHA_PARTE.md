# A Minha Parte — Trabalho Feito & Como Verificar
> PINT 2025 — Plataforma de Badges Softinsa (Web)
> Commit: `11052e5 "My Part"` · Tudo commitado (git status limpo)

Este documento resume **o que eu fiz** nesta fase e **como confirmar** que está
a funcionar. No fim explico o caso das **bandeiras** (o que o colega viu no PC dele).

---

## 1. O que foi feito

| # | Funcionalidade | Onde | Estado |
|---|---|---|---|
| 1 | **Multilíngua (PT/EN/ES)** aplicado a toda a app, não só ao sidebar | 24 páginas/componentes via `t()` | ✅ |
| 2 | **Tags de nível traduzidas** (Júnior, Intermédio, Sénior, Especialista, Líder) | catálogo de badges, dashboard, detalhe do badge | ✅ |
| 3 | **Detalhe do badge** com nível traduzido | `app/badges/[id]/page.tsx` | ✅ |
| 4 | **Achievements** traduzido | `app/achievements/page.tsx` | ✅ |
| 5 | **Estados em Validação** com `StatusBadge` (submetido/em validação/aprovado/rejeitado) traduzidos | `app/validacao/*` | ✅ |
| 6 | **Testes unitários** (Jest) — não existiam antes | `src/__tests__/lib/*` | ✅ |
| 7 | Ajustes no backend (email, dashboard, users, applications) | `fase-2/backend-api/src/*` | ✅ |

**Traduções de nível** (`src/lib/i18n.ts`):

| Código | PT | EN | ES |
|---|---|---|---|
| A | Júnior | Junior | Junior |
| B | Intermédio | Intermediate | Intermedio |
| C | Sénior | Senior | Senior |
| D | Especialista | Specialist | Especialista |
| E | Líder de Conhecimento | Knowledge Leader | Líder de Conocimiento |

---

## 2. Como arrancar

```bash
# Backend  → http://localhost:3001/api/v1
cd Projeto/fase-2/backend-api
npm install
npm run start:dev

# Frontend → http://localhost:3000
cd Projeto/fase-3-frontend
npm install
npm run dev
```

**Contas de teste** (password: `Softinsa2025!`):

| Email | Role |
|---|---|
| `abreu@softinsa.pt` | Consultor |
| `faisca@softinsa.pt` | Talent Manager |
| `beselga@softinsa.pt` | Service Line Leader |
| `admin@softinsa.pt` | Administrador |

---

## 3. Como verificar (passo a passo)

### 3.1 Multilíngua (PT/EN/ES)
1. Login em qualquer conta.
2. Topo da app (seletor de língua no header) **ou** página **Definições** → mudar para **EN**.
3. ✅ Esperado: sidebar, dashboard, catálogo, candidaturas e validação mudam para inglês.
4. Mudar para **ES** → o mesmo em espanhol.

### 3.2 Tags de nível traduzidas
1. Ir a **Badges** (catálogo).
2. ✅ Cada cartão mostra a tag de nível (ex.: **Júnior**, **Sénior**).
3. Mudar a língua para EN → as tags passam a **Junior**, **Senior**, etc.
4. Abrir um badge (detalhe) → o nível aparece traduzido também.

### 3.3 Estados em Validação
1. Login como **Talent Manager** (`faisca@softinsa.pt`).
2. Ir a **Validação**.
3. ✅ Cada candidatura mostra a etiqueta de estado (Submetido / Em Validação / Aprovado / Rejeitado), traduzida conforme a língua.

### 3.4 Testes unitários
```bash
cd Projeto/fase-3-frontend
npm test
```
✅ Esperado: testes de `constants`, `greeting` e `i18n` a passar.

---

## 4. ⚠️ As bandeiras "não são iguais" (o que o colega viu)

### O que se passa
As bandeiras no seletor de língua são **emoji** (`🇵🇹 🇬🇧 🇪🇸`).
**O Windows não desenha bandeiras de países** — as fontes do sistema não
incluem esses glifos. Por isso, no PC do colega aparecem **as duas letras**
(`PT`, `GB`, `ES`) em vez da bandeira.

- ✅ **Linux / macOS / Android / iPhone** → mostram a bandeira.
- ❌ **Windows (Chrome/Edge/Firefox)** → mostram letras `PT` / `GB` / `ES`.

**Não é um bug do código** — é uma limitação do Windows. O código está igual
nos dois PCs; só o sistema operativo desenha o emoji de forma diferente.

### Onde está no código
- `src/components/AppLayout.tsx` (linhas ~16-19) — seletor no header
- `src/app/settings/page.tsx` (linhas ~10-13) — página de Definições

### Como verificar que é só isto
- Abrir a app no telemóvel ou num Mac/Linux → as bandeiras aparecem certas.
- No Windows, o **resto funciona na mesma** (mudar de língua funciona); só o
  ícone é que aparece como texto.

### Soluções possíveis (se quiserem mesmo bandeiras no Windows)
Estas implicam **alterar código** (fazer só com prompt `MODIFICAR:`):
1. **Imagens SVG/PNG** das bandeiras em vez de emoji (`public/flags/pt.svg` …) —
   solução mais fiável, igual em todos os SO.
2. **Biblioteca de ícones de bandeiras** (ex.: `flag-icons` via CSS).
3. **Fonte de emoji com bandeiras** (ex.: carregar *Twemoji*) — funciona mas
   é mais pesado.

> Recomendado: opção 1 (SVGs), porque garante o mesmo aspeto em Windows,
> Linux, Mac e mobile.
