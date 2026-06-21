"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, RefreshCw, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/AppLayout";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface RankEntry {
  userId: number;
  name: string;
  badgeCount: number;
  totalPoints: number;
  serviceLine?: string | null;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
};

export default function LeaderboardPage() {
  const { user } = useUser();
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Usar endpoint de leaderboard real (pontos + badges)
        const [leaderRes, appsRes] = await Promise.all([
          api.get("/me/leaderboard"),
          api.get("/applications"),
        ]);

        // Contar badges aprovados por utilizador com service line
        const approvedApps = (appsRes.data ?? []).filter(
          (a: any) => a.status === "closed" && a.final_result === "approved"
        );
        const slByUser: Record<number, string | null> = {};
        for (const a of approvedApps) {
          slByUser[a.applicant_user_id] = a.service_line_name ?? null;
        }

        const sorted: RankEntry[] = (leaderRes.data ?? []).map((entry: any) => ({
          userId: Number(entry.id),
          name: entry.full_name ?? entry.name ?? "",
          badgeCount: Number(entry.badge_count),
          totalPoints: Number(entry.total_points),
          serviceLine: slByUser[Number(entry.id)] ?? null,
        })).sort((a: RankEntry, b: RankEntry) => b.totalPoints - a.totalPoints);

        setRanking(sorted);
      } catch {
        setRanking([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!user) return null;

  // SLL vê apenas os da sua service line
  const isSLL = user.role === "service_line_leader";
  const displayRanking = isSLL && user.serviceLine
    ? ranking.filter((e) => !e.serviceLine || e.serviceLine === user.serviceLine)
    : ranking;

  const top3 = displayRanking.slice(0, 3);
  const rest = displayRanking.slice(3);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" />
            Ranking
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isSLL && user.serviceLine
              ? `Consultores com mais badges — ${user.serviceLine}`
              : "Os consultores com mais badges aprovados na plataforma"}
          </p>
        </motion.div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            A carregar...
          </div>
        ) : displayRanking.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">
              {isSLL ? "Nenhum consultor com badges na tua service line." : "Ainda não há badges aprovados."}
            </p>
          </div>
        ) : (
          <>
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {top3.map((entry, i) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className={i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}
                  >
                    <Card className={`border shadow-card text-center ${
                      i === 0 ? "border-warning/30 shadow-glow" : "border-border"
                    }`}>
                      <CardContent className="p-5">
                        {getRankIcon(i + 1)}
                        <Avatar className="h-14 w-14 mx-auto mt-3 mb-2">
                          <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                            {entry.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-semibold text-foreground">{entry.name}</div>
                        <div className="flex items-center justify-center gap-1 text-yellow-600 mt-3">
                          <Zap className="h-4 w-4" />
                          <span className="text-lg font-bold">{entry.totalPoints}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{entry.badgeCount} badge{entry.badgeCount !== 1 ? "s" : ""} · {entry.totalPoints} pts</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {rest.length > 0 && (
              <Card className="border border-border shadow-card">
                <CardContent className="p-0">
                  {rest.map((entry, i) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className={`flex items-center justify-between p-4 border-b border-border last:border-0 ${
                        entry.userId === user.id ? "bg-accent/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center">{getRankIcon(i + 4)}</div>
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                            {entry.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {entry.name}
                            {entry.userId === user.id && (
                              <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-medium">Tu</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                          <Zap className="h-3.5 w-3.5" />
                          {entry.totalPoints} pts
                        </div>
                        <div className="text-xs text-muted-foreground">{entry.badgeCount} badges</div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
