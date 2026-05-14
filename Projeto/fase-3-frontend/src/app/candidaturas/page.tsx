"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Inbox,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: {
    label: "Em Aberto",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
  submitted: {
    label: "Submetida",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  in_validation: {
    label: "Em Validação",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: AlertCircle,
  },
  closed: {
    label: "Fechada",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: CheckCircle2,
  },
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function MinhasCandidaturasPage() {
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications/mine");
      setApplications(res.data);
    } catch {
      setError("Não foi possível carregar as candidaturas. Verifica se o backend está a correr.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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
                Minhas Candidaturas
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Acompanha o estado de todos os teus pedidos de badges
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Link href="/badges">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Nova Candidatura
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
                  <div className="text-xs text-muted-foreground">Em Aberto</div>
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
                  <div className="text-xs text-muted-foreground">Em Revisão</div>
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
                  <div className="text-xs text-muted-foreground">Aprovadas</div>
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
                  <div className="text-xs text-muted-foreground">Rejeitadas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Lista */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {applications.length} candidatura{applications.length !== 1 ? "s" : ""}
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
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Ainda não tens candidaturas.</p>
                  <Link href="/badges" className="mt-3 inline-block">
                    <Button size="sm" variant="outline" className="gap-2 mt-2">
                      <PlusCircle className="h-4 w-4" />
                      Explorar Badges
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {applications.map((app, i) => {
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
                              Criada em {new Date(app.created_at).toLocaleDateString("pt-PT")}
                              {app.submitted_at && ` · Submetida em ${new Date(app.submitted_at).toLocaleDateString("pt-PT")}`}
                              {app.closed_at && ` · Fechada em ${new Date(app.closed_at).toLocaleDateString("pt-PT")}`}
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
                              {isApproved ? "Aprovada" : "Rejeitada"}
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusCfg.label}
                            </span>
                          )}

                          {app.status === "open" ? (
                            <Link href={`/candidaturas/${app.id}`}>
                              <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                                Continuar
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/candidaturas/${app.id}`}>
                              <Button size="sm" variant="ghost" className="gap-1 h-8 text-xs text-muted-foreground">
                                Ver
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
