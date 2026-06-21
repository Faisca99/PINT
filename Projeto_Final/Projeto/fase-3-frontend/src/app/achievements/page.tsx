"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, Lock, RefreshCw, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t, tOrDefault, formatDate } from "@/lib/i18n";

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
  // Marcos recém-desbloqueados ainda por celebrar (Req. Consultor 16)
  const [toCelebrate, setToCelebrate] = useState<Achievement[]>([]);

  useEffect(() => {
    api.get("/me/achievements")
      .then((r) => {
        const data: Achievement[] = r.data ?? [];
        setAchievements(data);
        const pending = data.filter((a) => !!a.awarded_at && !a.celebrated);
        if (pending.length > 0) {
          setToCelebrate(pending);
          // marca como celebradas no backend para não repetir
          api.post("/me/achievements/celebrate").catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const unlocked = achievements.filter((a) => !!a.awarded_at);
  const locked = achievements.filter((a) => !a.awarded_at);
  const progress = achievements.length ? Math.round((unlocked.length / achievements.length) * 100) : 0;

  return (
    <AppLayout>
      {/* Modal de celebração de marcos */}
      <AnimatePresence>
        {toCelebrate.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 text-center"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-foreground mb-1">{t("page.achievements.celebrateTitle")}</h2>
              <p className="text-sm text-muted-foreground mb-4">{t("page.achievements.celebrateSub")}</p>
              <div className="space-y-2 mb-5">
                {toCelebrate.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50/40 text-left">
                    <span className="text-2xl shrink-0">{ACHIEVEMENT_ICONS[a.code] ?? "🎯"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{tOrDefault(`achievement.${a.code}.name`, a.name)}</div>
                      {a.points_bonus > 0 && (
                        <div className="text-xs font-medium text-yellow-600">+{a.points_bonus} pts</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setToCelebrate([])} className="w-full">
                {t("page.achievements.celebrateBtn")}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" />
            {t("page.achievements.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("page.achievements.sub")}</p>
        </motion.div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            {t("page.achievements.loading")}
          </div>
        ) : (
          <>
            {/* Progresso */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border border-border shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">{t("page.achievements.progress")}</span>
                    <span className="text-sm font-bold text-foreground">{unlocked.length}/{achievements.length} {t("page.achievements.ofUnlocked")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-primary rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{progress}{t("page.achievements.pct")}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Desbloqueadas */}
            {unlocked.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {t("page.achievements.unlocked")} ({unlocked.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unlocked.map((a, i) => (
                    <motion.div key={a.id} {...fadeIn} transition={{ delay: 0.05 * i }}>
                      <Card className="border border-green-200 bg-green-50/30 shadow-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                          <span className="text-3xl shrink-0">{ACHIEVEMENT_ICONS[a.code] ?? "🎯"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">{tOrDefault(`achievement.${a.code}.name`, a.name)}</span>
                              {a.points_bonus > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-yellow-600">
                                  <Zap className="h-3 w-3" />+{a.points_bonus} pts
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{tOrDefault(`achievement.${a.code}.desc`, a.description)}</p>
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              {t("page.achievements.unlockedAt")} {formatDate(a.awarded_at!)}
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
                  {t("page.achievements.locked")} ({locked.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locked.map((a, i) => (
                    <motion.div key={a.id} {...fadeIn} transition={{ delay: 0.04 * i }}>
                      <Card className="border border-border opacity-60">
                        <CardContent className="p-4 flex items-start gap-3">
                          <span className="text-3xl shrink-0 grayscale">{ACHIEVEMENT_ICONS[a.code] ?? "🎯"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{tOrDefault(`achievement.${a.code}.name`, a.name)}</span>
                              {a.points_bonus > 0 && (
                                <span className="text-xs text-muted-foreground">+{a.points_bonus} pts</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{tOrDefault(`achievement.${a.code}.desc`, a.description)}</p>
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
                <p className="text-sm">{t("page.achievements.empty")}</p>
                <p className="text-xs mt-1">{t("page.achievements.emptySub")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
