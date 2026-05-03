"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  Share2,
  Star,
  Hexagon,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface BadgeDetail {
  id: number;
  name: string;
  description: string;
  points: number;
  level_code: string;
  level_name: string;
  area_name: string;
  service_line_name: string;
}

interface EarnedBadge {
  applicationId: number;
  badgeId: number;
  badgeName: string;
  closedAt: string | null;
  detail: BadgeDetail | null;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  A: { label: "Júnior", color: "bg-success/10 text-success" },
  B: { label: "Intermédio", color: "bg-info/10 text-info" },
  C: { label: "Sénior", color: "bg-warning/10 text-warning" },
  D: { label: "Especialista", color: "bg-primary/10 text-primary" },
  E: { label: "Líder de Conhecimento", color: "bg-destructive/10 text-destructive" },
};

function getLevelConfig(code: string | undefined) {
  const key = code?.[0]?.toUpperCase();
  return LEVEL_CONFIG[key ?? ""] ?? { label: code ?? "—", color: "bg-muted/10 text-muted-foreground" };
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function MyBadgesPage() {
  const { user } = useUser();
  const [earned, setEarned] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [appsRes, badgesRes] = await Promise.all([
          api.get("/applications"),
          api.get("/badges"),
        ]);

        const badgesMap: Record<number, BadgeDetail> = {};
        for (const b of badgesRes.data) {
          badgesMap[b.id] = b;
        }

        const approved = appsRes.data.filter(
          (a: any) =>
            Number(a.applicant_user_id) === user!.id &&
            a.status === "closed" &&
            a.final_result === "approved"
        );

        setEarned(
          approved.map((a: any) => ({
            applicationId: a.id,
            badgeId: a.badge_id,
            badgeName: a.badge_name,
            closedAt: a.closed_at,
            detail: badgesMap[a.badge_id] ?? null,
          }))
        );
      } catch {
        setEarned([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (!user) return null;

  const shareLinkedIn = (badgeName: string) => {
    const text = encodeURIComponent(`Obtive o badge "${badgeName}" na plataforma Softinsa!`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&title=${text}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground">Meus Badges</h1>
          <p className="text-muted-foreground mt-1">
            Os teus badges obtidos e certificações verificáveis
          </p>
        </motion.div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            A carregar...
          </div>
        ) : earned.length === 0 ? (
          <div className="text-center py-20">
            <Hexagon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ainda sem badges</h3>
            <p className="text-muted-foreground text-sm">
              Candidata-te a um badge para começar a tua coleção!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {earned.map((eb, i) => {
              const levelCfg = getLevelConfig(eb.detail?.level_code);
              return (
                <motion.div
                  key={eb.applicationId}
                  {...fadeIn}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Card className="border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden">
                    <div className="h-2 gradient-primary" />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                          <Award className="h-7 w-7 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-foreground leading-snug">
                            {eb.badgeName}
                          </h3>
                          {eb.detail && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {eb.detail.area_name} · {eb.detail.service_line_name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${levelCfg.color}`}>
                              {eb.detail?.level_code ? `Nível ${eb.detail.level_code}` : "—"} · {levelCfg.label}
                            </span>
                            {eb.detail?.points != null && (
                              <span className="flex items-center gap-1 text-xs text-warning font-medium">
                                <Star className="h-3 w-3" />
                                {eb.detail.points} pts
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        {eb.closedAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Obtido a {new Date(eb.closedAt).toLocaleDateString("pt-PT")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Verificado</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => shareLinkedIn(eb.badgeName)}
                        >
                          <Share2 className="h-3.5 w-3.5 mr-1.5" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          asChild
                        >
                          <a href={`/badges/${eb.badgeId}`}>
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Ver Badge
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
