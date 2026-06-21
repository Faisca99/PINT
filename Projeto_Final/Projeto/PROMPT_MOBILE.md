# PINT 2025 — Guia de Arranque: Aplicação Mobile
> Plataforma de Badges da Softinsa — Fase 5 (Mobile)
> Perfil: **CONSULTOR apenas** | Stack: React Native + Expo

---

## 📖 Contexto do Projeto

A Softinsa quer uma **aplicação mobile de badges digitais** similar ao Credly.com.
O mobile é **exclusivamente para o perfil Consultor** — os outros perfis (TM, SLL, Admin) só existem na web.

O backend **já está completamente implementado** em NestJS + PostgreSQL Neon.
Não precisas de tocar no backend — só consomes a API.

---

## 🛠️ Stack Tecnológica

```
React Native + Expo (SDK 51+)
TypeScript
Expo Router v3 (file-based routing)
Axios (chamadas HTTP)
AsyncStorage (persistência local)
Expo Notifications (notificações push)
Expo Document Picker (upload de evidências)
Expo Print + Sharing (certificados PDF)
Expo Linking (deep links)
```

### Instalação

```bash
# Criar projeto
npx create-expo-app@latest fase-5-mobile --template tabs
cd fase-5-mobile

# Dependências principais
npx expo install \
  expo-router \
  axios \
  @react-native-async-storage/async-storage \
  expo-document-picker \
  expo-image-picker \
  expo-print \
  expo-sharing \
  expo-notifications \
  expo-linking \
  @expo-google-fonts/ibm-plex-sans

# Arrancar
npx expo start --tunnel   # dispositivo físico
npx expo start            # emulador
```

---

## 🔗 Ligação ao Backend

### URL Base
```
http://[IP_DA_TUA_MAQUINA]:3001/api/v1
```
> ⚠️ **NÃO usar `localhost`** — o emulador/dispositivo não consegue aceder ao localhost do computador.
> Descobrir o IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)

### Autenticação
Todos os endpoints autenticados precisam do header `x-user-id`:
```
x-user-id: [id do utilizador logado]
```

### Configurar o cliente HTTP (`src/lib/api.ts`)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://[SEU_IP]:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Interceptor — injeta x-user-id automaticamente em todos os pedidos
api.interceptors.request.use(async (config) => {
  try {
    const stored = await AsyncStorage.getItem('pint_auth');
    if (stored) {
      const auth = JSON.parse(stored);
      if (auth?.id) config.headers['x-user-id'] = String(auth.id);
    }
  } catch {}
  return config;
});
```

---

## 👤 Contas de Teste (BD actualizada 15/05/2026)

| Email | Password | Role | Nome |
|---|---|---|---|
| `abreu@softinsa.pt` | `Softinsa2025!` | Consultor | Francisco Abreu |
| `santos@softinsa.pt` | `Softinsa2025!` | Consultor | Tiago Santos |
| `rocha@softinsa.pt` | `Softinsa2025!` | Consultor | Victor Rocha |

---

## 📡 Endpoints da API (Todos implementados)

### Autenticação
```
POST /auth/login
  Body: { email: string, password: string }
  Response: { accessToken, refreshToken, user: { id, full_name, email, role, area, service_line, must_change_password, last_login_at } }

POST /auth/register
  Body: { full_name, email, password, area_id? }

GET  /auth/areas
  Response: [{ id, name, code, service_line_name }]   ← para o picker de área no registo

POST /auth/change-password
  Header: x-user-id
  Body: { password: string }

POST /auth/forgot-password
  Body: { email: string }
  Response: { reset_token }   ← em modo académico, o token é devolvido directamente

POST /auth/reset-password
  Body: { token: string, password: string }
```

### Badges (Catálogo)
```
GET /badges
  Response: [{ id, code, name, description, badge_type, points, level_code, level_name, area_name, service_line_name, learning_path_name }]

GET /badges/:id
  Response: { badge: {...}, requirements: [{ id, code, title, description, evidence_instructions, display_order }] }
```

### Candidaturas
```
POST /applications
  Header: x-user-id
  Body: { badgeId: number }
  Response: { id: number }   ← id da candidatura criada

GET /applications/mine
  Header: x-user-id
  Response: [{ id, badge_id, badge_name, level_code, level_name, area_name, status, final_result, created_at, submitted_at, closed_at }]

GET /applications/:id
  Response: { id, badge_id, badge_name, status, final_result, evidences: [{ id, requirement_id, requirement_code, requirement_title, file_name, file_url, description, uploaded_at }] }

POST /applications/:id/evidences
  Header: x-user-id
  Body: { requirementId, fileName, storageKey, fileUrl, description? }

POST /applications/:id/submit
  Header: x-user-id
```

### Perfil & Dados Pessoais
```
GET /me/dashboard
  Header: x-user-id
  Response: { points, objectives, badge_count }

GET /me/badges
  Header: x-user-id
  Response: [{ id, badge_id, badge_name, description, badge_type, points, level_code, level_name, area_name, awarded_at, expires_at, is_published, public_token, points_awarded }]

GET /me/recommendations
  Header: x-user-id
  Response: [{ id, badge_name, description, points, level_code, level_name, area_name }]

GET /me/achievements
  Header: x-user-id
  Response: [{ id, code, name, description, points_bonus, awarded_at, celebrated }]

GET /me/leaderboard
  Response: [{ id, full_name, total_points, badge_count }]

GET /me/timeline
  Header: x-user-id
  Response: [{ event_type, id, status, final_result, occurred_at, badge_name, level_code }]

GET /me/notifications
  Header: x-user-id
  Response: [{ id, type, title, message, is_read, sent_at }]

POST /me/notifications/read
  Header: x-user-id

POST /me/badges/:id/publish
  Header: x-user-id
  (requer aceitação RGPD — mostrar modal antes de chamar)

GET /me/verify/:token
  (sem auth — página pública)

GET /me/gallery/:userId
  (sem auth — galeria pública)
```

### Lembretes
```
GET  /me/reminders
  Header: x-user-id

POST /me/reminders
  Header: x-user-id
  Body: { title, message, scheduled_for }

POST /me/reminders/:id/dismiss
  Header: x-user-id
```

### Avisos (visíveis para o consultor)
```
GET /admin/notices/active?role=consultant
```

---

## 📱 FUNCIONALIDADES OBRIGATÓRIAS (PDF — Mobile Consultor)

### Req. 1 — Email de confirmação + alterar password no 1º login
- Após login, verificar `user.must_change_password`
- Se `true` → redirecionar para ecrã `/change-password`
- Após alterar → chamar `POST /auth/change-password`

### Req. 2 — Escolher área ao registar
- Chamar `GET /auth/areas` para popular o picker
- Enviar `area_id` no `POST /auth/register`

### Req. 3 — Consultar badges disponíveis (mesmo fora da sua área)
- `GET /badges` com barra de pesquisa por nome/área
- Filtro por service line
- Navegar para detalhe ao tocar num badge

### Req. 4 — Dashboard pessoal com progresso nos Learning Paths
- `GET /me/dashboard` para pontos + `GET /me/badges` para badges ganhos
- Mostrar barras de progresso por nível (A=verde, B=azul, C=amarelo, D=roxo, E=vermelho)
- Mostrar alerta de badges a expirar (expires_at < hoje + 30 dias)

### Req. 5 — Upload de evidências
- `expo-document-picker` para selecionar ficheiros
- `expo-image-picker` para tirar foto (certificados físicos)
- Para demo: usar a URL pública do ficheiro como `fileUrl`
- Chamar `POST /applications/:id/evidences` com os dados

### Req. 6 — Status dos pedidos em tempo real
- `GET /applications/mine` com pull-to-refresh
- Mostrar estado com cores: Aberto=cinza, Submetida=âmbar, Em Validação=azul, Aprovada=verde, Rejeitada=vermelho

### Req. 7 — Histórico de badges obtidos e em processo
- Tab ou secção separada entre `GET /applications/mine` (em processo) e `GET /me/badges` (obtidos)

### Req. 8 — Catálogo de badges com descrições
- Lista de `GET /badges` com pesquisa e pull-to-refresh

### Req. 9 — Requisitos por badge
- Ecrã de detalhe `GET /badges/:id` com lista de requisitos e instruções de evidência

### Req. 10 — Aceitação RGPD para publicação
- Antes de `POST /me/badges/:id/publish` → mostrar bottom sheet com o texto RGPD e checkbox de aceitação

### Req. 11 — Partilhar badge no LinkedIn
- Para badges publicados, usar:
```typescript
import { Linking } from 'react-native';
const verifyUrl = `http://[IP]:3000/verify/${badge.public_token}`;
Linking.openURL(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`);
```

### Req. 13 — Sistema de pontos
- Mostrar pontos totais no dashboard (`/me/dashboard` → `points`)

### Req. 14 — Badges de conquistas especiais
- `GET /me/achievements` — lista com desbloqueadas (awarded_at preenchido) e bloqueadas

### Req. 15 — Métricas de progresso visual
- Barras de progresso por nível no dashboard
- Percentagem de badges por nível completados

### Req. 16 — Celebração de marcos
- `GET /me/timeline` — filtrar por `event_type === 'badge_earned'`
- Mostrar marcos: 1º badge, 3 badges, 5 badges, 10 badges

### Req. 17 — Recomendações de próximos badges
- `GET /me/recommendations` — cards com o próximo nível sugerido por área

### Req. 18 — Download de certificados PDF
```typescript
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const generateCertificate = async (badge) => {
  const html = `
    <html><body style="font-family:Arial;padding:40px;text-align:center">
      <h1 style="color:#1e4d8c">SOFTINSA</h1>
      <h2>Certificado de Competência</h2>
      <p>Certifica-se que</p>
      <h2>${badge.consultant_name}</h2>
      <p>obteve o badge</p>
      <h3>${badge.badge_name}</h3>
      <p>Nível ${badge.level_code} — ${badge.level_name}</p>
      <p>Emitido em ${new Date(badge.awarded_at).toLocaleDateString('pt-PT')}</p>
    </body></html>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
};
```

### Req. 19 — Email de confirmação de candidatura
- Backend envia automaticamente quando se chama `POST /applications/:id/submit`
- Não é necessária acção adicional no mobile

### Req. 20 — Notificações de aprovação/rejeição
- `GET /me/notifications` → badge no ícone do sino com contagem de não lidas
- Ao abrir → `POST /me/notifications/read`
- Usar `expo-notifications` para notificações push locais

### Req. 21 — Alertas de expiração de badges
- Filtrar `GET /me/badges` onde `expires_at` < hoje + 30 dias
- Mostrar banner/card de aviso no dashboard

### Req. 22 — Lembretes
- `GET /me/reminders` → lista de lembretes
- `POST /me/reminders` → criar novo lembrete
- `POST /me/reminders/:id/dismiss` → dispensar

### Req. 24-26 — Página pública de badge (verificação)
- Deep link para `/verify/:token`
- Chamar `GET /me/verify/:token` (sem auth)
- Mostrar card com: nome do consultor, badge, data, "Verificado ✓"

### Req. 26 — Informações detalhadas por badge
- Ecrã de detalhe `GET /badges/:id` com todos os requisitos

### BÓNUS a) — Timeline de evolução
- `GET /me/timeline` → lista cronológica de eventos (badge ganho, conquista, candidatura)

### BÓNUS b) — Notificação PUSH de SLA
- Usar `expo-notifications` para notificações locais agendadas
- Backend suporta SLA via `/admin/slas` — quando candidatura demora muito, notificar

---

## 🎨 Design System

### Cores (CSS → React Native)

```typescript
export const COLORS = {
  primary:    '#1e4d8c',   // azul escuro
  accent:     '#0bacda',   // cyan
  success:    '#2d9d6e',   // verde
  warning:    '#f59e0b',   // âmbar
  destructive:'#dc2626',   // vermelho
  background: '#f4f5f8',   // cinza claro
  card:       '#ffffff',   // branco
  border:     '#e2e6ec',   // cinza borda
  muted:      '#6b7280',   // cinza texto secundário
  foreground: '#0f1c2e',   // azul muito escuro (texto)
};

// Gradiente principal (botões principais, badges)
// Usar expo-linear-gradient:
// colors={['#1e4d8c', '#0bacda']} start={[0,0]} end={[1,1]}

// Cores por nível:
export const LEVEL_COLORS = {
  A: '#10b981',  // verde (Júnior)
  B: '#3b82f6',  // azul (Intermédio)
  C: '#f59e0b',  // âmbar (Sénior)
  D: '#8b5cf6',  // roxo (Especialista)
  E: '#ef4444',  // vermelho (Líder de Conhecimento)
};
```

### Tipografia

```typescript
// Instalar: npx expo install @expo-google-fonts/ibm-plex-sans expo-font
import { useFonts, IBMPlexSans_400Regular, IBMPlexSans_600SemiBold, IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans';

export const FONTS = {
  regular:  'IBMPlexSans_400Regular',
  semibold: 'IBMPlexSans_600SemiBold',
  bold:     'IBMPlexSans_700Bold',
};
```

---

## 📁 Estrutura de Ecrãs Sugerida

```
app/
├── _layout.tsx              ← Root layout (fontes, contexto, splash)
├── index.tsx                ← Redirect baseado em auth
│
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx            ← Login com email/password
│   ├── register.tsx         ← Registo com escolha de área
│   ├── forgot-password.tsx  ← Recuperar password (3 passos)
│   └── change-password.tsx  ← Alterar password (1º login)
│
├── (tabs)/
│   ├── _layout.tsx          ← Tab bar (Dashboard, Badges, Candidaturas, Perfil)
│   ├── index.tsx            ← Dashboard (pontos, progresso, recomendações, expiração)
│   ├── badges.tsx           ← Catálogo com pesquisa e filtros
│   ├── candidaturas.tsx     ← Minhas candidaturas com estados
│   └── perfil.tsx           ← Perfil, definições, língua, logout
│
├── badges/
│   └── [id].tsx             ← Detalhe do badge + botão candidatar
│
├── candidaturas/
│   └── [id].tsx             ← Formulário de evidências + submissão
│
├── my-badges/
│   └── index.tsx            ← Badges ganhos com publicar/download
│
├── achievements.tsx         ← Conquistas desbloqueadas e bloqueadas
├── leaderboard.tsx          ← Ranking de pontos
├── timeline.tsx             ← Timeline de evolução
├── lembretes.tsx            ← Lista e criar lembretes
├── notificacoes.tsx         ← Lista de notificações
├── avisos.tsx               ← Avisos da plataforma
│
└── verify/
    └── [token].tsx          ← Verificação pública (sem auth)
```

---

## 💾 Modelo de Dados (AsyncStorage)

```typescript
// Chave: 'pint_auth'
interface StoredUser {
  id: number;
  name: string;           // full_name
  email: string;
  role: 'consultant';
  area: string | null;
  serviceLine: string | null;
  accessToken: string;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
}

// Guardar após login:
await AsyncStorage.setItem('pint_auth', JSON.stringify(userData));

// Ler:
const stored = await AsyncStorage.getItem('pint_auth');
const user = stored ? JSON.parse(stored) : null;

// Apagar no logout:
await AsyncStorage.removeItem('pint_auth');
```

---

## 🔔 Notificações Push (BÓNUS)

```typescript
import * as Notifications from 'expo-notifications';

// Pedir permissão
const { status } = await Notifications.requestPermissionsAsync();

// Notificação local (ex: lembrete)
await Notifications.scheduleNotificationAsync({
  content: {
    title: '⏰ Lembrete',
    body: 'Tens um badge a expirar em breve!',
  },
  trigger: {
    date: new Date(badge.expires_at),
  },
});

// Notificação imediata (ex: badge aprovado — via polling)
await Notifications.presentNotificationAsync({
  title: '🏅 Badge Aprovado!',
  body: `O badge ${badgeName} foi atribuído com sucesso.`,
});
```

---

## 🗃️ Estado da Base de Dados (15/05/2026)

A BD Neon já tem tudo preenchido e funcional:

| Entidade | Dados |
|---|---|
| Service Lines | Hybrid Cloud · Application Operations · Sourcing & Talent Management |
| Áreas | LowCode (LC) · DevSecOps & IT Automation (DSO) · Talent Management (TM) |
| Níveis por área | A (Júnior), B (Intermédio), C (Sénior), D (Especialista), E (Líder) |
| Total de badges | 15 (BDG-LC-A→E, BDG-DSO-A→E, BDG-TM-A→E) |
| Requisitos | 2 por badge (30+ no total) |
| Conquistas | 19 definições activas |
| Utilizadores de teste | 6 utilizadores activos |

**Estrutura de pontos dos badges:**
- Nível A (Júnior): 50 pts
- Nível B (Intermédio): 100 pts
- Nível C (Sénior): 250 pts
- Nível D (Especialista): 400 pts
- Nível E (Líder de Conhecimento): 600 pts

---

## 📋 Checklist de Implementação

### Fase 1 — Base
- [ ] Setup do projeto Expo + dependências
- [ ] Configurar `api.ts` com interceptor e IP correcto
- [ ] Context/hook de autenticação (`useAuth`)
- [ ] Navegação: auth stack vs. tabs stack
- [ ] Ecrãs de Login e Registo funcionais

### Fase 2 — Core Consultor
- [ ] Dashboard com pontos e progresso por nível
- [ ] Catálogo de badges com pesquisa
- [ ] Detalhe de badge com requisitos
- [ ] Criar candidatura e submeter evidências
- [ ] Lista "Minhas Candidaturas" com estados
- [ ] "Meus Badges" com badges ganhos

### Fase 3 — Funcionalidades avançadas
- [ ] Notificações in-app (sino)
- [ ] Conquistas
- [ ] Leaderboard
- [ ] Timeline
- [ ] Lembretes
- [ ] Recomendações de badges
- [ ] Alertas de expiração

### Fase 4 — RGPD, PDF, LinkedIn
- [ ] Modal RGPD antes de publicar badge
- [ ] Download de certificado PDF
- [ ] Partilha no LinkedIn
- [ ] Verificação pública (`/verify/:token`)
- [ ] Galeria pública

### Fase 5 — Bónus
- [ ] Notificações push locais
- [ ] Línguas PT/EN/ES
- [ ] Saudação contextual (Bom dia/tarde/noite)
- [ ] Avisos da plataforma

---

## ⚠️ Pontos de atenção

1. **IP vs localhost** — Nunca usar `localhost`. Usar o IP da máquina na rede local.
2. **x-user-id** — Todos os endpoints autenticados precisam deste header. O interceptor do axios trata disso automaticamente.
3. **Upload de evidências** — Para demo, o `fileUrl` pode ser qualquer URL pública acessível. Numa versão real, faria upload para S3/Cloudflare R2.
4. **Tipos enum PostgreSQL** — O backend pode devolver erros se os parâmetros de estado não tiverem cast. Não é problema no mobile (só lemos dados, não escrevemos enums directamente).
5. **Paginação** — Os endpoints devolvem todos os dados sem paginação. Para listas longas, implementar paginação client-side no mobile (slice por página).
