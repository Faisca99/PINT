"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  open: {
    label: "Em Aberto",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ValidacaoInboxPage() {
  const { user } = useUser();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      setError("Não foi possível carregar as candidaturas. Verifica se o backend está a correr.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (!user) return null;

  // Filtrar conforme o role e o filtro selecionado
  const filtered = applications.filter((app) => {
    if (user.role === "talent_manager") {
      // TM vê todas as submetidas, independente de área/SL
      const relevantStatuses = ["submitted", "in_validation", "closed"];
      if (!relevantStatuses.includes(app.status)) return false;
    } else if (user.role === "service_line_leader") {
      // SLL só vê as da SUA service line, já em validação
      const relevantStatuses = ["in_validation", "closed"];
      if (!relevantStatuses.includes(app.status)) return false;
      // Filtro por service line (se o utilizador tem SL atribuída)
      if (user.serviceLine && app.service_line_name && app.service_line_name !== user.serviceLine) {
        return false;
      }
    }
    if (filterStatus !== "all") return app.status === filterStatus;
    return true;
  });

  const pendingCount = applications.filter((a) => {
    if (user.role === "talent_manager") return a.status === "submitted";
    if (user.role === "service_line_leader") {
      const matchSL = !user.serviceLine || !a.service_line_name || a.service_line_name === user.serviceLine;
      return a.status === "in_validation" && matchSL;
    }
    return false;
  }).length;

  const statusFilters =
    user.role === "talent_manager"
      ? [
          { key: "all", label: "Todas" },
          { key: "submitted", label: "Submetidas" },
          { key: "in_validation", label: "Em Validação" },
          { key: "closed", label: "Fechadas" },
        ]
      : [
          { key: "all", label: "Todas" },
          { key: "in_validation", label: "Em Validação" },
          { key: "closed", label: "Fechadas" },
        ];

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
            <Button
              variant="outline"
              size="sm"
              onClick={fetchApplications}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-3 gap-4">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "closed" && a.final_result === "approved").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Aprovadas</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "closed" && a.final_result === "rejected").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Rejeitadas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
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
        </motion.div>

        {/* Tabela de candidaturas */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {filtered.length} candidatura{filtered.length !== 1 ? "s" : ""}
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
                <div className="divide-y divide-border">
                  {filtered.map((app, i) => {
                    const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.open;
                    const StatusIcon = statusCfg.icon;
                    return (
                      <motion.div
                        key={app.id}
                        {...fadeIn}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                      >
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
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:block w-24 text-right">
                            {app.submitted_at
                              ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                              : new Date(app.created_at).toLocaleDateString("pt-PT")}
                          </span>
                          <Link href={`/validacao/${app.id}`}>
                            <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                              Rever
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
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
