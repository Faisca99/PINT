"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Send, Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft,
  RefreshCw, AlertCircle, Inbox, PlusCircle, Search, Filter,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constants";
import { t, formatDate } from "@/lib/i18n";

interface MyApplication {
  id: number;
  badge_id: number;
  badge_name: string;
  level_code: string | null;
  level_name: string | null;
  area_name: string | null;
  status: string;
  final_result: string | null;
  created_at: string;
  submitted_at: string | null;
  closed_at: string | null;
}

const STATUS_CONFIG: Record<string, { labelKey: string; color: string; icon: any }> = {
  open:          { labelKey: "label.open",          color: "bg-slate-100 text-slate-600 border-slate-200", icon: Clock },
  submitted:     { labelKey: "label.submitted",     color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  in_validation: { labelKey: "label.inValidation",  color: "bg-blue-100 text-blue-700 border-blue-200",   icon: AlertCircle },
  closed:        { labelKey: "label.closed",         color: "bg-gray-100 text-gray-600 border-gray-200",   icon: CheckCircle2 },
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function MinhasCandidaturasPage() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications/mine");
      setApplications(res.data);
    } catch {
      setError(t("page.candidaturas.errLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const filtered = useMemo(() => applications.filter((a) => {
    const matchSearch = !search ||
      a.badge_name.toLowerCase().includes(search.toLowerCase()) ||
      (a.area_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "open" && a.status === "open") ||
      (filterStatus === "active" && ["submitted","in_validation"].includes(a.status)) ||
      (filterStatus === "approved" && a.status === "closed" && a.final_result === "approved") ||
      (filterStatus === "rejected" && a.status === "closed" && a.final_result === "rejected");
    return matchSearch && matchStatus;
  }), [applications, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    open: applications.filter((a) => a.status === "open").length,
    active: applications.filter((a) => ["submitted", "in_validation"].includes(a.status)).length,
    approved: applications.filter((a) => a.status === "closed" && a.final_result === "approved").length,
    rejected: applications.filter((a) => a.status === "closed" && a.final_result === "rejected").length,
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Send className="h-6 w-6 text-accent" />
                {t("page.candidaturas.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("page.candidaturas.sub")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                {t("btn.refresh")}
              </Button>
              <Link href="/badges">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  {t("page.candidaturas.new")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{counts.open}</div>
                  <div className="text-xs text-muted-foreground">{t("label.open")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{counts.active}</div>
                  <div className="text-xs text-muted-foreground">{t("label.active")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{counts.approved}</div>
                  <div className="text-xs text-muted-foreground">{t("label.aprovadas")}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{counts.rejected}</div>
                  <div className="text-xs text-muted-foreground">{t("label.rejeitadas")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div {...fadeIn} transition={{ delay: 0.12 }}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder={t("label.searchBadgeArea")} value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {[
                { key: "all",      label: t("label.all") },
                { key: "open",     label: t("label.open") },
                { key: "active",   label: t("label.active") },
                { key: "approved", label: t("label.aprovadas") },
                { key: "rejected", label: t("label.rejeitadas") },
              ].map((f) => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterStatus === f.key ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lista */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {filtered.length} {filtered.length !== 1 ? t("page.candidaturas.countPlural") : t("page.candidaturas.count")}
                {filtered.length !== applications.length && (
                  <span className="text-muted-foreground font-normal text-sm ml-1">({t("page.candidaturas.of")} {applications.length})</span>
                )}
                {filtered.length > PAGE_SIZE && (
                  <span className="text-muted-foreground font-normal text-sm ml-2">· {t("page.candidaturas.page")} {page} {t("page.candidaturas.paginationOf")} {totalPages}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  {t("page.candidaturas.loading")}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{t("label.noApps")}</p>
                  <Link href="/badges" className="mt-3 inline-block">
                    <Button size="sm" variant="outline" className="gap-2 mt-2">
                      <PlusCircle className="h-4 w-4" />
                      {t("label.exploresBadges")}
                    </Button>
                  </Link>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{t("label.noAppsFilter")}</p>
                </div>
              ) : (
                <>
                <div className="divide-y divide-border">
                  {paginated.map((app, i) => {
                    const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.open;
                    const StatusIcon = statusCfg.icon;

                    const isClosed = app.status === "closed";
                    const isApproved = isClosed && app.final_result === "approved";
                    const isRejected = isClosed && app.final_result === "rejected";

                    return (
                      <motion.div
                        key={app.id}
                        {...fadeIn}
                        transition={{ delay: 0.04 * i }}
                        className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {app.level_code ?? "—"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{app.badge_name}</div>
                            {app.area_name && (
                              <div className="text-xs text-muted-foreground truncate">{app.area_name}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {t("label.createdAt")} {formatDate(app.created_at)}
                              {app.submitted_at && ` · ${t("label.submittedAt")} ${formatDate(app.submitted_at)}`}
                              {app.closed_at && ` · ${t("label.closedAt")} ${formatDate(app.closed_at)}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4 shrink-0">
                          {isClosed ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                isApproved
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {isApproved ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {isApproved ? t("label.approved") : t("label.rejected")}
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {t(statusCfg.labelKey)}
                            </span>
                          )}

                          {app.status === "open" ? (
                            <Link href={`/candidaturas/${app.id}`}>
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                                {t("page.candidaturas.continue")}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/candidaturas/${app.id}`}>
                              <Button size="sm" variant="ghost" className="gap-1 h-8 text-xs text-muted-foreground">
                                {t("page.candidaturas.view")}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {t("pagination.page")} {page} {t("pagination.of")} {totalPages} · {filtered.length} {t("pagination.results")}
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
