"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Award, Trophy, Send, CheckCircle2, XCircle, RotateCcw, RefreshCw } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { t, formatDateTime } from "@/lib/i18n";

interface TimelineEvent {
  event_type: "application" | "badge_earned" | "achievement";
  id: number;
  status: string;
  final_result: string | null;
  occurred_at: string;
  submitted_at: string | null;
  closed_at: string | null;
  badge_name: string;
  level_code: string | null;
}

const EVENT_CONFIG = {
  badge_earned: {
    icon: Award,
    dot: "bg-yellow-500",
    labelKey: "timeline.badgeEarned",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
  },
  achievement: {
    icon: Trophy,
    dot: "bg-purple-500",
    labelKey: "timeline.achievement",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  application: {
    open: { dot: "bg-slate-400", labelKey: "timeline.open", icon: Send, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
    submitted: { dot: "bg-blue-500", labelKey: "timeline.submitted", icon: Send, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    in_validation: { dot: "bg-amber-500", labelKey: "timeline.inValidation", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    approved: { dot: "bg-green-500", labelKey: "timeline.approved", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    rejected: { dot: "bg-red-500", labelKey: "timeline.rejected", icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  },
};

// Marcos especiais
const MILESTONES = [
  { count: 1,  labelKey: "timeline.milestone.1"  },
  { count: 3,  labelKey: "timeline.milestone.3"  },
  { count: 5,  labelKey: "timeline.milestone.5"  },
  { count: 10, labelKey: "timeline.milestone.10" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/me/timeline")
      .then((r) => setEvents(r.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const badgesEarned = events.filter((e) => e.event_type === "badge_earned").length;

  // Marcos atingidos
  const milestones = MILESTONES.filter((m) => badgesEarned >= m.count);

  const getAppConfig = (e: TimelineEvent) => {
    if (e.event_type !== "application") return null;
    const status = e.final_result === "approved" ? "approved"
      : e.final_result === "rejected" ? "rejected"
      : e.status;
    return (EVENT_CONFIG.application as any)[status] ?? EVENT_CONFIG.application.open;
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-accent" />
            {t("page.timeline.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("page.timeline.sub")}
          </p>
        </motion.div>

        {/* Marcos atingidos */}
        {milestones.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <Card className="border border-yellow-200 bg-yellow-50/40 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-700 flex items-center gap-2">
                  {t("page.timeline.milestones")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {milestones.map((m) => (
                    <span key={m.count} className="px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300 text-xs font-medium text-yellow-800">
                      {t(m.labelKey)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            {t("page.timeline.loading")}
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{t("page.timeline.empty")}</p>
          </div>
        ) : (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <div className="relative pl-6 space-y-4">
              {/* Linha vertical */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border" />

              {events.map((event, i) => {
                let cfg: any;
                let IconComp: any;

                if (event.event_type === "badge_earned") {
                  cfg = EVENT_CONFIG.badge_earned;
                  IconComp = cfg.icon;
                } else if (event.event_type === "achievement") {
                  cfg = EVENT_CONFIG.achievement;
                  IconComp = cfg.icon;
                } else {
                  cfg = getAppConfig(event);
                  IconComp = cfg?.icon ?? Send;
                }

                return (
                  <motion.div key={`${event.event_type}-${event.id}-${i}`} {...fadeIn} transition={{ delay: 0.04 * i }}
                    className="relative flex gap-3">
                    {/* Ponto na linha */}
                    <div className={`absolute -left-5 mt-1.5 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center ${cfg?.dot ?? "bg-gray-400"}`}>
                      <IconComp className="h-2 w-2 text-white" />
                    </div>

                    <div className={`flex-1 p-3 rounded-lg border ${cfg?.bg ?? "bg-card border-border"}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <span className={`text-xs font-semibold ${cfg?.color ?? "text-foreground"}`}>
                            {t(cfg?.labelKey ?? "timeline.open")}
                          </span>
                          <div className="text-sm font-medium text-foreground mt-0.5">
                            {event.badge_name}
                            {event.level_code && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({t("timeline.level")} {event.level_code})
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDateTime(event.occurred_at, { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
