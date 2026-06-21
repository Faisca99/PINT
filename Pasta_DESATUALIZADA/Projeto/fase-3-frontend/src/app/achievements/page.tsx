"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Lock, RefreshCw, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  points_bonus: number;
  awarded_at: string | null;
  celebrated: boolean;
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  FIRST_BADGE: "🏆",
  BADGES_3: "⚡",
  BADGES_5: "💎",
  BADGES_10: "👑",
  POINTS_100: "🌟",
  POINTS_500: "🚀",
  POINTS_1000: "🏅",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/me/achievements")
      .then((r) => setAchievements(r.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const unlocked = achievements.filter((a) => !!a.awarded_at);
  const locked = achievements.filter((a) => !a.awarded_at);
  const progress = achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" />
            Conquistas
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Desbloqueia conquistas ao atingir marcos na plataforma</p>
        </motion.div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            A carregar conquistas...
          </div>
        ) : (
          <>
            {/* Progresso */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border border-border shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Progresso geral</span>
                    <span className="text-sm font-bold text-foreground">{unlocked.length}/{achievements.length} desbloqueadas</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{progress}% completo</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Desbloqueadas */}
            {unlocked.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Desbloqueadas ({unlocked.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unlocked.map((a, i) => (
                    <motion.div key={a.id} {...fadeIn} transition={{ delay: 0.05 * i }}>
                      <Card className="border border-green-200 bg-green-50/30 shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                          <span className="text-3xl shrink-0">{ACHIEVEMENT_ICONS[a.code] ?? "🎯"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">{a.name}</span>
                              {a.points_bonus > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-yellow-600">
                                  <Zap className="h-3 w-3" />+{a.points_bonus} pts
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              Desbloqueada em {new Date(a.awarded_at!).toLocaleDateString("pt-PT")}
                            </p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bloqueadas */}
            {locked.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                <h2 className="text-base font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Por desbloquear ({locked.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locked.map((a, i) => (
                    <motion.div key={a.id} {...fadeIn} transition={{ delay: 0.04 * i }}>
                      <Card className="border border-border opacity-60">
                        <CardContent className="p-4 flex items-start gap-3">
                          <span className="text-3xl shrink-0 grayscale">{ACHIEVEMENT_ICONS[a.code] ?? "🎯"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{a.name}</span>
                              {a.points_bonus > 0 && (
                                <span className="text-xs text-muted-foreground">+{a.points_bonus} pts</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                          </div>
                          <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {achievements.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhuma conquista configurada ainda.</p>
                <p className="text-xs mt-1">O administrador pode adicionar conquistas via BD.</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
