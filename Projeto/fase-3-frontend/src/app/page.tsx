"use client";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Hexagon,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge-variant";
import AppLayout from "@/components/AppLayout";
import {
  mockUser,
  mockSubmissions,
  mockUserBadges,
  mockAchievements,
  TIER_CONFIG,
} from "@/lib/mock-data";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const totalBadges = mockUserBadges.length;
  const pendingSubmissions = mockSubmissions.filter((s) => s.status !== "closed").length;
  const approvedCount = mockSubmissions.filter((s) => s.result === "approved").length;
  const unlockedAchievements = mockAchievements.filter((a) => a.unlockedAt).length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {mockUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanha o teu progresso na jornada técnica
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pontos Totais", value: mockUser.totalPoints, icon: Zap, accent: true },
            { label: "Badges Obtidos", value: totalBadges, icon: Award },
            { label: "Candidaturas Pendentes", value: pendingSubmissions, icon: Clock },
            { label: "Conquistas", value: `${unlockedAchievements}/${mockAchievements.length}`, icon: Target },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
              <Card className={`border border-border shadow-card hover:shadow-card-hover transition-shadow ${stat.accent ? "gradient-primary text-primary-foreground" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`h-5 w-5 ${stat.accent ? "text-accent" : "text-muted-foreground"}`} />
                    {stat.accent && <span className="text-[10px] uppercase tracking-wider opacity-60">Total</span>}
                  </div>
                  <div className={`text-3xl font-bold ${stat.accent ? "" : "text-foreground"}`}>{stat.value}</div>
                  <div className={`text-sm mt-1 ${stat.accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress card */}
          <motion.div className="lg:col-span-2" {...fadeIn} transition={{ delay: 0.3 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Progresso — {mockUser.area}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {Object.entries(TIER_CONFIG).map(([key, config]) => {
                  const progress = key === "junior" ? 100 : key === "intermediate" ? 40 : 0;
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.color}`}>
                            Nível {config.level}
                          </span>
                          <span className="text-sm font-medium text-foreground">{config.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
            <Card className="border border-border shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hexagon className="h-5 w-5 text-warning" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      achievement.unlockedAt
                        ? "bg-card border-border"
                        : "bg-muted/30 border-transparent opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {achievement.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlockedAt && (
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent submissions */}
        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-info" />
                  Candidaturas Recentes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 text-sm">
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {sub.badge.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sub.badge.area} · {sub.badge.tierCode}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        variant={sub.status === "closed" ? sub.result as any : sub.status as any}
                      />
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {sub.submittedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

