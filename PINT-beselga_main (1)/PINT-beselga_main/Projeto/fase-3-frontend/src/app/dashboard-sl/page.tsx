"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Award, Clock, CheckCircle2,
  RefreshCw, Zap, ChevronRight, ChevronLeft, Search, Filter, BarChart2,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { PAGE_SIZE } from "@/lib/constants";
import { getGreeting } from "@/lib/greeting";
import { t, formatDate } from "@/lib/i18n";

interface UserRow {
  id: number; full_name: string; email: string;
  area_name: string | null; service_line_name: string | null;
  badge_count: number; total_points: number;
}

interface ReportRow {
  id: number; status: string; final_result: string | null;
  applicant_name: string; badge_name: string;
  area_name: string | null; service_line_name: string | null;
  level_code: string | null;
  submitted_at: string | null; created_at: string;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function DashboardSLPage() {
  const { user } = useUser();
  const [consultants, setConsultants] = useState<UserRow[]>([]);
  const [applications, setApplications] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros candidaturas
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    Promise.all([api.get("/users"), api.get("/applications")])
      .then(([usersRes, appsRes]) => {
        const allUsers: UserRow[] = usersRes.data ?? [];
        const allApps: ReportRow[] = appsRes.data ?? [];
        const myLine = user.serviceLine;

        setConsultants(myLine ? allUsers.filter((u) => u.service_line_name === myLine) : allUsers);

        const pending = allApps.filter((a) => {
          if (a.status !== "in_validation") return false;
          if (myLine && a.service_line_name && a.service_line_name !== myLine) return false;
          return true;
        });
        setApplications(pending);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Áreas únicas das candidaturas
  const areas = useMemo(() =>
    Array.from(new Set(applications.map((a) => a.area_name).filter(Boolean))),
    [applications]
  );

  // Candidaturas filtradas
  const filtered = useMemo(() => applications.filter((a) => {
    const matchSearch = !search ||
      a.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      a.badge_name.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === "all" || a.area_name === filterArea;
    return matchSearch && matchArea;
  }), [applications, search, filterArea]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterArea]);

  const totalBadges = consultants.reduce((s, c) => s + Number(c.badge_count), 0);
  const totalPoints = consultants.reduce((s, c) => s + Number(c.total_points), 0);

  return (
    <AppLayout>
      {!user ? null : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-accent" />
              {`${getGreeting(user, user.lastLoginAt)}, ${user.name.split(" ")[0]}! 👋`}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {user.serviceLine ?? t("dashboard.sl.allLines")} {t("dashboard.sl.teamProgress")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Consultores",          value: consultants.length,   icon: Users,         color: "bg-primary/10 text-primary" },
                { label: "Badges Atribuídos",    value: totalBadges,          icon: Award,         color: "bg-green-500/10 text-green-600" },
                { label: "Aguardam Validação",   value: applications.length,  icon: Clock,         color: "bg-amber-500/10 text-amber-600" },
                { label: "Pontos Totais",        value: totalPoints,          icon: Zap,           color: "bg-yellow-500/10 text-yellow-600" },
              ].map((s, i) => (
                <motion.div key={s.label} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Card className="border border-border shadow-card">
                    <CardContent className="p-5">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : s.value}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Candidaturas a aguardar validação — com filtro e paginação */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    A aguardar validação
                    {!loading && (
                      <span className="text-xs text-muted-foreground font-normal">
                        ({filtered.length}{filtered.length !== applications.length ? ` de ${applications.length}` : ""})
                      </span>
                    )}
                  </CardTitle>
                  <Link href="/validacao">
                    <Button variant="ghost" size="sm" className="text-accent text-xs">
                      Ver inbox <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                {/* Filtros */}
                {!loading && applications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="relative flex-1 min-w-[160px]">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Consultor ou badge..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    {areas.length > 1 && (
                      <select
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="all">Todas as áreas</option>
                        {areas.map((a) => <option key={a} value={a!}>{a}</option>)}
                      </select>
                    )}
                    {(search || filterArea !== "all") && (
                      <button
                        onClick={() => { setSearch(""); setFilterArea("all"); }}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 transition-colors"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground px-4">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">
                      {applications.length === 0
                        ? "Nenhuma candidatura pendente."
                        : "Nenhum resultado para os filtros selecionados."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border">
                      {paginated.map((app) => (
                        <Link key={app.id} href={`/validacao/${app.id}`}>
                          <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-amber-700">
                                  {app.applicant_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                  {app.applicant_name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {app.badge_name}
                                  {app.area_name && <span className="ml-1 opacity-60">· {app.area_name}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 ml-3 shrink-0">
                              <span className="text-xs text-muted-foreground hidden sm:block">
                                {formatDate(app.submitted_at ?? app.created_at)}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Página {page} de {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="h-7 w-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((p, i) =>
                              p === "..." ? (
                                <span key={`e${i}`} className="px-1 text-xs text-muted-foreground">…</span>
                              ) : (
                                <button key={p} onClick={() => setPage(p as number)}
                                  className={`h-7 w-7 flex items-center justify-center rounded text-xs border transition-colors ${page === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                                  {p}
                                </button>
                              )
                            )}
                          <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-7 w-7 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Métricas de comparação — B-SLL-1 */}
          {!loading && consultants.length > 0 && (
            <motion.div {...fadeIn} transition={{ delay: 0.28 }}>
              <Card className="border border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-accent" />
                    Comparação de Consultores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Badges */}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Badges obtidos</p>
                  <div className="space-y-2 mb-5">
                    {[...consultants]
                      .sort((a, b) => Number(b.badge_count) - Number(a.badge_count))
                      .slice(0, 8)
                      .map((c) => {
                        const max = Math.max(...consultants.map((x) => Number(x.badge_count)), 1);
                        const pct = Math.round((Number(c.badge_count) / max) * 100);
                        return (
                          <div key={c.id} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-24 truncate shrink-0">{c.full_name.split(" ")[0]}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-foreground w-6 text-right shrink-0">{c.badge_count}</span>
                          </div>
                        );
                      })}
                  </div>
                  {/* Pontos */}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pontos totais</p>
                  <div className="space-y-2">
                    {[...consultants]
                      .sort((a, b) => Number(b.total_points) - Number(a.total_points))
                      .slice(0, 8)
                      .map((c) => {
                        const max = Math.max(...consultants.map((x) => Number(x.total_points)), 1);
                        const pct = Math.round((Number(c.total_points) / max) * 100);
                        return (
                          <div key={c.id} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-24 truncate shrink-0">{c.full_name.split(" ")[0]}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-yellow-600 w-10 text-right shrink-0">{c.total_points}</span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Top consultores */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Top Consultores
                  </CardTitle>
                  <Link href="/utilizadores">
                    <Button variant="ghost" size="sm" className="text-accent text-xs">
                      Ver todos <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                  </div>
                ) : consultants.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Sem consultores na tua service line.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...consultants]
                      .sort((a, b) => Number(b.badge_count) - Number(a.badge_count))
                      .slice(0, 8)
                      .map((c, i) => (
                        <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/20 transition-colors">
                          <span className="text-xs font-bold text-muted-foreground w-5 shrink-0 text-center">#{i + 1}</span>
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {c.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{c.full_name}</div>
                            <div className="text-xs text-muted-foreground">{c.area_name ?? "—"}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-foreground">
                              {c.badge_count} <span className="text-xs font-normal text-muted-foreground">badges</span>
                            </div>
                            <div className="text-xs text-yellow-600">⚡ {c.total_points} pts</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
