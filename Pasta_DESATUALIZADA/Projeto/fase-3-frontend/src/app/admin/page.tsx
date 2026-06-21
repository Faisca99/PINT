"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Award, Send, CheckCircle2, XCircle, Clock,
  RefreshCw, ChevronRight, BarChart3, Layers, ShieldCheck,
  Bell, TrendingUp, Zap, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Summary { pending_tm: number; pending_sll: number; approved: number; rejected: number; total: number; }
interface UsersKpi { total: number; consultants: number; talent_managers: number; service_line_leaders: number; admins: number; }
interface LevelRow  { level_code: string; level_name: string; approved_count: number; }
interface MonthRow  { month: string; approved: number; total: number; }
interface RecentApp { id: number; applicant_name: string; badge_name: string; status: string; final_result: string | null; submitted_at: string | null; created_at: string; }

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const STATUS_COLOR: Record<string, string> = {
  submitted:     "bg-amber-100 text-amber-700",
  in_validation: "bg-blue-100 text-blue-700",
  closed:        "bg-green-100 text-green-700",
};

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-500", B: "bg-blue-500", C: "bg-yellow-500", D: "bg-purple-500", E: "bg-red-500",
};

export default function AdminDashboardPage() {
  const [summary, setSummary]   = useState<Summary | null>(null);
  const [usersKpi, setUsersKpi] = useState<UsersKpi | null>(null);
  const [levels, setLevels]     = useState<LevelRow[]>([]);
  const [monthly, setMonthly]   = useState<MonthRow[]>([]);
  const [recent, setRecent]     = useState<RecentApp[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/reports/summary"),
      api.get("/reports/kpis"),
      api.get("/reports/applications"),
      api.get("/admin/badges"),
    ])
      .then(([sRes, kRes, aRes, bRes]) => {
        setSummary(sRes.data);
        setUsersKpi(kRes.data?.users ?? null);
        setLevels(kRes.data?.by_level ?? []);
        setMonthly((kRes.data?.monthly ?? []).slice(-6));
        setRecent((aRes.data ?? []).slice(0, 8));
        setBadgeCount((bRes.data ?? []).filter((b: any) => b.is_active).length);
      })
      .finally(() => setLoading(false));
  }, []);

  const maxMonthly = monthly.length ? Math.max(...monthly.map((m) => Number(m.total)), 1) : 1;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Dashboard — Administrador
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Visão global da plataforma Softinsa Badges
          </p>
        </motion.div>

        {/* Stats principais */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Utilizadores",       value: usersKpi?.total ?? "—",      icon: Users,        color: "bg-primary/10 text-primary",          link: "/admin/utilizadores" },
              { label: "Badges Ativos",       value: badgeCount,                  icon: Award,        color: "bg-green-500/10 text-green-600",       link: "/admin/badges" },
              { label: "Total Candidaturas",  value: summary?.total ?? "—",       icon: Send,         color: "bg-blue-500/10 text-blue-600",         link: "/relatorios" },
              { label: "Aguardam Revisão",    value: (summary?.pending_tm ?? 0) + (summary?.pending_sll ?? 0), icon: Clock, color: "bg-amber-500/10 text-amber-600", link: "/relatorios" },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link href={s.link}>
                  <Card className="border border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : s.value}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                        {s.label}
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats utilizadores por role */}
        {usersKpi && (
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" /> Utilizadores por Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Consultores",       value: usersKpi.consultants,          color: "text-blue-600",   bg: "bg-blue-50" },
                    { label: "Talent Managers",   value: usersKpi.talent_managers,      color: "text-amber-600",  bg: "bg-amber-50" },
                    { label: "Service Line Leaders", value: usersKpi.service_line_leaders, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Administradores",   value: usersKpi.admins,               color: "text-red-600",    bg: "bg-red-50" },
                  ].map((u) => (
                    <div key={u.label} className={`${u.bg} rounded-xl p-4 text-center`}>
                      <div className={`text-3xl font-bold ${u.color}`}>{u.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{u.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico mensal */}
          <motion.div className="lg:col-span-2" {...fadeIn} transition={{ delay: 0.25 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  Badges Aprovados — Últimos 6 Meses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : monthly.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sem dados mensais ainda.</div>
                ) : (
                  <div className="space-y-2.5">
                    {monthly.map((m) => {
                      const pct = Math.round((Number(m.approved) / Number(m.total)) * 100) || 0;
                      const barW = Math.round((Number(m.total) / maxMonthly) * 100);
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-14 shrink-0 font-mono">{m.month}</span>
                          <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden relative">
                            <div className="h-full bg-primary/15 rounded-lg" style={{ width: `${barW}%` }} />
                            <div className="h-full bg-primary rounded-lg absolute top-0 left-0 transition-all"
                              style={{ width: `${Math.round((Number(m.approved) / maxMonthly) * 100)}%` }} />
                          </div>
                          <div className="text-xs text-muted-foreground w-24 shrink-0 text-right">
                            <span className="font-semibold text-foreground">{m.approved}</span>/{m.total} ({pct}%)
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-primary" />aprovadas
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-primary/15" />total
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges por nível */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  Aprovados por Nível
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : levels.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sem dados.</div>
                ) : (
                  <div className="space-y-3">
                    {levels.map((l) => {
                      const maxL = Math.max(...levels.map((x) => Number(x.approved_count)), 1);
                      const pct = Math.round((Number(l.approved_count) / maxL) * 100);
                      return (
                        <div key={l.level_code}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${LEVEL_COLORS[l.level_code] ?? "bg-gray-400"}`} />
                              <span className="text-xs font-medium text-foreground">
                                {l.level_code} — {l.level_name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-foreground">{l.approved_count}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${LEVEL_COLORS[l.level_code] ?? "bg-gray-400"}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Estado das candidaturas + candidaturas recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estado */}
          <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Estado das Candidaturas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center h-24">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : summary ? [
                  { label: "Pendentes TM",    value: summary.pending_tm,  icon: Clock,         color: "bg-amber-500/10 text-amber-600",  bar: "bg-amber-400" },
                  { label: "Pendentes SLL",   value: summary.pending_sll, icon: AlertTriangle, color: "bg-blue-500/10 text-blue-600",    bar: "bg-blue-400" },
                  { label: "Aprovadas",        value: summary.approved,    icon: CheckCircle2,  color: "bg-green-500/10 text-green-600",  bar: "bg-green-400" },
                  { label: "Rejeitadas",       value: summary.rejected,    icon: XCircle,       color: "bg-red-500/10 text-red-600",      bar: "bg-red-400" },
                ].map((s) => {
                  const pct = summary.total > 0 ? Math.round((s.value / summary.total) * 100) : 0;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-muted-foreground">{s.label}</span>
                          <span className="text-xs font-bold text-foreground">{s.value}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                }) : null}
              </CardContent>
            </Card>
          </motion.div>

          {/* Candidaturas recentes */}
          <motion.div className="lg:col-span-2" {...fadeIn} transition={{ delay: 0.4 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="h-4 w-4 text-accent" />
                    Candidaturas Recentes
                  </CardTitle>
                  <Link href="/relatorios">
                    <Button variant="ghost" size="sm" className="text-accent text-xs">
                      Ver todas <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  </div>
                ) : recent.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">Sem candidaturas.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {recent.map((app) => {
                      const isClosed = app.status === "closed";
                      const statusLabel = isClosed
                        ? (app.final_result === "approved" ? "Aprovada" : "Rejeitada")
                        : app.status === "submitted" ? "Submetida" : "Em Validação";
                      const statusColor = isClosed
                        ? (app.final_result === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                        : STATUS_COLOR[app.status] ?? "bg-gray-100 text-gray-600";
                      return (
                        <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {app.applicant_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{app.applicant_name}</div>
                              <div className="text-xs text-muted-foreground truncate">{app.badge_name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-3 shrink-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                              {statusLabel}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:block">
                              {app.submitted_at
                                ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                                : new Date(app.created_at).toLocaleDateString("pt-PT")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Atalhos rápidos */}
        <motion.div {...fadeIn} transition={{ delay: 0.45 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Utilizadores",   icon: Users,       url: "/admin/utilizadores", color: "text-primary" },
                  { label: "Badges",          icon: Award,       url: "/admin/badges",       color: "text-green-600" },
                  { label: "Estrutura LP",    icon: Layers,      url: "/admin/estrutura",    color: "text-blue-600" },
                  { label: "Avisos",          icon: Bell,        url: "/admin/avisos",       color: "text-amber-600" },
                  { label: "Relatórios",      icon: BarChart3,   url: "/relatorios",         color: "text-purple-600" },
                  { label: "RGPD",            icon: ShieldCheck, url: "/admin/rgpd",         color: "text-red-600" },
                ].map((item) => (
                  <Link key={item.label} href={item.url}>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer group">
                      <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </AppLayout>
  );
}
