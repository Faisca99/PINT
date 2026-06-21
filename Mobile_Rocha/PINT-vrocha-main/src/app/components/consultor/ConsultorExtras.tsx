import { useState, useEffect } from "react";
import { Bell, ChevronLeft, Download, ExternalLink, LogOut, Star, ChevronRight, CheckCircle, Lock, User, FileText, Share2, Shield, Zap } from "lucide-react";
import { useApp, useRequireUser } from "../../context/AppContext";
import { AppHeader } from "../shared/AppHeader";
import { ConsultorBottomNav } from "../shared/BottomNav";
import { LevelChip } from "../shared/StatusChip";
import {
  getMyBadges, getAchievements, getLeaderboard, getTimeline, getNotifications,
  getRecommendations, markAllNotificationsRead, publishBadge,
  type MyBadge, type Achievement, type LeaderboardEntry, type TimelineEvent,
  type ApiNotification, type Recommendation,
} from "../../services/meService";
import { getBadgeIcon, getBadgeColor, formatDate, isExpired, isExpiringSoon, getInitials, LEVEL_NAMES } from "../../lib/badgeUtils";
import { WEB_BASE } from "../../lib/config";

// ─── My Badges ───────────────────────────────────────────────────────────────

export function MyBadges() {
  const { navigate } = useApp();
  const user = useRequireUser();
  const [badges, setBadges] = useState<MyBadge[]>([]);
  const [filter, setFilter] = useState<"Todos" | "Ativos" | "Expirados">("Todos");
  const [loading, setLoading] = useState(true);
  const [rgpdBadge, setRgpdBadge] = useState<MyBadge | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [rgpdAccepted, setRgpdAccepted] = useState(false);

  useEffect(() => {
    getMyBadges().then(setBadges).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const visible = badges.filter((b) => {
    if (filter === "Ativos") return !isExpired(b.expires_at);
    if (filter === "Expirados") return isExpired(b.expires_at);
    return true;
  });

  const handlePublish = async () => {
    if (!rgpdBadge) return;
    setPublishing(true);
    try {
      await publishBadge(rgpdBadge.id);
      setBadges((prev) => prev.map((b) => b.id === rgpdBadge.id ? { ...b, is_published: true } : b));
      setRgpdBadge(null);
      setRgpdAccepted(false);
    } catch {
      // silent
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Meus Badges" showBack showNotif />
      <div className="flex-1 overflow-y-auto pb-20 px-4 py-3">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {(["Todos", "Ativos", "Expirados"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${filter === f ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🏅</span>
            <p className="text-slate-500 text-sm">Nenhum badge encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {visible.map((badge) => {
              const expired = isExpired(badge.expires_at);
              const expiringSoon = isExpiringSoon(badge.expires_at);
              return (
                <button key={badge.id} onClick={() => navigate("c-badge-detail", { badgeId: badge.badge_id })}
                  className={`bg-white rounded-2xl p-4 shadow-sm border text-left flex gap-4 ${expired ? "opacity-60 border-slate-100" : expiringSoon ? "border-amber-200" : "border-slate-100"}`}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${getBadgeColor(badge.level_code)}22` }}>
                    {getBadgeIcon(badge.area_name, badge.level_code)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm">{badge.badge_name}</p>
                      <LevelChip level={badge.level_code} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{badge.area_name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-400">Obtido: {formatDate(badge.awarded_at)}</span>
                      <span className="flex items-center gap-1 text-[10px] text-amber-600"><Star size={10} fill="#f59e0b" /> {badge.points_awarded} pts</span>
                    </div>
                    {expired && <span className="text-[10px] text-red-500 font-medium">Expirado</span>}
                    {expiringSoon && !expired && <span className="text-[10px] text-amber-600 font-medium">⏰ Expira em {formatDate(badge.expires_at)}</span>}
                    {!badge.is_published && !expired && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRgpdBadge(badge); }}
                        className="mt-1.5 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        + Publicar badge
                      </button>
                    )}
                    {badge.is_published && (
                      <span className="mt-1.5 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">✓ Publicado</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => navigate("c-certificate")}
            className="py-3 rounded-2xl border-2 border-blue-200 text-blue-700 font-semibold text-sm flex items-center justify-center gap-1">
            <FileText size={14} /> Certificados
          </button>
          <button onClick={() => navigate("c-public-gallery", { userId: Number(user?.id), userName: user?.name })}
            className="py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm flex items-center justify-center gap-1">
            <Share2 size={14} /> Galeria Pública
          </button>
        </div>
      </div>
      <ConsultorBottomNav />

      {/* RGPD Modal */}
      {rgpdBadge && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="w-12 h-1 rounded-full bg-slate-200 mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `${getBadgeColor(rgpdBadge.level_code)}22` }}>
                {getBadgeIcon(rgpdBadge.area_name, rgpdBadge.level_code)}
              </div>
              <div>
                <h3 className="text-slate-800">{rgpdBadge.badge_name}</h3>
                <p className="text-xs text-slate-500">Publicação de badge</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-600" />
                <p className="text-sm font-semibold text-slate-800">Aviso RGPD</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ao publicar este badge, o seu nome e informação profissional serão visíveis publicamente
                através de um link de verificação. Estes dados podem ser partilhados no LinkedIn e outras
                plataformas. Pode despublicar a qualquer momento nas definições do badge.
              </p>
            </div>
            <label className="flex items-start gap-3 mb-5 cursor-pointer">
              <div onClick={() => setRgpdAccepted(!rgpdAccepted)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${rgpdAccepted ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                {rgpdAccepted && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-sm text-slate-700">Compreendo e aceito os termos de publicação de dados pessoais de acordo com o RGPD.</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => { setRgpdBadge(null); setRgpdAccepted(false); }}
                className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm">
                Cancelar
              </button>
              <button onClick={handlePublish} disabled={!rgpdAccepted || publishing}
                className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                {publishing ? "A publicar..." : "Publicar Badge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Certificate ─────────────────────────────────────────────────────────────

export function CertificateScreen() {
  const { goBack, screenParams } = useApp();
  const user = useRequireUser();
  const [myBadge, setMyBadge] = useState<MyBadge | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMyBadges().then((badges) => {
      const b = screenParams.myBadgeId
        ? badges.find((x) => x.id === screenParams.myBadgeId)
        : screenParams.badgeId
        ? badges.find((x) => x.badge_id === screenParams.badgeId)
        : badges[0];
      setMyBadge(b ?? null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCopyLink = async () => {
    if (!myBadge?.public_token) return;
    await navigator.clipboard.writeText(`${WEB_BASE}/?verify=${myBadge.public_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedIn = () => {
    if (!myBadge?.public_token) return;
    const url = `${WEB_BASE}/?verify=${myBadge.public_token}`;
    const text = encodeURIComponent(`Conquista de badge ${myBadge.badge_name} na PINT 2025 Softinsa! #PINT2025 #Softinsa`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${text}`, "_blank");
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!myBadge) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        <AppHeader title="Certificado" showBack />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="text-4xl">🎓</span>
          <p className="text-slate-500 text-sm">Nenhum certificado disponível.</p>
          <button onClick={() => goBack()} className="text-blue-600 font-medium text-sm">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Certificado" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-4 border border-slate-100" id="certificate-print">
          <div className="h-20 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0f1f3d, #0066cc)" }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏅</span>
              <div className="text-white">
                <p className="font-bold text-sm">PINT 2025</p>
                <p className="text-blue-200 text-xs">Softinsa · IBM</p>
              </div>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Certifica que</p>
            <p className="text-xl font-bold text-slate-800 mb-1">{user.name}</p>
            <p className="text-xs text-slate-500 mb-4">completou com sucesso</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">{getBadgeIcon(myBadge.area_name, myBadge.level_code)}</span>
              <h3 className="text-slate-800">{myBadge.badge_name}</h3>
            </div>
            <div className="flex justify-center gap-3 mb-4">
              <LevelChip level={myBadge.level_code} />
              <span className="flex items-center gap-1 text-sm text-amber-600"><Star size={12} fill="#f59e0b" /> {myBadge.points_awarded} pts</span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
              <div>
                <p>Emitido: {formatDate(myBadge.awarded_at)}</p>
                {myBadge.expires_at && <p>Validade: {formatDate(myBadge.expires_at)}</p>}
              </div>
              {myBadge.public_token && (
                <div className="text-right">
                  <p className="font-mono">{myBadge.public_token.slice(0, 12).toUpperCase()}</p>
                  <p>Código de verificação</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => window.print()}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Download size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-800">Download PDF</span>
          </button>
          {myBadge.public_token && (
            <button onClick={handleLinkedIn}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <ExternalLink size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-800">Partilhar no LinkedIn</span>
            </button>
          )}
          {myBadge.public_token && (
            <button onClick={handleCopyLink}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              {copied ? <CheckCircle size={18} className="text-emerald-600" /> : <Share2 size={18} className="text-slate-500" />}
              <span className="text-sm font-medium text-slate-800">{copied ? "Link copiado!" : "Copiar link de verificação"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

const EVENT_ICONS: Record<string, string> = {
  badge_awarded: "🏅",
  application_submitted: "📤",
  application_returned: "↩️",
  application_approved: "✅",
  application_rejected: "❌",
  validation_started: "🎯",
  joined: "🚀",
};

export function TimelineScreen() {
  const user = useRequireUser();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimeline().then(setEvents).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Timeline" showBack showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Resumo da Jornada</p>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{user.badgesCount}</p>
              <p className="text-xs text-slate-500">Badges</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user.points}</p>
              <p className="text-xs text-slate-500">Pontos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{events.filter((e) => e.event_type === "badge_awarded").length}</p>
              <p className="text-xs text-slate-500">Conquistas</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">📜</span>
            <p className="text-slate-500 text-sm">Sem eventos na timeline ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {events.map((event, i) => {
              const icon = EVENT_ICONS[event.event_type] ?? "📌";
              const color = event.event_type === "badge_awarded" ? "#10b981" : event.event_type === "application_rejected" ? "#ef4444" : "#0066cc";
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${color}22` }}>
                      {icon}
                    </div>
                    {i < events.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{event.badge_name}</p>
                      <p className="text-xs text-slate-500">{event.event_type.replace(/_/g, " ")}{event.status ? ` · ${event.status}` : ""}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(event.occurred_at)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ConsultorBottomNav />
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function LeaderboardScreen() {
  const user = useRequireUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setEntries).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumRanks = [2, 1, 3];
  const medalColors = { 1: "#f59e0b", 2: "#94a3b8", 3: "#cd7c3e" };
  const podiumHeights = { 1: "h-24", 2: "h-20", 3: "h-16" };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Ranking" showBack showNotif />
      <div className="flex-1 overflow-y-auto pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {top3.length >= 3 && (
              <div className="px-4 py-4">
                <div className="flex items-end justify-center gap-3">
                  {podiumOrder.map((entry, i) => {
                    const rank = podiumRanks[i];
                    const color = medalColors[rank as keyof typeof medalColors];
                    const height = podiumHeights[rank as keyof typeof podiumHeights];
                    const initials = getInitials(entry.full_name);
                    return (
                      <div key={entry.id} className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                          {initials}
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium text-center w-16 truncate">{entry.full_name.split(" ")[0]}</span>
                        <div className={`w-16 ${height} rounded-t-xl flex items-start justify-center pt-2`}
                          style={{ background: `${color}33`, border: `2px solid ${color}66` }}>
                          <span className="font-bold text-sm" style={{ color }}>#{rank}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{entry.total_points.toLocaleString("pt-PT")} pts</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-4 flex flex-col gap-2">
              {entries.map((entry, idx) => {
                const rank = idx + 1;
                const isMe = entry.id === Number(user.id);
                return (
                  <div key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-2xl border shadow-sm ${isMe ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100"}`}>
                    <span className={`text-sm font-bold w-6 ${rank <= 3 ? "text-amber-600" : "text-slate-400"}`}>#{rank}</span>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(entry.full_name)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isMe ? "text-blue-800" : "text-slate-700"}`}>
                        {entry.full_name}{isMe ? " (eu)" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">{entry.total_points.toLocaleString("pt-PT")}</p>
                      <p className="text-[10px] text-slate-400">{entry.badge_count} badges</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

const NOTIF_ICONS: Record<string, string> = {
  approval: "✅", rejection: "❌", sendback: "↩️", notice: "📢",
  sla: "⚠️", expiration: "⏰", reminder: "🔔", badge_awarded: "🏅",
};

export function NotificationsScreen() {
  const { goBack, markNotifRead, setNotifCount } = useApp();
  const [notifs, setNotifs] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifs(data);
      setNotifCount(data.filter((n) => !n.is_read).length);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    markNotifRead();
    setNotifCount(0);
  };

  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <Bell size={18} className="text-slate-600" />
          <h3 className="text-slate-800">Notificações</h3>
          {unreadCount > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs text-blue-600 font-medium">Marcar todas como lidas</button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🔔</span>
            <p className="text-slate-500 text-sm">Sem notificações.</p>
          </div>
        ) : (
          notifs.map((notif) => (
            <div key={notif.id}
              className={`mb-2 rounded-2xl p-4 border shadow-sm ${notif.is_read ? "bg-white border-slate-100" : "bg-blue-50 border-blue-200"}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{NOTIF_ICONS[notif.type] ?? "📣"}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className={`text-sm font-semibold ${notif.is_read ? "text-slate-700" : "text-blue-800"}`}>{notif.title}</p>
                    {!notif.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                  <span className="text-[10px] text-slate-400">{formatDate(notif.sent_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── ConsultorMore ────────────────────────────────────────────────────────────

export function ConsultorMoreScreen() {
  const { navigate, logout } = useApp();
  const user = useRequireUser();
  const [showLogout, setShowLogout] = useState(false);

  const items: { icon: string; label: string; screen: Parameters<typeof navigate>[0] }[] = [
    { icon: "🏅", label: "Meus Badges", screen: "c-my-badges" },
    { icon: "🏆", label: "Conquistas", screen: "c-achievements" },
    { icon: "📊", label: "Leaderboard", screen: "c-leaderboard" },
    { icon: "🌟", label: "Recomendações", screen: "c-recommendations" },
    { icon: "🔔", label: "Lembretes", screen: "c-reminders" },
    { icon: "📢", label: "Avisos", screen: "notices" },
    { icon: "📜", label: "Certificados", screen: "c-certificate" },
    { icon: "📧", label: "Assinatura de Email", screen: "c-email-signature" },
    { icon: "⚙️", label: "Definições", screen: "c-settings" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <div className="px-4 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #0f1c2e 0%, #1e4d8c 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>
            {user.avatar}
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">{user.name}</p>
            <p className="text-xs text-blue-200">{user.area}{user.serviceLine ? ` · ${user.serviceLine}` : ""}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-blue-100">⭐ {user.points} pts</span>
              <span className="text-xs text-blue-100">🏅 {user.badgesCount} badges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {items.map((item, i) => (
            <button key={item.label} onClick={() => navigate(item.screen)}
              className={`flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-slate-50 transition-colors ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}>
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
        <button onClick={() => setShowLogout(true)}
          className="mt-4 flex items-center gap-3 w-full px-4 py-3.5 text-left bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-red-50 transition-colors">
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-600">Terminar sessão</span>
        </button>
      </div>
      <ConsultorBottomNav />

      {showLogout && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="w-12 h-1 rounded-full bg-slate-200 mx-auto mb-5" />
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-slate-800 mb-1">Terminar sessão?</h3>
              <p className="text-slate-500 text-sm">Pretende terminar a sua sessão?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm">
                Cancelar
              </button>
              <button onClick={logout}
                className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function ConsultorSettingsScreen() {
  const { navigate, lang, setLang, logout } = useApp();
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [publicGallery, setPublicGallery] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Definições" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Perfil</p>
          </div>
          {[
            { icon: <User size={16} className="text-blue-600" />, label: "Editar perfil", screen: "c-edit-profile" as const },
            { icon: <Lock size={16} className="text-slate-500" />, label: "Alterar password", screen: "c-change-password" as const },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.screen)}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0">
              {item.icon}
              <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
              <ChevronRight size={14} className="text-slate-300" />
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Idioma</p>
          </div>
          <div className="flex gap-2 px-4 py-3">
            {(["pt", "en", "es"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${lang === l ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                {l === "pt" ? "🇵🇹 PT" : l === "en" ? "🇬🇧 EN" : "🇪🇸 ES"}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Notificações</p>
          </div>
          {[
            { label: "Notificações Push", val: notifPush, set: setNotifPush },
            { label: "Notificações Email", val: notifEmail, set: setNotifEmail },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50 last:border-0">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <button onClick={() => item.set(!item.val)}
                className={`w-12 h-6 rounded-full transition-colors relative ${item.val ? "bg-blue-600" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.val ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-slate-50">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Privacidade</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50">
            <div>
              <p className="text-sm font-medium text-slate-700">Galeria pública</p>
              <p className="text-xs text-slate-400">Os seus badges são visíveis publicamente</p>
            </div>
            <button onClick={() => setPublicGallery(!publicGallery)}
              className={`w-12 h-6 rounded-full transition-colors relative ${publicGallery ? "bg-blue-600" : "bg-slate-200"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${publicGallery ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-slate-50">
            <Shield size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Política RGPD</span>
            <ChevronRight size={14} className="text-slate-300 ml-auto" />
          </button>
        </div>

        <button onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full px-4 py-3.5 bg-white rounded-2xl border border-slate-100 hover:bg-red-50 transition-colors">
          <LogOut size={16} className="text-red-500" />
          <span className="text-sm font-medium text-red-600">Terminar sessão</span>
        </button>
      </div>

      {showLogoutModal && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="w-12 h-1 rounded-full bg-slate-200 mx-auto mb-5" />
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-slate-800 mb-1">Terminar sessão?</h3>
              <p className="text-slate-500 text-sm">Pretende terminar a sua sessão na plataforma PINT 2025?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm">
                Cancelar
              </button>
              <button onClick={logout}
                className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export function AchievementsScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievements().then(setAchievements).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Achievements" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🏆</span>
            <p className="text-slate-500 text-sm">Nenhuma conquista ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => {
              const obtained = !!ach.awarded_at;
              return (
                <div key={ach.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border ${obtained ? "border-amber-200" : "border-slate-100"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${obtained ? "bg-amber-50" : "bg-slate-50"}`}>
                      🏆
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{ach.name}</p>
                        {obtained && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">Conquistado</span>}
                      </div>
                      <p className="text-xs text-slate-500">{ach.description}</p>
                      {ach.points_bonus > 0 && <p className="text-xs text-amber-600 mt-0.5">+{ach.points_bonus} pts</p>}
                      {obtained && ach.awarded_at && (
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(ach.awarded_at)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export function RecommendationsScreen() {
  const { navigate } = useApp();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations().then(setRecs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Recomendações" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🌟</span>
            <p className="text-slate-500 text-sm">Nenhuma recomendação disponível.</p>
          </div>
        ) : (
          recs.map((rec) => (
            <button key={rec.id} onClick={() => navigate("c-badge-detail", { badgeId: rec.id })}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left flex gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${getBadgeColor(rec.level_code)}22` }}>
                {getBadgeIcon(rec.area_name, rec.level_code)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-semibold text-sm text-slate-800">{rec.badge_name}</p>
                  <LevelChip level={rec.level_code} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mb-1">{rec.area_name}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    <Zap size={10} /> Recomendado
                  </span>
                  <span className="text-xs text-amber-600">{rec.points} pts</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Email Signature ──────────────────────────────────────────────────────────

export function EmailSignatureScreen() {
  const user = useRequireUser();
  const [myBadges, setMyBadges] = useState<MyBadge[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMyBadges().then((badges) => {
      setMyBadges(badges);
      if (badges[0]) setSelected([badges[0].id]);
    }).catch(() => {});
  }, []);

  const toggle = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectedBadges = myBadges.filter((b) => selected.includes(b.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Assinatura de Email" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <h4 className="text-slate-700 mb-3">Selecionar badges</h4>
        <div className="flex flex-col gap-2 mb-4">
          {myBadges.map((badge) => (
            <button key={badge.id} onClick={() => toggle(badge.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors
                ${selected.includes(badge.id) ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200"}`}>
              <span className="text-2xl">{getBadgeIcon(badge.area_name, badge.level_code)}</span>
              <span className="flex-1 text-sm font-medium text-slate-700 text-left">{badge.badge_name}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selected.includes(badge.id) ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                {selected.includes(badge.id) && <span className="text-white text-xs">✓</span>}
              </div>
            </button>
          ))}
        </div>

        <h4 className="text-slate-700 mb-2">Preview</h4>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500">{user.area} · Softinsa</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {selectedBadges.map((b) => (
              <span key={b.id} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-200">
                {getBadgeIcon(b.area_name, b.level_code)} {b.badge_name}
              </span>
            ))}
          </div>
        </div>

        <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          {copied ? "✓ Copiado!" : "Copiar Assinatura HTML"}
        </button>
      </div>
    </div>
  );
}
