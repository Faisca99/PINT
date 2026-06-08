import { motion } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/AppLayout";

const leaderboardData = [
  { rank: 1, name: "Ana Rodrigues", area: "Data Engineering", points: 850, badges: 8 },
  { rank: 2, name: "Carlos Mendes", area: "DevSecOps", points: 720, badges: 6 },
  { rank: 3, name: "Maria Santos", area: "LowCode (OutSystems)", points: 650, badges: 7 },
  { rank: 4, name: "Pedro Costa", area: "Security", points: 500, badges: 5 },
  { rank: 5, name: "Sofia Ferreira", area: "Talent Management", points: 400, badges: 4 },
  { rank: 6, name: "João Silva", area: "LowCode (OutSystems)", points: 100, badges: 2, isCurrentUser: true },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
};

const LeaderboardPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" />
            Ranking
          </h1>
          <p className="text-muted-foreground mt-1">Os consultores com mais pontos na plataforma</p>
        </motion.div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-4">
          {leaderboardData.slice(0, 3).map((user, i) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}
            >
              <Card className={`border shadow-card text-center ${i === 0 ? "border-warning/30 shadow-glow" : "border-border"}`}>
                <CardContent className="p-5">
                  {getRankIcon(user.rank)}
                  <Avatar className="h-14 w-14 mx-auto mt-3 mb-2">
                    <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground mb-3">{user.area}</div>
                  <div className="flex items-center justify-center gap-1 text-warning">
                    <Star className="h-4 w-4" />
                    <span className="text-lg font-bold">{user.points}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{user.badges} badges</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rest of the leaderboard */}
        <Card className="border border-border shadow-card">
          <CardContent className="p-0">
            {leaderboardData.slice(3).map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center justify-between p-4 border-b border-border last:border-0 ${
                  (user as any).isCurrentUser ? "bg-accent/5" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">{getRankIcon(user.rank)}</div>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {user.name}
                      {(user as any).isCurrentUser && (
                        <span className="ml-2 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-medium">
                          Tu
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.area}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{user.badges} badges</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 text-warning" />
                    {user.points}
                  </span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
