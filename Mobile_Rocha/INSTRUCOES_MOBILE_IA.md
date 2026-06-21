# 📱 PINT 2025 — Instruções de Implementação do MOBILE (para IA)

> **Perfil:** CONSULTOR apenas · **Entrega:** 27 de junho de 2026
> **Backend:** já 100% implementado (NestJS + PostgreSQL Neon) — **NÃO mexer**, só consumir a API.

---

## 🤖 PROTOCOLO OBRIGATÓRIO PARA A IA (ler primeiro)

Tu és uma IA que vai implementar/corrigir esta app. Segue **rigorosamente**:

1. **VERIFICA OS REQUISITOS 10 VEZES.** Antes de dizer "está feito", relê a secção *"REQUISITOS COMPLETOS"* deste documento e confirma, requisito a requisito, no código. Faz **10 passagens** de verificação — em cada passagem procura algo que tenha escapado na anterior.
2. **Não inventes requisitos** nem adiciones funcionalidades fora desta lista. O âmbito é **só o Consultor**.
3. **Nunca uses dados mock** nos ecrãs do Consultor — usa **sempre a API real** (ver secção *"BACKEND / API"*).
4. **Cada requisito tem um critério de aceitação.** Só marcas ✅ quando o critério está demonstrável a correr.
5. No fim, preenche a *"CHECKLIST FINAL DE VERIFICAÇÃO (10×)"* e lista honestamente o que ficou por fazer.
6. Se algo for ambíguo, assume o comportamento que **cumpre o requisito do PDF** e documenta a decisão.

---

## 🎯 OBJETIVO

A versão atual (`Mobile_Rocha/PINT-vrocha-main`) é uma **app WEB (React + Vite) dentro de um frame de iPhone** — **não é mobile nativo**. O `PROMPT_MOBILE.md` pedia **React Native + Expo**.

**Decisão:** migrar para **mobile legítimo (React Native + Expo)**, reaproveitando a lógica de negócio e a integração com a API que já existem na versão web (servem de referência fiel).

Há **dois caminhos** — segue o que o utilizador escolher:

- **CAMINHO A (recomendado, "mobile legítimo"):** Criar projeto **React Native + Expo** e **portar** todos os ecrãs do Consultor. A lógica/endpoints já estão provados na web — replica-os.
- **CAMINHO B (fallback rápido):** Manter a web mas torná-la **PWA instalável** (adicionar `manifest.json` + service worker) e usar a **Notification API** do browser para o push. *Só usar se o professor aceitar "mobile web".*

> Por defeito assume o **CAMINHO A** salvo indicação em contrário.

---

## 🧱 STACK

| | PEDIDO (PROMPT_MOBILE.md) | ATUAL (errado) | AÇÃO |
|---|---|---|---|
| Framework | **React Native + Expo (SDK 51+)** | React 18 + Vite (web) | Migrar (Caminho A) |
| Routing | Expo Router v3 | react-router | Expo Router |
| Persistência | AsyncStorage | localStorage | AsyncStorage |
| HTTP | Axios + interceptor `x-user-id` | fetch wrapper | Axios |
| Upload evidências | expo-document-picker / expo-image-picker | `<input type=file>` | Expo pickers |
| Certificado PDF | expo-print + expo-sharing | `window.print()` | Expo print |
| Deep links | expo-linking | — | Expo linking |
| Push (bónus) | expo-notifications | ❌ nenhum | Expo notifications |
| Idiomas | PT/EN/ES | ✅ já tem PT/EN/ES | Manter |

```bash
npx create-expo-app@latest fase-5-mobile --template tabs
cd fase-5-mobile
npx expo install expo-router axios @react-native-async-storage/async-storage \
  expo-document-picker expo-image-picker expo-print expo-sharing \
  expo-notifications expo-linking expo-linear-gradient @expo-google-fonts/ibm-plex-sans
```

---

## ❌ O QUE FALTA / CORRIGIR (prioridade)

> Estes são os **furos confirmados** após verificação a fundo da versão atual. Todos os outros requisitos do Consultor **já estão implementados** na web e devem ser **portados** tal como estão.

| Prioridade | Item | Detalhe | Critério de aceitação |
|---|---|---|---|
| 🔴 P1 | **Stack mobile legítima** | App é web, devia ser React Native + Expo | `npx expo start` corre a app num emulador/dispositivo |
| 🔴 P1 | **Remover ecrãs fora de âmbito** | Existem `components/admin/`, `sll/`, `talent-manager/` a usar `mockData.ts`. O mobile é **só Consultor**. | Não existe nenhum ecrã/rota de Admin/TM/SLL; `mockData.ts` apagado |
| 🟠 P2 | **Req 16 — Celebração de marcos** | `canvas-confetti` está instalado mas **nunca é usado**. Não há celebração ao atingir marcos. | Ao atingir 1/3/5/10 badges (de `/me/timeline` ou contagem de `/me/badges`), mostrar **animação de celebração + modal** |
| 🟠 P2 | **Bónus b — Notificação PUSH** | Não existe push. | RN: `expo-notifications` agenda notificação local (ex.: badge a expirar, lembrete). PWA: `Notification` API |
| 🟢 P3 | **Garantir 0 mock no Consultor** | Confirmar que todos os ecrãs do Consultor leem da API real | Nenhum import de `mockData` em ecrãs do Consultor |

---

## ✅ REQUISITOS COMPLETOS — MOBILE CONSULTOR (verificar 10×)

> Fonte: PDF V3.2, pág. 10 (Mobile – Consultor). Para **cada** requisito está o **endpoint** e o **critério de aceitação**. Marca ✅ só quando demonstrável.

| # | Requisito | Endpoint(s) | Critério de aceitação | Estado web atual |
|---|---|---|---|---|
| 1 | Email confirmação registo + **alterar password no 1º login** | `POST /auth/change-password`; ler `user.must_change_password` | Se `must_change_password=true` após login → ecrã de alterar password obrigatório | ✅ |
| 2 | Escolher **área** no registo → badges preferenciais | `GET /auth/areas`, `POST /auth/register` (`area_id`) | Picker de área no registo; dashboard destaca badges da área | ✅ |
| 3 | Ver badges **fora** da sua área | `GET /badges` | Catálogo lista todos os badges; pesquisa por nome/área | ✅ |
| 4 | **Dashboard** com progresso nos Learning Paths | `GET /me/dashboard`, `GET /me/badges` | Pontos + barras de progresso por nível (A→E) | ✅ |
| 5 | **Upload de evidências** | `POST /applications/:id/evidences` | Selecionar ficheiro/foto e submeter evidência por requisito | ✅ |
| 6 | **Status dos pedidos em tempo real** | `GET /applications/mine` | Lista com estados coloridos; pull-to-refresh | ✅ |
| 7 | Histórico de badges **obtidos e em processo** | `GET /me/badges` + `GET /applications/mine` | Separação clara entre obtidos e em processo | ✅ |
| 8 | **Catálogo** com descrições | `GET /badges` | Lista com descrição + pesquisa | ✅ |
| 9 | **Requisitos** por badge | `GET /badges/:id` | Detalhe mostra requisitos + instruções de evidência | ✅ |
| 10 | Aceitação **RGPD** para publicação | `POST /me/badges/:id/publish` | Modal RGPD com checkbox antes de publicar | ✅ |
| 11 | Partilhar badge no **LinkedIn** | (link com `public_token`) | Botão partilha → abre LinkedIn share do link público | ✅ |
| 13 | Sistema de **pontos** | `GET /me/dashboard` | Pontos totais visíveis no dashboard | ✅ |
| 14 | Badges de **conquistas especiais** | `GET /me/achievements` | Lista com desbloqueadas e bloqueadas | ✅ |
| 15 | **Métricas de progresso visual** | `GET /me/badges` | Barras/percentagens de progresso por nível | ✅ |
| **16** | **Celebração de marcos** | `GET /me/timeline` / contagem de `/me/badges` | **Animação (confetti) + modal ao atingir 1/3/5/10 badges** | ⚠️ **EM FALTA** |
| 17 | **Recomendações** de próximos badges | `GET /me/recommendations` | Cards com próximos níveis sugeridos | ✅ |
| 18 | Download de **certificados PDF** | (gerar no cliente) | RN: `expo-print` + `expo-sharing` gera/partilha PDF | ✅ (web `window.print`) |
| 19 | Email de confirmação de candidatura | `POST /applications/:id/submit` (backend trata) | Sem ação no mobile; backend envia | ✅ |
| 20 | **Notificações** aprovação/rejeição | `GET /me/notifications`, `POST /me/notifications/read` | Sino com contagem não lidas; marcar como lidas | ✅ |
| 21 | **Alertas de expiração** de badges | `GET /me/badges` (`expires_at`) | Aviso para badges a expirar em ≤30 dias | ✅ |
| 22 | **Lembretes** | `GET/POST /me/reminders`, `POST /me/reminders/:id/dismiss` | Listar, criar e dispensar lembretes | ✅ |
| 24-26 | Página pública / **verificação por link único** | `GET /me/verify/:token`, `GET /me/gallery/:userId` | Ecrã público (sem auth) com badge verificado ✓ | ✅ |
| 26 | Info detalhada de competências | `GET /badges/:id` | Detalhe completo de requisitos/competências | ✅ |
| B-a | **Timeline** de evolução | `GET /me/timeline` | Lista cronológica de eventos | ✅ |
| **B-b** | **Notificação PUSH de SLA** | `expo-notifications` | **Notificação local agendada** | ❌ **EM FALTA** |
| Bónus | **3 idiomas** PT/EN/ES | i18n local | Troca de idioma aplica em toda a app | ✅ |
| Bónus | **Saudação contextual** (Bom dia/tarde/noite + 1º login + >15 dias) nos 3 idiomas | local (`lastLoginAt`) | Saudação correta conforme hora/idioma | ✅ |
| Bónus | Avisos da plataforma | `GET /admin/notices/active?role=consultant` | Lista de avisos ativos para o consultor | ✅ |

---

## 🔗 BACKEND / API

**URL base (React Native):** `http://[IP_DA_MAQUINA]:3001/api/v1` — **nunca `localhost`** num dispositivo/emulador (`ipconfig` para descobrir o IP).
**Autenticação:** header `x-user-id: [id]` em todos os endpoints autenticados (interceptor automático).

### Cliente HTTP (RN)
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({ baseURL: 'http://[SEU_IP]:3001/api/v1', timeout: 10000 });
api.interceptors.request.use(async (config) => {
  const stored = await AsyncStorage.getItem('pint_auth');
  if (stored) { const a = JSON.parse(stored); if (a?.id) config.headers['x-user-id'] = String(a.id); }
  return config;
});
```

### Endpoints (todos implementados e em uso na versão web)
```
AUTH      POST /auth/login · POST /auth/register · GET /auth/areas
          POST /auth/change-password · POST /auth/forgot-password · POST /auth/reset-password
BADGES    GET /badges · GET /badges/:id
CANDID.   POST /applications · GET /applications/mine · GET /applications/:id
          POST /applications/:id/evidences · POST /applications/:id/submit
ME        GET /me/dashboard · GET /me/badges · GET /me/recommendations · GET /me/achievements
          GET /me/leaderboard · GET /me/timeline · GET /me/notifications · POST /me/notifications/read
          GET/POST /me/reminders · POST /me/reminders/:id/dismiss
          POST /me/badges/:id/publish · GET /me/verify/:token · GET /me/gallery/:userId
AVISOS    GET /admin/notices/active?role=consultant
```

### Contas de teste (Consultor)
| Email | Password |
|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` |
| `santos@softinsa.pt` | `Softinsa2025!` |
| `rocha@softinsa.pt` | `Softinsa2025!` |

---

## 🎨 DESIGN SYSTEM

```typescript
export const COLORS = {
  primary:'#1e4d8c', accent:'#0bacda', success:'#2d9d6e', warning:'#f59e0b',
  destructive:'#dc2626', background:'#f4f5f8', card:'#ffffff', border:'#e2e6ec',
  muted:'#6b7280', foreground:'#0f1c2e',
};
export const LEVEL_COLORS = { A:'#10b981', B:'#3b82f6', C:'#f59e0b', D:'#8b5cf6', E:'#ef4444' };
// Gradiente principal: ['#1e4d8c', '#0bacda'] · Tipografia: IBM Plex Sans
```
Cores por nível: A=Júnior(verde) · B=Intermédio(azul) · C=Sénior(âmbar) · D=Especialista(roxo) · E=Líder(vermelho).

---

## 🧪 DEFINITION OF DONE

Um requisito só está **DONE** quando:
1. Usa a **API real** (zero mock).
2. Funciona a correr (não só "código escrito").
3. Trata **loading** e **erro** (não crasha sem rede).
4. Está em **PT/EN/ES** se tiver texto visível.
5. Foi confirmado nas **10 passagens** de verificação.

---

## 🔁 CHECKLIST FINAL DE VERIFICAÇÃO (10×)

> Faz **10 passagens** por esta checklist. Em cada passagem, anota o que falta.

- [ ] **Passagem 1** — Auth: login, registo c/ área, 1º login muda password, recuperar password (com cancelar + validação a vermelho)
- [ ] **Passagem 2** — Dashboard: pontos, progresso por nível, recomendações, **alerta de expiração**, saudação contextual (PT/EN/ES)
- [ ] **Passagem 3** — Catálogo: lista, pesquisa, filtro, detalhe c/ requisitos
- [ ] **Passagem 4** — Candidaturas: criar, upload evidências, submeter, estados em tempo real
- [ ] **Passagem 5** — Meus Badges: obtidos, publicar c/ **RGPD**, **LinkedIn**, **certificado PDF**
- [ ] **Passagem 6** — Gamificação: conquistas, leaderboard, timeline, **celebração de marcos (Req 16)**
- [ ] **Passagem 7** — Lembretes (criar/dispensar) + Notificações (sino, marcar lidas)
- [ ] **Passagem 8** — Verificação pública `/verify/:token` + galeria pública (sem auth)
- [ ] **Passagem 9** — 3 idiomas aplicam em TODA a app · avisos da plataforma
- [ ] **Passagem 10** — **PUSH (Bónus b)** · **ZERO ecrãs de Admin/TM/SLL** · **ZERO mock no Consultor** · app corre em Expo

### No fim, responde SEMPRE:
1. Lista de requisitos ✅ feitos (com prova: ecrã + endpoint).
2. Lista de requisitos ❌/⚠️ por fazer (com motivo).
3. Confirmar: "Stack = React Native + Expo" ✔/✘ e "Âmbito = só Consultor" ✔/✘.

---

## ⚠️ ARMADILHAS CONHECIDAS
1. **`localhost` não funciona** em dispositivo/emulador — usar IP da máquina.
2. **`x-user-id`** é obrigatório em endpoints autenticados (interceptor trata).
3. **Não há paginação** no backend — paginar no cliente em listas longas.
4. **Casts enum PostgreSQL** são tratados no backend — o mobile só lê dados, não envia enums crus.
5. **Não recriar o backend** — está pronto; só consumir.
