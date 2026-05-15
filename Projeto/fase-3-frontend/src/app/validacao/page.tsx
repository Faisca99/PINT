"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Inbox, Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  Filter, RefreshCw, AlertCircle, Search,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface ApplicationRow {
  id: number;
  applicant_name: string;
  badge_name: string;
  level_code: string | null;
  area_name: string | null;
  service_line_name: string | null;
  status: string;
  final_result: string | null;
  submitted_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  submitted:     { label: "Submetida",    color: "bg-amber-100 text-amber-700 border-amber-200",  icon: Clock },
  in_validation: { label: "Em Validação", color: "bg-blue-100 text-blue-700 border-blue-200",     icon: AlertCircle },
  closed:        { label: "Fechada",      color: "bg-gray-100 text-gray-600 border-gray-200",     icon: CheckCircle2 },
  open:          { label: "Em Aberto",    color: "bg-slate-100 text-slate-600 border-slate-200",  icon: Clock },
};

const PAGE_SIZE = 10;
const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ValidacaoInboxPage() {
  const { user } = useUser();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch {
      setError("Não foi possível carregar as candidaturas. Verifica se o backend está a correr.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);
  useEffect(() => { setPage(1); }, [filterStatus, search]);

  if (!user) return null;

  // Filtrar por role + status + SL + pesquisa
  const filtered = useMemo(() => applications.filter((app) => {
    if (user.role === "talent_manager") {
      if (!["submitted", "in_validation", "closed"].includes(app.status)) return false;
    } else if (user.role === "service_line_leader") {
      if (!["in_validation", "closed"].includes(app.status)) return false;
      if (user.serviceLine && app.service_line_name && app.service_line_name !== user.serviceLine) return false;
    }
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return app.applicant_name.toLowerCase().includes(q) || app.badge_name.toLowerCase().includes(q);
    }
    return true;
  }), [applications, user, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingCount = useMemo(() => applications.filter((a) => {
    if (user.role === "talent_manager") return a.status === "submitted";
    if (user.role === "service_line_leader") {
      const matchSL = !user.serviceLine || !a.service_line_name || a.service_line_name === user.serviceLine;
      return a.status === "in_validation" && matchSL;
    }
    return false;
  }).length, [applications, user]);

  const statusFilters = user.role === "talent_manager"
    ? [{ key: "all", label: "Todas" }, { key: "submitted", label: "Submetidas" }, { key: "in_validation", label: "Em Validação" }, { key: "closed", label: "Fechadas" }]
    : [{ key: "all", label: "Todas" }, { key: "in_validation", label: "Em Validação" }, { key: "closed", label: "Fechadas" }];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Inbox className="h-6 w-6 text-accent" />
                Caixa de Entrada
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {user.role === "talent_manager"
                  ? "Candidaturas submetidas pelos consultores para revisão"
                  : "Candidaturas enviadas pelo Talent Manager para validação final"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Clock,         color: "bg-amber-500/10 text-amber-600", value: pendingCount, label: "Pendentes" },
              { icon: CheckCircle2,  color: "bg-green-500/10 text-green-600",  value: applications.filter((a) => a.status === "closed" && a.final_result === "approved").length, label: "Aprovadas" },
              { icon: XCircle,       color: "bg-red-500/10 text-red-600",      value: applications.filter((a) => a.status === "closed" && a.final_result === "rejected").length, label: "Rejeitadas" },
            ].map((s) => (
              <Card key={s.label} className="border border-border shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Filtros + pesquisa */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Pesquisa */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar consultor ou badge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {/* Pills de status */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    filterStatus === f.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lista */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {loading ? "A carregar..." : (
                  <>
                    {filtered.length} candidatura{filtered.length !== 1 ? "s" : ""}
                    {filtered.length !== applications.filter((a) =>
                      user.role === "talent_manager"
                        ? ["submitted","in_validation","closed"].includes(a.status)
                        : ["in_validation","closed"].includes(a.status)
                    ).length && (
                      <span className="text-muted-foreground font-normal text-sm ml-1">(filtradas)</span>
                    )}
                    {filtered.length > PAGE_SIZE && (
                      <span className="text-muted-foreground font-normal text-sm ml-2">
                        · página {page} de {totalPages}
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
                  A carregar candidaturas...
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma candidatura encontrada para este filtro.</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-border">
                    {paginated.map((app) => {
                      const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.open;
                      const StatusIcon = statusCfg.icon;
                      return (
                        <div key={app.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {app.applicant_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{app.applicant_name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {app.badge_name}
                                {app.area_name && <span className="ml-1 opacity-60">· {app.area_name}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusCfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:block w-20 text-right">
                              {app.submitted_at
                                ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                                : new Date(app.created_at).toLocaleDateString("pt-PT")}
                            </span>
                            <Link href={`/validacao/${app.id}`}>
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                                Rever <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Página {page} de {totalPages} · {filtered.length} resultados
                      </span>
                      <div className="flex items-center gap-1">
                        <button disabled={page === 1} onClick={() => setPage(1)}
                          className="h-8 w-8 flex items-center justify-center rounded border border-border text-xs text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">«</button>
                        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                          className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
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
                              <button key={p} onClick={() => setPage(p as number)}
                                className={`h-8 w-8 flex items-center justify-center rounded text-xs border transition-colors ${page === p ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                                {p}
                              </button>
                            )
                          )}
                        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                          className="h-8 w-8 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button disabled={page === totalPages} onClick={() => setPage(totalPages)}
                          className="h-8 w-8 flex items-center justify-center rounded border border-border text-xs text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">»</button>
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
