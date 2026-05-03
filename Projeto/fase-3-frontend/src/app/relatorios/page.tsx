"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface ApplicationRow {
  id: number;
  applicant_name: string;
  badge_name: string;
  status: string;
  final_result: string | null;
  submitted_at: string | null;
  created_at: string;
  closed_at: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  open: "Em Aberto",
  submitted: "Submetida",
  in_validation: "Em Validação",
  closed: "Fechada",
};

const RESULT_LABEL: Record<string, string> = {
  approved: "Aprovada",
  rejected: "Rejeitada",
  pending: "Pendente",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function RelatoriosPage() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch {
      setError("Não foi possível carregar os dados. Verifica se o backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    const matchSearch =
      !search ||
      app.applicant_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.badge_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Exportar Excel
  const exportExcel = async () => {
    const { utils, writeFile } = await import("xlsx");
    const data = filtered.map((app) => ({
      "ID": app.id,
      "Consultor": app.applicant_name,
      "Badge": app.badge_name,
      "Estado": STATUS_LABEL[app.status] ?? app.status,
      "Resultado": app.final_result ? RESULT_LABEL[app.final_result] ?? app.final_result : "—",
      "Submetido em": app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("pt-PT") : "—",
      "Fechado em": app.closed_at ? new Date(app.closed_at).toLocaleDateString("pt-PT") : "—",
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Candidaturas");
    writeFile(wb, `relatorio_badges_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Exportar PDF
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Relatório de Candidaturas — Softinsa Badge Platform", 14, 14);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-PT")} | Total: ${filtered.length} registos`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["ID", "Consultor", "Badge", "Estado", "Resultado", "Submetido em", "Fechado em"]],
      body: filtered.map((app) => [
        app.id,
        app.applicant_name,
        app.badge_name,
        STATUS_LABEL[app.status] ?? app.status,
        app.final_result ? RESULT_LABEL[app.final_result] ?? app.final_result : "—",
        app.submitted_at ? new Date(app.submitted_at).toLocaleDateString("pt-PT") : "—",
        app.closed_at ? new Date(app.closed_at).toLocaleDateString("pt-PT") : "—",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`relatorio_badges_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    approved: applications.filter((a) => a.final_result === "approved").length,
    rejected: applications.filter((a) => a.final_result === "rejected").length,
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-accent" />
                Relatórios
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Visão geral de todas as candidaturas e badges da plataforma
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportExcel}
                disabled={loading || filtered.length === 0}
                className="gap-2 text-green-700 border-green-200 hover:bg-green-50"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPDF}
                disabled={loading || filtered.length === 0}
                className="gap-2 text-red-700 border-red-200 hover:bg-red-50"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total de Candidaturas", value: stats.total, color: "text-primary", bg: "bg-primary/10" },
              { label: "Pendentes", value: stats.submitted, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Aprovadas", value: stats.approved, color: "text-green-600", bg: "bg-green-50" },
              { label: "Rejeitadas", value: stats.rejected, color: "text-red-600", bg: "bg-red-50" },
            ].map((kpi) => (
              <Card key={kpi.label} className="border border-border shadow-sm">
                <CardContent className={`p-4 ${kpi.bg} rounded-lg`}>
                  <div className={`text-3xl font-bold ${kpi.color}`}>{loading ? "—" : kpi.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Filtros e pesquisa */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar consultor ou badge..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-3 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Filter className="h-4 w-4 text-muted-foreground" />
            {[
              { key: "all", label: "Todas" },
              { key: "submitted", label: "Submetidas" },
              { key: "in_validation", label: "Em Validação" },
              { key: "closed", label: "Fechadas" },
            ].map((f) => (
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
            <span className="text-xs text-muted-foreground ml-auto">{filtered.length} resultado(s)</span>
          </div>
        </motion.div>

        {/* Tabela */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
          <Card className="border border-border shadow-card">
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
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum resultado encontrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consultor</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Badge</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resultado</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Submetido</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((app, i) => (
                        <motion.tr
                          key={app.id}
                          {...fadeIn}
                          transition={{ delay: 0.02 * i }}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{app.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{app.applicant_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{app.badge_name}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                              app.status === "submitted" ? "bg-amber-100 text-amber-700 border-amber-200" :
                              app.status === "in_validation" ? "bg-blue-100 text-blue-700 border-blue-200" :
                              app.status === "closed" ? "bg-gray-100 text-gray-600 border-gray-200" :
                              "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {STATUS_LABEL[app.status] ?? app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {app.final_result ? (
                              <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                                app.final_result === "approved" ? "text-green-600" :
                                app.final_result === "rejected" ? "text-red-600" :
                                "text-muted-foreground"
                              }`}>
                                {app.final_result === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                                 app.final_result === "rejected" ? <XCircle className="h-3.5 w-3.5" /> :
                                 <Clock className="h-3.5 w-3.5" />}
                                {RESULT_LABEL[app.final_result] ?? app.final_result}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {app.submitted_at
                              ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                              : "—"}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
