"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award, TrendingUp, Clock, CheckCircle2, ChevronRight,
  Hexagon, Zap, Target, RefreshCw, Send, AlertTriangle, Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge-variant";
import AppLayout from "@/components/AppLayout";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  A: { label: "Júnior", color: "bg-green-100 text-green-700" },
  B: { label: "Intermédio", color: "bg-blue-100 text-blue-700" },
  C: { label: "Sénior", color: "bg-yellow-100 text-yellow-700" },
  D: { label: "Especialista", color: "bg-purple-100 text-purple-700" },
  E: { label: "Líder de Conhecimento", color: "bg-red-100 text-red-700" },
};

export default function Dashboard() {
  const { user } = useUser();

  const [applications, setApplications] = useState<any[]>([]);
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiringBadges, setExpiringBadges] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setLoading(true);
      try {
        const [appsRes, dashRes, badgesRes, recsRes] = await Promise.all([
          api.get("/applications/mine"),
          api.get("/me/dashboard"),
          api.get("/me/badges"),
          api.get("/me/recommendations"),
        ]);
        setApplications(appsRes.data ?? []);
        setPoints(dashRes.data?.points ?? 0);
        const badges = badgesRes.data ?? [];
        setMyBadges(badges);
        const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        setExpiringBadges(badges.filter((b: any) => b.expires_at && new Date(b.expires_at) < in30Days && new Date(b.expires_at) > new Date()));
        setRecommendations(recsRes.data ?? []);
      } catch {
        setApplications([]);
        setMyBadges([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  const pendingCount = applications.filter((a) => a.status !== "closed").length;
  const approvedCount = myBadges.length;

  // Progresso por nível — quantos badges ganhos em cada nível
  const levelProgress = Object.entries(LEVEL_CONFIG).map(([code, cfg]) => {
    const earned = myBadges.filter((b) => b.level_code?.startsWith(code)).length;
    return { code, ...cfg, earned };
  });

  return (
    <AppLayout>
      {!user ? null : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanha o teu progresso na jornada técnica
            </p>
          </motion.div>

          {/* Banner expiração */}
          {expiringBadges.length > 0 && (
            <motion.div {...fadeIn} transition={{ delay: 0.08 }}>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">
                    {expiringBadges.length} badge{expiringBadges.length !== 1 ? "s" : ""} a expirar nos próximos 30 dias
                  </p>
                  <p className="text-xs mt-0.5">
                    {expiringBadges.map((b) => `${b.badge_name} (${new Date(b.expires_at).toLocaleDateString("pt-PT")})`).join(" · ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Pontos Totais", value: loading ? "—" : points, icon: Zap, accent: true },
              { label: "Badges Obtidos", value: loading ? "—" : approvedCount, icon: Award },
              { label: "Em Validação", value: loading ? "—" : pendingCount, icon: Clock },
              { label: "Área", value: user.area ?? "—", icon: Target, small: true },
            ].map((stat, i) => (
              <motion.div key={stat.label} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
                <Card className={`border border-border shadow-card ${stat.accent ? "gradient-primary text-primary-foreground" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon className={`h-5 w-5 ${stat.accent ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div className={`font-bold ${stat.small ? "text-lg" : "text-3xl"} ${stat.accent ? "" : "text-foreground"}`}>
                      {loading && !stat.accent && !stat.small
                        ? <RefreshCw className="h-6 w-6 animate-spin" />
                        : stat.value}
                    </div>
                    <div className={`text-sm mt-1 ${stat.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progresso por nível */}
            <motion.div className="lg:col-span-2" {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="border border-border shadow-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Progresso — {user.area ?? "Todos os níveis"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                    </div>
                  ) : levelProgress.map(({ code, label, color, earned }) => (
                    <div key={code} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${color}`}>
                          Nível {code}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">{label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {earned > 0 ? (
                          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            {earned} badge{earned !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem badges</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <Link href="/my-badges">
                      <Button variant="ghost" size="sm" className="text-accent text-sm">
                        Ver todos os meus badges
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Últimos badges ganhos */}
            <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
              <Card className="border border-border shadow-card h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hexagon className="h-5 w-5 text-warning" />
                    Últimos Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                    </div>
                  ) : myBadges.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Ainda sem badges. Candidata-te!</p>
                      <Link href="/badges">
                        <Button size="sm" variant="outline" className="mt-2">Ver Catálogo</Button>
                      </Link>
                    </div>
                  ) : myBadges.slice(0, 4).map((b) => (
                    <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{b.level_code ?? "?"}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">{b.badge_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(b.awarded_at).toLocaleDateString("pt-PT")}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recomendações de próximos badges */}
          {recommendations.length > 0 && (
            <motion.div {...fadeIn} transition={{ delay: 0.38 }}>
              <Card className="border border-border shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Próximos Badges Recomendados
                    </CardTitle>
                    <Link href="/badges">
                      <Button variant="ghost" size="sm" className="text-accent text-sm">
                        Ver catálogo <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recommendations.map((rec) => (
                      <Link key={rec.id} href={`/badges/${rec.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-yellow-600">{rec.level_code}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{rec.badge_name}</div>
                            <div className="text-xs text-muted-foreground truncate">{rec.area_name}</div>
                            {rec.points > 0 && <div className="text-xs text-yellow-600">+{rec.points} pts</div>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Candidaturas recentes */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="h-5 w-5 text-info" />
                    Candidaturas Recentes
                  </CardTitle>
                  <Link href="/candidaturas">
                    <Button variant="ghost" size="sm" className="text-accent text-sm">
                      Ver todas <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Ainda não tens candidaturas.</p>
                    <Link href="/badges">
                      <Button size="sm" variant="outline" className="mt-3">Ver Badges</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{app.level_code ?? "—"}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{app.badge_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {app.submitted_at
                                ? new Date(app.submitted_at).toLocaleDateString("pt-PT")
                                : new Date(app.created_at).toLocaleDateString("pt-PT")}
                            </div>
                          </div>
                        </div>
                        <StatusBadge
                          variant={app.status === "closed" ? (app.final_result as any) : (app.status as any)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AppLayout>
  );
}
