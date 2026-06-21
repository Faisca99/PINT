"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@/lib/user-context";
import { motion } from "framer-motion";
import {
  BarChart3, RefreshCw, AlertCircle, Download, Filter,
  CheckCircle2, XCircle, Clock, Users, Award, TrendingUp, Layers,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";

interface ReportRow {
  id: number;
  status: string;
  final_result: string | null;
  created_at: string;
  submitted_at: string | null;
  closed_at: string | null;
  applicant_name: string;
  applicant_email: string;
  badge_name: string;
  badge_type: string;
  points: number;
  level_code: string | null;
  area_name: string | null;
  service_line_name: string | null;
}

interface Summary {
  pending_tm: number;
  pending_sll: number;
  approved: number;
  rejected: number;
  total: number;
}

interface MonthlyRow { month: string; approved: number; total: number; }
interface LpRow { learning_path: string; approved_count: number; }
interface LevelRow { level_code: string; level_name: string; approved_count: number; }
interface UsersKpi { total: number; consultants: number; talent_managers: number; service_line_leaders: number; admins: number; }
interface Kpis { monthly: MonthlyRow[]; by_learning_path: LpRow[]; by_level: LevelRow[]; users: UsersKpi; }

const STATUS_LABELS: Record<string, string> = {
  open: "Em Aberto", submitted: "Submetida",
  in_validation: "Em Validação", closed: "Fechada",
};

const LEVEL_LABELS: Record<string, string> = {
  A: "Júnior", B: "Intermédio", C: "Sénior", D: "Especialista", E: "Líder de Conhecimento",
};

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-500", B: "bg-blue-500", C: "bg-yellow-500", D: "bg-purple-500", E: "bg-red-500",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function RelatoriosPage() {
  const { user } = useUser();
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)), [rows.length]);
  const paginated  = useMemo(() => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [rows, page]);

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterFrom) params.set("from", filterFrom);
      if (filterTo) params.set("to", filterTo);
      // SLL só vê dados da sua service line
      if (user?.role === "service_line_leader" && user.serviceLine) {
        params.set("service_line", user.serviceLine);
      }
      const [rowsRes, summaryRes] = await Promise.all([
        api.get(`/reports/applications?${params}`),
        api.get("/reports/summary"),
      ]);
      setRows(rowsRes.data ?? []);
      setSummary(summaryRes.data);
    } catch {
      setError("Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchRows();
    Promise.all([
      api.get("/reports/kpis"),
      api.get("/reports/badges"),
    ]).then(([kpisRes, badgesRes]) => {
      setKpis(kpisRes.data);
      setAllBadges(badgesRes.data ?? []);
    }).finally(() => setKpisLoading(false));
  }, []);

  const toRow = (r: ReportRow) => ({
    "ID": r.id, "Consultor": r.applicant_name, "Email": r.applicant_email,
    "Badge": r.badge_name, "Nível": r.level_code ?? "", "Área": r.area_name ?? "",
    "Service Line": r.service_line_name ?? "", "Pontos": r.points,
    "Estado": STATUS_LABELS[r.status] ?? r.status, "Resultado": r.final_result ?? "",
    "Criada em": r.created_at ? new Date(r.created_at).toLocaleDateString("pt-PT") : "",
    "Submetida em": r.submitted_at ? new Date(r.submitted_at).toLocaleDateString("pt-PT") : "",
    "Fechada em": r.closed_at ? new Date(r.closed_at).toLocaleDateString("pt-PT") : "",
  });

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.map(toRow)), "Candidaturas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.filter((r) => r.final_result === "approved").map(toRow)), "Aprovações");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.filter((r) => r.final_result === "rejected").map(toRow)), "Rejeições");
    if (kpis?.monthly.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpis.monthly.map((m) => ({
        "Mês": m.month, "Aprovadas": Number(m.approved), "Total": Number(m.total),
        "% Aprovação": m.total > 0 ? `${Math.round((Number(m.approved) / Number(m.total)) * 100)}%` : "0%",
      }))), "Por Mês");
    }
    if (kpis?.by_level.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpis.by_level.map((l) => ({
        "Código": l.level_code, "Nível": l.level_name, "Badges Aprovados": Number(l.approved_count),
      }))), "Por Nível");
    }
    if (kpis?.by_learning_path.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpis.by_learning_path.map((l) => ({
        "Learning Path": l.learning_path, "Badges Aprovados": Number(l.approved_count),
      }))), "Por Learning Path");
    }
    if (allBadges.length) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(allBadges.map((b) => ({
        "Código": b.code, "Nome": b.name, "Tipo": b.badge_type,
        "Nível": b.level_code ?? "", "Área": b.area_name ?? "",
        "Service Line": b.service_line_name ?? "", "Learning Path": b.learning_path ?? "",
        "Pontos": b.points, "Tem Expiração": b.has_expiration ? "Sim" : "Não",
        "Validade (dias)": b.valid_days ?? "",
        "Total Atribuídos": Number(b.total_awarded),
        "Ativo": b.is_active ? "Sim" : "Não",
      }))), "Badges");
    }
    XLSX.writeFile(wb, `relatorio_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const maxMonthly = kpis?.monthly.length
    ? Math.max(...kpis.monthly.map((m) => Number(m.total)), 1)
    : 1;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-accent" />
                Relatórios & Estatísticas
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                KPIs da plataforma de badges
                {user?.role === "service_line_leader" && user.serviceLine && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {user.serviceLine}
                  </span>
                )}
              </p>
            </div>
            <Button onClick={exportExcel} disabled={loading || rows.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </motion.div>

        {/* KPIs — utilizadores */}
        {!kpisLoading && kpis?.users && (
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Total Utilizadores", value: kpis.users.total, icon: Users, color: "text-primary" },
                { label: "Consultores", value: kpis.users.consultants, icon: Users, color: "text-blue-600" },
                { label: "Talent Managers", value: kpis.users.talent_managers, icon: Users, color: "text-amber-600" },
                { label: "Service Line Leaders", value: kpis.users.service_line_leaders, icon: Users, color: "text-purple-600" },
                { label: "Administradores", value: kpis.users.admins, icon: Users, color: "text-gray-600" },
              ].map((s) => (
                <Card key={s.label} className="border border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resumo candidaturas */}
        {summary && (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Candidaturas", value: summary.total, icon: BarChart3, color: "bg-slate-500/10 text-slate-600" },
                { label: "Pend. Talent Manager", value: summary.pending_tm, icon: Clock, color: "bg-amber-500/10 text-amber-600" },
                { label: "Aprovadas", value: summary.approved, icon: CheckCircle2, color: "bg-green-500/10 text-green-600" },
                { label: "Rejeitadas", value: summary.rejected, icon: XCircle, color: "bg-red-500/10 text-red-600" },
              ].map((s) => (
                <Card key={s.label} className="border border-border shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico mensal */}
          <motion.div className="lg:col-span-2" {...fadeIn} transition={{ delay: 0.2 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  Badges Aprovados por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kpisLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : !kpis?.monthly.length ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Sem dados mensais ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {kpis.monthly.map((m) => {
                      const pct = Math.round((Number(m.approved) / Number(m.total)) * 100);
                      const barW = Math.round((Number(m.total) / maxMonthly) * 100);
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-16 shrink-0">{m.month}</span>
                          <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                            <div
                              className="h-full bg-primary/20 rounded-full"
                              style={{ width: `${barW}%` }}
                            />
                            <div
                              className="h-full bg-primary rounded-full absolute top-0 left-0"
                              style={{ width: `${Math.round((Number(m.approved) / maxMonthly) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">
                            {m.approved}/{m.total} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1 align-middle" />aprovadas
                      <span className="inline-block w-3 h-3 rounded-full bg-primary/20 ml-3 mr-1 align-middle" />total
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Por nível */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  Badges por Nível
                </CardTitle>
              </CardHeader>
              <CardContent>
                {kpisLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : !kpis?.by_level.length ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Sem dados.</div>
                ) : (
                  <div className="space-y-3">
                    {kpis.by_level.map((l) => {
                      const maxL = Math.max(...kpis.by_level.map((x) => Number(x.approved_count)), 1);
                      const pct = Math.round((Number(l.approved_count) / maxL) * 100);
                      const dot = LEVEL_COLORS[l.level_code] ?? "bg-gray-400";
                      return (
                        <div key={l.level_code}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${dot}`} />
                              <span className="text-xs font-medium text-foreground">
                                {l.level_code} — {LEVEL_LABELS[l.level_code] ?? l.level_name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-foreground">{l.approved_count}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${dot} rounded-full`} style={{ width: `${pct}%` }} />
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

        {/* Por Learning Path */}
        {!kpisLoading && kpis?.by_learning_path.length ? (
          <motion.div {...fadeIn} transition={{ delay: 0.28 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  Badges Aprovados por Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kpis.by_learning_path.map((lp) => (
                    <div key={lp.learning_path} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{lp.learning_path}</div>
                        <div className="text-xs text-muted-foreground">{lp.approved_count} badges aprovados</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {/* Filtros */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Todos os estados</option>
                  <option value="open">Em Aberto</option>
                  <option value="submitted">Submetidas</option>
                  <option value="in_validation">Em Validação</option>
                  <option value="closed">Fechadas</option>
                </select>
                <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <span className="text-xs text-muted-foreground">até</span>
                <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <Button size="sm" onClick={() => { setPage(1); fetchRows(); }} disabled={loading} className="gap-2">
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  Filtrar
                </Button>
                {(filterStatus || filterFrom || filterTo) && (
                  <Button size="sm" variant="ghost" onClick={() => { setFilterStatus(""); setFilterFrom(""); setFilterTo(""); }}>
                    Limpar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabela de candidaturas */}
        <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {loading ? "A carregar..." : (
                  <>
                    {rows.length} candidatura{rows.length !== 1 ? "s" : ""}
                    {rows.length > PAGE_SIZE && (
                      <span className="text-muted-foreground font-normal text-sm ml-2">
                        · página {page} de {Math.ceil(rows.length / PAGE_SIZE)}
                      </span>
                    )}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  A carregar dados...
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : rows.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum resultado para os filtros selecionados.</p>
                </div>
              ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            {["Consultor", "Badge", "Nível", "Área", "Estado", "Data"].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {paginated.map((row) => {
                            const isClosed = row.status === "closed";
                            return (
                              <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="font-medium text-foreground">{row.applicant_name}</div>
                                  <div className="text-xs text-muted-foreground">{row.applicant_email}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-foreground">{row.badge_name}</div>
                                  {row.points > 0 && <div className="text-xs text-yellow-600">+{row.points} pts</div>}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{row.level_code ?? "—"}</td>
                                <td className="px-4 py-3 text-muted-foreground">{row.area_name ?? "—"}</td>
                                <td className="px-4 py-3">
                                  {isClosed ? (
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${row.final_result === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                      {row.final_result === "approved" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                      {row.final_result === "approved" ? "Aprovada" : "Rejeitada"}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">{STATUS_LABELS[row.status]}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                  {row.submitted_at
                                    ? new Date(row.submitted_at).toLocaleDateString("pt-PT")
                                    : new Date(row.created_at).toLocaleDateString("pt-PT")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          Página {page} de {totalPages} · {rows.length} resultados
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === 1} onClick={() => setPage(1)}>«</button>
                          <button className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
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
                                <button key={p}
                                  onClick={() => setPage(p as number)}
                                  className={`h-8 w-8 flex items-center justify-center rounded text-xs border transition-colors ${page === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                                  {p}
                                </button>
                              )
                            )}
                          <button className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                        </div>
                      </div>
                    )}
                  </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
