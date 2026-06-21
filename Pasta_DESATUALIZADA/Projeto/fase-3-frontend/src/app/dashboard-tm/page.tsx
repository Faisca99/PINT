"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Award, Clock, CheckCircle2, ChevronRight, RefreshCw, BarChart3 } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface UserRow { id: number; full_name: string; role: string; area_name: string | null; service_line_name: string | null; badge_count: number; total_points: number; }
interface AppRow  { id: number; status: string; final_result: string | null; applicant_name: string; badge_name: string; submitted_at: string | null; created_at: string; }
interface TmSummary { pending_tm: number; pending_sll: number; approved: number; rejected: number; total: number; }

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function DashboardTMPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [apps, setApps]   = useState<AppRow[]>([]);
  const [summary, setSummary] = useState<TmSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/users"),
      api.get("/reports/applications"),
      api.get("/reports/summary"),
    ])
      .then(([uRes, aRes, sRes]) => {
        setUsers(uRes.data ?? []);
        setApps(aRes.data ?? []);
        setSummary(sRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = apps.filter((a) => a.status === "submitted");
  const topConsultants = [...users]
    .filter((u) => u.role === "consultant")
    .sort((a, b) => Number(b.badge_count) - Number(a.badge_count))
    .slice(0, 8);

  return (
    <AppLayout>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          A carregar dashboard...
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-accent" />
              Dashboard — Talent Manager
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Visão global de todos os consultores e candidaturas</p>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Consultores", value: users.filter((u) => u.role === "consultant").length, icon: Users, color: "bg-blue-500/10 text-blue-600" },
                { label: "Aguardam TM", value: summary?.pending_tm ?? 0, icon: Clock, color: "bg-amber-500/10 text-amber-600" },
                { label: "Aprovadas", value: summary?.approved ?? 0, icon: CheckCircle2, color: "bg-green-500/10 text-green-600" },
                { label: "Total Candidaturas", value: summary?.total ?? 0, icon: Award, color: "bg-primary/10 text-primary" },
              ].map((s, i) => (
                <motion.div key={s.label} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Card className="border border-border shadow-card">
                    <CardContent className="p-5">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidaturas pendentes */}
            <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
              <Card className="border border-border shadow-card h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Pendentes de Revisão ({pending.length})
                    </CardTitle>
                    <Link href="/validacao">
                      <Button variant="ghost" size="sm" className="text-accent text-xs">
                        Ver todas <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {pending.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma candidatura pendente.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pending.slice(0, 6).map((app) => (
                        <Link key={app.id} href={`/validacao/${app.id}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{app.applicant_name}</div>
                              <div className="text-xs text-muted-foreground truncate">{app.badge_name}</div>
                            </div>
                            <span className="text-xs text-amber-600 font-medium ml-3 shrink-0 px-2 py-0.5 rounded-full bg-amber-100">
                              Submetida
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top consultores */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="border border-border shadow-card h-full">
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
                  {topConsultants.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Sem consultores.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topConsultants.map((c, i) => (
                        <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                          <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {c.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{c.full_name}</div>
                            <div className="text-xs text-muted-foreground">{c.area_name ?? "—"}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold text-foreground">{c.badge_count} <span className="text-xs font-normal text-muted-foreground">badges</span></div>
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
        </div>
      )}
    </AppLayout>
  );
}
