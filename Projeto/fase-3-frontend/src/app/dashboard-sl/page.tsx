"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface ConsultorProgress {
  userId: number;
  name: string;
  approved: number;
  inValidation: number;
  submitted: number;
  rejected: number;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function DashboardSLPage() {
  const { user } = useUser();
  const [consultors, setConsultors] = useState<ConsultorProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/applications");
        const map: Record<number, ConsultorProgress> = {};

        for (const a of res.data) {
          if (!map[a.applicant_user_id]) {
            map[a.applicant_user_id] = {
              userId: a.applicant_user_id,
              name: a.applicant_name,
              approved: 0,
              inValidation: 0,
              submitted: 0,
              rejected: 0,
            };
          }
          const c = map[a.applicant_user_id];
          if (a.status === "closed" && a.final_result === "approved") c.approved++;
          else if (a.status === "closed" && a.final_result === "rejected") c.rejected++;
          else if (a.status === "in_validation") c.inValidation++;
          else if (a.status === "submitted") c.submitted++;
        }

        setConsultors(Object.values(map).sort((a, b) => b.approved - a.approved));
      } catch {
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!user) return null;

  const totals = consultors.reduce(
    (acc, c) => ({
      consultores: acc.consultores + 1,
      approved: acc.approved + c.approved,
      pendentes: acc.pendentes + c.submitted + c.inValidation,
    }),
    { consultores: 0, approved: 0, pendentes: 0 }
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-accent" />
            Dashboard — Service Line
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Progresso dos consultores — {user.serviceLine}
          </p>
        </motion.div>

        {/* KPIs */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? "—" : totals.consultores}
                  </div>
                  <div className="text-xs text-muted-foreground">Consultores</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? "—" : totals.approved}
                  </div>
                  <div className="text-xs text-muted-foreground">Badges Aprovados</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {loading ? "—" : totals.pendentes}
                  </div>
                  <div className="text-xs text-muted-foreground">Pendentes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabela de progresso */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                Progresso por Consultor
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
                  <p className="text-sm">Nenhum dado disponível.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Consultor</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-green-600 uppercase tracking-wider">Aprovados</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-blue-600 uppercase tracking-wider">Em Validação</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-amber-600 uppercase tracking-wider">Submetidos</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-red-600 uppercase tracking-wider">Rejeitados</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {consultors.map((c, i) => (
                        <motion.tr
                          key={c.userId}
                          {...fadeIn}
                          transition={{ delay: 0.02 * i }}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {c.approved}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-blue-600 font-medium">{c.inValidation}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                              <Clock className="h-3.5 w-3.5" />
                              {c.submitted}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                              <XCircle className="h-3.5 w-3.5" />
                              {c.rejected}
                            </span>
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
