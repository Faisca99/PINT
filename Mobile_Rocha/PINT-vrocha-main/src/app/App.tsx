import { useState, useEffect, type ReactNode } from "react";
import { AppProvider, useApp, useRequireUser } from "./context/AppContext";
import { MobileFrame } from "./components/shared/MobileFrame";

// Auth
import { SplashScreen, OnboardingScreen, LoginScreen, RegisterScreen, RecoverPasswordScreen, ConfirmEmailScreen } from "./components/auth/AuthScreens";
import { FirstLoginScreen } from "./components/auth/FirstLoginScreen";

// Consultor
import { ConsultorDashboard } from "./components/consultor/ConsultorDashboard";
import { BadgeCatalog, BadgeDetail } from "./components/consultor/BadgeScreens";
import { ApplicationsList, ApplicationDetail, NewApplicationScreen } from "./components/consultor/ApplicationScreens";
import {
  MyBadges, CertificateScreen, TimelineScreen, LeaderboardScreen,
  NotificationsScreen, ConsultorMoreScreen, ConsultorSettingsScreen,
  AchievementsScreen, RecommendationsScreen, EmailSignatureScreen,
} from "./components/consultor/ConsultorExtras";

// Public
import { PublicBadgeVerification, NoticesScreen, PublicGalleryScreen } from "./components/public/PublicScreens";

// Services
import { changePassword } from "./services/authService";
import { getReminders, createReminder, dismissReminder, type Reminder } from "./services/meService";
import { formatDate } from "./lib/badgeUtils";
import { WEB_BASE } from "./lib/config";

function AppRouter() {
  const { screen } = useApp();

  const screenMap: Record<string, ReactNode> = {
    // Auth
    splash: <SplashScreen />,
    onboarding: <OnboardingScreen />,
    login: <LoginScreen />,
    register: <RegisterScreen />,
    "confirm-email": <ConfirmEmailScreen />,
    "first-login": <FirstLoginScreen />,
    "recover-password": <RecoverPasswordScreen />,
    // Consultor
    "c-dashboard": <ConsultorDashboard />,
    "c-badges": <BadgeCatalog />,
    "c-badge-detail": <BadgeDetail />,
    "c-new-application": <NewApplicationScreen />,
    "c-applications": <ApplicationsList />,
    "c-application-detail": <ApplicationDetail />,
    "c-my-badges": <MyBadges />,
    "c-certificate": <CertificateScreen />,
    "c-timeline": <TimelineScreen />,
    "c-achievements": <AchievementsScreen />,
    "c-leaderboard": <LeaderboardScreen />,
    "c-notifications": <NotificationsScreen />,
    "c-more": <ConsultorMoreScreen />,
    "c-settings": <ConsultorSettingsScreen />,
    "c-recommendations": <RecommendationsScreen />,
    "c-email-signature": <EmailSignatureScreen />,
    "c-linkedin-share": <LinkedInShareScreen />,
    "c-public-gallery": <PublicGalleryScreen />,
    "c-reminders": <RemindersScreen />,
    "c-edit-profile": <EditProfileScreen />,
    "c-change-password": <ChangePasswordScreen />,
    "c-badge-verify": <PublicBadgeVerification />,
    // Public
    "public-badge": <PublicBadgeVerification />,
    "public-gallery": <PublicGalleryScreen />,
    notices: <NoticesScreen />,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {screenMap[screen] ?? <SplashScreen />}
    </div>
  );
}

// ─── LinkedIn Share Screen ────────────────────────────────────────────────────

function LinkedInShareScreen() {
  const { goBack, screenParams } = useApp();
  const publicToken = screenParams.public_token as string | undefined;
  const badgeName = screenParams.badge_name as string | undefined;
  const [copied, setCopied] = useState(false);

  const verifyUrl = publicToken ? `${WEB_BASE}/?verify=${publicToken}` : "";
  const postText = `🏅 Acabei de conquistar o badge ${badgeName ?? "digital"} na plataforma PINT 2025 da Softinsa!\n\nEsta certificação reconhece as minhas competências profissionais. Muito orgulhoso desta conquista!\n\n#PINT2025 #Softinsa #IBM #Badges`;

  const handleShare = () => {
    if (!verifyUrl) return;
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(verifyUrl)}&title=${encodeURIComponent(`Badge ${badgeName ?? ""} — PINT 2025 Softinsa`)}`;
    window.open(url, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <span className="text-slate-600">←</span>
        </button>
        <h3 className="text-slate-800">Partilhar no LinkedIn</h3>
      </div>
      <div className="flex-1 px-6 py-6 flex flex-col gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <p className="text-sm font-semibold text-slate-800 mb-2">Preview do post</p>
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <p className="text-sm text-slate-700 whitespace-pre-line">{postText}</p>
            {verifyUrl && (
              <p className="text-xs text-blue-600 mt-2 truncate">{verifyUrl}</p>
            )}
          </div>
        </div>
        <button onClick={handleShare} disabled={!verifyUrl}
          className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-40"
          style={{ background: "#0066cc" }}>
          💼 Partilhar no LinkedIn
        </button>
        <button onClick={handleCopy}
          className="w-full py-3 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold">
          {copied ? "✓ Copiado!" : "Copiar texto"}
        </button>
      </div>
    </div>
  );
}

// ─── Reminders Screen ─────────────────────────────────────────────────────────

function RemindersScreen() {
  const { goBack } = useApp();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [newDate, setNewDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getReminders().then(setReminders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDismiss = async (id: number) => {
    await dismissReminder(id);
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, is_dismissed: true } : r));
  };

  const handleCreate = async () => {
    if (!newTitle || !newDate) return;
    setSaving(true);
    try {
      await createReminder({ title: newTitle, message: newMsg, scheduled_for: newDate });
      const updated = await getReminders();
      setReminders(updated);
      setNewTitle(""); setNewMsg(""); setNewDate(""); setShowCreate(false);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
            <span className="text-slate-600">←</span>
          </button>
          <h3 className="text-slate-800">Lembretes</h3>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 text-lg font-medium">+</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🔔</span>
            <p className="text-sm font-semibold text-slate-600">Sem lembretes</p>
            <p className="text-xs text-slate-400">Cria um lembrete para não perder prazos.</p>
          </div>
        ) : (
          reminders.map((r) => (
            <div key={r.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-opacity ${r.is_dismissed ? "border-slate-100 opacity-40" : "border-slate-100"}`}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                  {r.message && <p className="text-xs text-slate-500 mt-0.5">{r.message}</p>}
                </div>
                {!r.is_dismissed && (
                  <button onClick={() => handleDismiss(r.id)} className="text-[10px] text-slate-400 hover:text-red-500 ml-2 flex-shrink-0">✕</button>
                )}
              </div>
              {r.scheduled_for && <p className="text-[10px] text-slate-400 mt-1">📅 {formatDate(r.scheduled_for)}</p>}
              {r.is_dismissed && <p className="text-[10px] text-slate-400 mt-1 italic">Dispensado</p>}
            </div>
          ))
        )}
      </div>

      {showCreate && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-slate-800">Novo Lembrete</h4>
              <button onClick={() => setShowCreate(false)} className="text-slate-400">✕</button>
            </div>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Título *"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Mensagem (opcional)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <input value={newDate} onChange={(e) => setNewDate(e.target.value)} type="datetime-local"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            <button onClick={handleCreate} disabled={!newTitle || !newDate || saving}
              className="w-full py-3 rounded-2xl text-white font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>
              {saving ? "A criar..." : "Criar Lembrete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Edit Profile Screen ──────────────────────────────────────────────────────

function EditProfileScreen() {
  const { goBack } = useApp();
  const user = useRequireUser();
  const [form, setForm] = useState({ name: user.name, email: user.email, area: user.area, serviceLine: user.serviceLine });
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => { setSuccess(false); goBack(); }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <span className="text-slate-600">←</span>
        </button>
        <h3 className="text-slate-800">Editar Perfil</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <p className="text-sm text-emerald-700 font-medium">Perfil atualizado com sucesso!</p>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>{user.avatar}</div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "Nome completo", key: "name" as const, type: "text" },
            { label: "Email", key: "email" as const, type: "email" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{field.label}</label>
              <input value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                type={field.type}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-400" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Área</label>
            <input value={form.area} readOnly
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500" />
          </div>
        </div>
        <button onClick={handleSave}
          className="w-full py-4 rounded-2xl text-white font-semibold mt-2"
          style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>
          Guardar alterações
        </button>
      </div>
    </div>
  );
}

// ─── Change Password Screen ───────────────────────────────────────────────────

function ChangePasswordScreen() {
  const { goBack, navigate, screenParams } = useApp();
  const firstLogin = screenParams.firstLogin as boolean | undefined;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = [
    { label: "Mínimo 8 caracteres", ok: next.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(next) },
    { label: "Número", ok: /[0-9]/.test(next) },
    { label: "Passwords coincidem", ok: next.length > 0 && next === confirm },
  ];
  const allOk = rules.every((r) => r.ok) && (firstLogin || current.length > 0);

  const handleSave = async () => {
    if (!allOk) { setError("Verifique os requisitos acima."); return; }
    setError("");
    setLoading(true);
    try {
      await changePassword(next);
      setSuccess(true);
      setTimeout(() => firstLogin ? navigate("c-dashboard") : goBack(), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao alterar password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
        {!firstLogin && (
          <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
            <span className="text-slate-600">←</span>
          </button>
        )}
        <h3 className="text-slate-800">Alterar Password</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {firstLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
            <p className="text-sm text-blue-700 font-medium">Por segurança, defina uma nova password para a sua conta.</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            <p className="text-sm text-emerald-700 font-medium">Password alterada com sucesso!</p>
          </div>
        )}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-3"><p className="text-sm text-red-600">{error}</p></div>}
        <div className="flex flex-col gap-3">
          {!firstLogin && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Password atual</label>
              <input value={current} onChange={(e) => setCurrent(e.target.value)} type="password" placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Nova password</label>
            <input value={next} onChange={(e) => setNext(e.target.value)} type="password" placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Confirmar nova password</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
          {rules.map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className={`text-sm ${r.ok ? "text-emerald-500" : "text-slate-300"}`}>{r.ok ? "✓" : "○"}</span>
              <p className={`text-xs ${r.ok ? "text-emerald-700" : "text-slate-400"}`}>{r.label}</p>
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={!allOk || loading}
          className="w-full py-4 rounded-2xl text-white font-semibold mt-2 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>
          {loading ? "A alterar..." : "Alterar password"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <AppRouter />
      </MobileFrame>
    </AppProvider>
  );
}
