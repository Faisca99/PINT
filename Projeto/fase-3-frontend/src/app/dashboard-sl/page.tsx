"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Award, Clock, CheckCircle2, RefreshCw, AlertCircle, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface UserRow {
  id: number;
  full_name: string;
  email: string;
  area_name: string | null;
  service_line_name: string | null;
  badge_count: number;
  total_points: number;
}

interface ReportRow {
  id: number;
  status: string;
  final_result: string | null;
  applicant_name: string;
  badge_name: string;
  area_name: string | null;
  service_line_name: string | null;
  submitted_at: string | null;
  created_at: string;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function DashboardSLPage() {
  const { user } = useUser();
  const [consultants, setConsultants] = useState<UserRow[]>([]);
  const [applications, setApplications] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get("/users"),
      api.get("/applications"),
    ])
      .then(([usersRes, appsRes]) => {
        const allUsers: UserRow[] = usersRes.data ?? [];
        const allApps: ReportRow[] = appsRes.data ?? [];
        const myLine = user.serviceLine;

        // Consultores filtrados pela SL do utilizador
        setConsultants(myLine
          ? allUsers.filter((u) => u.service_line_name === myLine)
          : allUsers
        );

        // Candidaturas in_validation da SL do utilizador
        const pendingApps = allApps.filter((a) => {
          if (a.status !== "in_validation") return false;
          if (myLine && a.service_line_name && a.service_line_name !== myLine) return false;
          return true;
        });
        setApplications(pendingApps);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

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
              Dashboard — Service Line Leader
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {user.serviceLine ?? "Todas as Service Lines"} — progresso da equipa
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Consultores", value: consultants.length, icon: Users, color: "bg-primary/10 text-primary" },
                { label: "Badges Atribuídos", value: totalBadges, icon: Award, color: "bg-green-500/10 text-green-600" },
                { label: "Aguardam Validação", value: applications.length, icon: Clock, color: "bg-amber-500/10 text-amber-600" },
                { label: "Pontos Totais", value: totalPoints, icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidaturas pendentes de validação */}
            <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
              <Card className="border border-border shadow-card h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      A aguardar validação
                    </CardTitle>
                    <Link href="/validacao">
                      <Button variant="ghost" size="sm" className="text-accent text-xs">
                        Ver todas <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma candidatura pendente.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {applications.slice(0, 6).map((app) => (
                        <Link key={app.id} href={`/validacao/${app.id}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{app.applicant_name}</div>
                              <div className="text-xs text-muted-foreground truncate">{app.badge_name}</div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-3 shrink-0">
                              {app.submitted_at
                                ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                                : new Date(app.created_at).toLocaleDateString("pt-PT")}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top consultores por badges */}
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
                        .slice(0, 6)
                        .map((c, i) => (
                          <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                            <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
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
