import { useState, useEffect, useMemo } from "react";
import { Award, Bell, Zap, ChevronRight } from "lucide-react";
import { useApp, useRequireUser } from "../../context/AppContext";
import { DashboardHeader } from "../shared/AppHeader";
import { ConsultorBottomNav } from "../shared/BottomNav";
import { LevelChip, StatusChip } from "../shared/StatusChip";
import {
  getDashboard, getMyBadges, getRecommendations, getNotifications,
  type MyBadge, type Recommendation, type ApiNotification, type DashboardData,
} from "../../services/meService";
import { getBadges, type ApiBadge } from "../../services/badgeService";
import { getBadgeIcon, getBadgeColor, formatDate, isExpiringSoon, LEVEL_NAMES } from "../../lib/badgeUtils";
import { getMyApplications, type ApiApplicationSummary } from "../../services/applicationService";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

function computeGreeting(lastLoginAt: string | null, loginAt: string, lang: string): string {
  const hour = new Date().getHours();
  const g = lang === "en"
    ? ["Good morning", "Good afternoon", "Good evening"]
    : lang === "es"
    ? ["Buenos días", "Buenas tardes", "Buenas noches"]
    : ["Bom dia", "Boa tarde", "Boa noite"];

  const welcome = lang === "en" ? "Welcome!" : lang === "es" ? "¡Bienvenido!" : "Bem-vindo!";
  const welcomeBack = lang === "en" ? "Welcome back" : lang === "es" ? "Bienvenido de nuevo" : "Seja bem-vindo novamente";

  if (!lastLoginAt) return welcome;

  const daysSince = (new Date(loginAt).getTime() - new Date(lastLoginAt).getTime()) / 86400000;
  if (daysSince > 15) return welcomeBack;

  return hour < 12 ? g[0] : hour < 18 ? g[1] : g[2];
}

export function ConsultorDashboard() {
  const { navigate, lang, updateUserStats, setNotifCount } = useApp();
  const user = useRequireUser();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [myBadges, setMyBadges] = useState<MyBadge[]>([]);
  const [allBadges, setAllBadges] = useState<ApiBadge[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [applications, setApplications] = useState<ApiApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, badges, badgeCatalog, recs, notifs, apps] = await Promise.all([
          getDashboard(),
          getMyBadges(),
          getBadges(),
          getRecommendations(),
          getNotifications(),
          getMyApplications(),
        ]);
        setDashboard(dash);
        setMyBadges(badges);
        setAllBadges(badgeCatalog);
        setRecommendations(recs);
        setNotifications(notifs);
        setApplications(apps);
        const unreadCount = notifs.filter((n) => !n.is_read).length;
        setNotifCount(unreadCount);
        updateUserStats(dash.points, dash.badge_count, 0);
      } catch {
        // silent — show whatever is loaded
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const greeting = computeGreeting(user.lastLoginAt, user.loginAt, lang);

  const expiringBadges = useMemo(() => myBadges.filter((b) => isExpiringSoon(b.expires_at, 30)), [myBadges]);

  const unreadNotifs = useMemo(() => notifications.filter((n) => !n.is_read), [notifications]);

  const recentApps = useMemo(() => applications.slice(0, 2), [applications]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentYear = new Date().getFullYear();
    const counts: Record<string, number> = {};
    myBadges.forEach((b) => {
      const d = new Date(b.awarded_at);
      if (d.getFullYear() === currentYear) {
        const m = months[d.getMonth()];
        counts[m] = (counts[m] ?? 0) + 1;
      }
    });
    return months.slice(0, new Date().getMonth() + 1).map((m) => ({ month: m, v: counts[m] ?? 0 }));
  }, [myBadges]);

  const learningPaths = useMemo(() => {
    const paths: Record<string, { total: number; done: number; color: string }> = {};
    const colors: Record<string, string> = { LowCode: "#0bacda", "DevSecOps & IT Automation": "#2d9d6e", "Talent Management": "#8b5cf6" };
    allBadges.forEach((b) => {
      const lp = b.learning_path_name || b.area_name;
      if (!paths[lp]) paths[lp] = { total: 0, done: 0, color: colors[b.area_name] ?? "#1a3a6b" };
      paths[lp].total += 1;
    });
    myBadges.forEach((b) => {
      const match = allBadges.find((ab) => ab.id === b.badge_id);
      if (match) {
        const lp = match.learning_path_name || match.area_name;
        if (paths[lp]) paths[lp].done += 1;
      }
    });
    return Object.entries(paths).slice(0, 3).map(([name, data]) => ({
      name,
      ...data,
      progress: data.total > 0 ? Math.round((data.done / data.total) * 100) : 0,
    }));
  }, [allBadges, myBadges]);

  const inProgressCount = useMemo(
    () => applications.filter((a) => ["open", "submitted", "em-validacao", "devolvido"].includes(a.status)).length,
    [applications]
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-slate-100" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">A carregar...</p>
          </div>
        </div>
        <ConsultorBottomNav />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <DashboardHeader
        greeting={greeting}
        name={user.name}
        area={user.area}
        avatar={user.avatar}
        level={user.level ? LEVEL_NAMES[user.level] : undefined}
      />

      <div className="flex-1 overflow-y-auto pb-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {[
            { label: "Badges Obtidos", value: dashboard?.badge_count ?? myBadges.length, icon: "🏅", screen: "c-my-badges" as const },
            { label: "Em Progresso", value: inProgressCount, icon: "📋", screen: "c-applications" as const },
            { label: "Pontos Totais", value: (dashboard?.points ?? 0).toLocaleString("pt-PT"), icon: "⭐", screen: "c-leaderboard" as const },
            { label: "Objetivos", value: dashboard?.objectives ?? 0, icon: "🎯", screen: "c-applications" as const },
          ].map((card) => (
            <button key={card.label} onClick={() => navigate(card.screen)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-95 transition-transform">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{card.icon}</span>
                <ChevronRight size={14} className="text-slate-300 mt-1" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Learning Paths */}
        {learningPaths.length > 0 && (
          <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800">Learning Paths</h4>
              <button onClick={() => navigate("c-badges")} className="text-xs text-blue-600 font-medium">Ver todos</button>
            </div>
            {learningPaths.map((lp) => (
              <div key={lp.name} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-700 truncate mr-2">{lp.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{lp.done}/{lp.total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${lp.progress}%`, background: lp.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured journey */}
        {myBadges.length > 0 && (() => {
          const topArea = myBadges[0];
          return (
            <div className="mx-4 rounded-2xl p-4 mb-3 text-white"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} className="text-yellow-300" />
                    <span className="text-xs text-blue-200 font-medium uppercase tracking-wider">Última conquista</span>
                  </div>
                  <p className="font-semibold text-sm mb-1">{topArea.badge_name}</p>
                  <p className="text-blue-200 text-xs">{formatDate(topArea.awarded_at)} · +{topArea.points_awarded} pts</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
                  {getBadgeIcon(topArea.area_name, topArea.level_code)}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Monthly chart */}
        {monthlyData.length > 0 && (
          <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
            <h4 className="text-slate-800 mb-3">Badges obtidos este ano</h4>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={i === monthlyData.length - 1 ? "#0066cc" : "#e2e8f0"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800">Próximos sugeridos</h4>
              <button onClick={() => navigate("c-recommendations")} className="text-xs text-blue-600 font-medium">Ver mais</button>
            </div>
            {recommendations.slice(0, 2).map((rec) => (
              <button key={rec.id} onClick={() => navigate("c-badge-detail", { badgeId: rec.id })}
                className="flex items-center gap-3 w-full py-2 hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${getBadgeColor(rec.level_code)}22` }}>
                  {getBadgeIcon(rec.area_name, rec.level_code)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{rec.badge_name}</p>
                  <p className="text-xs text-slate-500">{rec.area_name} · {rec.points} pts</p>
                </div>
                <LevelChip level={rec.level_code} size="sm" />
              </button>
            ))}
          </div>
        )}

        {/* Recent applications */}
        {recentApps.length > 0 && (
          <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800">Candidaturas recentes</h4>
              <button onClick={() => navigate("c-applications")} className="text-xs text-blue-600 font-medium">Ver todas</button>
            </div>
            {recentApps.map((app) => (
              <button key={app.id} onClick={() => navigate("c-application-detail", { appId: app.id })}
                className="flex items-center gap-3 w-full py-2 hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0066cc22" }}>
                  <Award size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-medium text-slate-700 truncate">{app.badge_name}</p>
                  <p className="text-xs text-slate-500">{formatDate(app.created_at)}</p>
                </div>
                <StatusChip status={app.status} size="sm" />
              </button>
            ))}
          </div>
        )}

        {/* Expiring badges alert */}
        {expiringBadges.length > 0 && (
          <div className="mx-4 bg-red-50 rounded-2xl p-4 border border-red-100 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">⏰</span>
              <span className="text-sm font-semibold text-red-800">
                {expiringBadges.length} badge{expiringBadges.length > 1 ? "s" : ""} a expirar em breve
              </span>
            </div>
            {expiringBadges.slice(0, 2).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-1">
                <span className="text-xs text-red-700">{b.badge_name}</span>
                <span className="text-xs text-red-500 font-medium">até {formatDate(b.expires_at)}</span>
              </div>
            ))}
            <button onClick={() => navigate("c-my-badges")} className="mt-2 text-xs text-red-700 font-semibold">
              Ver meus badges →
            </button>
          </div>
        )}

        {/* Unread notifications */}
        {unreadNotifs.length > 0 && (
          <div className="mx-4 bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={14} className="text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {unreadNotifs.length} notificação{unreadNotifs.length > 1 ? "ões" : ""} por ler
              </span>
            </div>
            <p className="text-xs text-amber-700">{unreadNotifs[0].message}</p>
            <button onClick={() => navigate("c-notifications")} className="mt-2 text-xs text-amber-700 font-semibold">
              Ver todas →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="px-4">
          <button onClick={() => navigate("c-badges")}
            className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            <Award size={18} />
            Explorar Badges
          </button>
        </div>
      </div>

      <ConsultorBottomNav />
    </div>
  );
}
