"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";

interface ConsultorRow {
  userId: number;
  name: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function UtilizadoresPage() {
  const [consultors, setConsultors] = useState<ConsultorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/applications");
      const map: Record<number, ConsultorRow> = {};

      for (const a of res.data) {
        if (!map[a.applicant_user_id]) {
          map[a.applicant_user_id] = {
            userId: a.applicant_user_id,
            name: a.applicant_name,
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          };
        }
        map[a.applicant_user_id].total++;
        if (a.status === "closed" && a.final_result === "approved") {
          map[a.applicant_user_id].approved++;
        } else if (a.status === "closed" && a.final_result === "rejected") {
          map[a.applicant_user_id].rejected++;
        } else {
          map[a.applicant_user_id].pending++;
        }
      }

      setConsultors(Object.values(map).sort((a, b) => b.approved - a.approved));
    } catch {
      setError("Não foi possível carregar os dados. Verifica se o backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportExcel = async () => {
    const { utils, writeFile } = await import("xlsx");
    const data = consultors.map((c) => ({
      "Consultor": c.name,
      "Total de Candidaturas": c.total,
      "Badges Aprovados": c.approved,
      "Pendentes": c.pending,
      "Rejeitados": c.rejected,
    }));
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Consultores");
    writeFile(wb, `consultores_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Consultores — Softinsa Badge Platform", 14, 14);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-PT")} | Total: ${consultors.length} consultores`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Consultor", "Total", "Aprovados", "Pendentes", "Rejeitados"]],
      body: consultors.map((c) => [c.name, c.total, c.approved, c.pending, c.rejected]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });
    doc.save(`consultores_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Consultores
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Visão geral das candidaturas por consultor
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
                disabled={loading || consultors.length === 0}
                className="gap-2 text-green-700 border-green-200 hover:bg-green-50"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPDF}
                disabled={loading || consultors.length === 0}
                className="gap-2 text-red-700 border-red-200 hover:bg-red-50"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {consultors.length} consultor{consultors.length !== 1 ? "es" : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  A carregar...
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : consultors.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum consultor encontrado.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {consultors.map((c, i) => (
                    <motion.div
                      key={c.userId}
                      {...fadeIn}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.total} candidatura{c.total !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {c.approved}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {c.pending}
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <XCircle className="h-3.5 w-3.5" />
                          {c.rejected}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
