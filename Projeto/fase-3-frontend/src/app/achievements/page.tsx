"use client";

import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { mockAchievements } from "@/lib/mock-data";

export default function AchievementsPage() {
  const unlocked = mockAchievements.filter((a) => a.unlockedAt).length;
  const total = mockAchievements.length;
  const progress = Math.round((unlocked / total) * 100);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" />
            Conquistas
          </h1>
          <p className="text-muted-foreground mt-1">Desbloqueia conquistas ao atingir marcos</p>
        </motion.div>

        <Card className="border border-border shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progresso geral</span>
              <span className="text-sm text-muted-foreground">{unlocked}/{total} desbloqueadas</span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockAchievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className={`border shadow-card transition-all ${
                achievement.unlockedAt
                  ? "border-warning/20 hover:shadow-card-hover"
                  : "border-border opacity-60"
              }`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    achievement.unlockedAt ? "bg-warning/10" : "bg-muted"
                  }`}>
                    {achievement.unlockedAt
                      ? achievement.icon
                      : <Lock className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{achievement.name}</span>
                      {achievement.unlockedAt && <CheckCircle2 className="h-4 w-4 text-success" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                    {achievement.unlockedAt && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Desbloqueada a {new Date(achievement.unlockedAt).toLocaleDateString("pt-PT")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
