"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Search, RefreshCw, Zap, ChevronRight, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { t } from "@/lib/i18n";

interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  badge_type: string;
  points: number;
  level_code: string | null;
  level_name: string | null;
  area_name: string | null;
  service_line_name: string | null;
  learning_path_name: string | null;
}

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-purple-100 text-purple-700 border-purple-200",
  E: "bg-red-100 text-red-700 border-red-200",
};

const getTypeLabel = (type: string) => t({ level: "page.badges.type.level", special: "page.badges.type.special", premium: "page.badges.type.premium" }[type] ?? type);

// Estado da candidatura do consultor para um badge (mostrado no catálogo)
type CatalogStatus = "earned" | "submitted" | "in_validation" | "open" | "rejected";

const STATUS_BADGE: Record<CatalogStatus, { labelKey: string; color: string; icon: any }> = {
  earned:        { labelKey: "label.approved",     color: "bg-green-100 text-green-700 border-green-200",  icon: CheckCircle2 },
  submitted:     { labelKey: "label.submitted",    color: "bg-amber-100 text-amber-700 border-amber-200",  icon: Clock },
  in_validation: { labelKey: "label.inValidation", color: "bg-blue-100 text-blue-700 border-blue-200",     icon: AlertCircle },
  open:          { labelKey: "label.open",         color: "bg-slate-100 text-slate-600 border-slate-200",  icon: Clock },
  rejected:      { labelKey: "label.rejected",     color: "bg-red-100 text-red-700 border-red-200",        icon: AlertCircle },
};

const STATUS_RANK: Record<CatalogStatus, number> = { earned: 5, in_validation: 4, submitted: 3, open: 2, rejected: 1 };
const rank = (s: CatalogStatus) => STATUS_RANK[s];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function BadgesCatalog() {
  const { user } = useUser();
  const isConsultant = user?.role === "consultant";
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSL, setFilterSL] = useState("all");
  // Estado das candidaturas/badges do consultor por badge_id
  const [statusByBadge, setStatusByBadge] = useState<Record<number, CatalogStatus>>({});

  useEffect(() => {
    api.get("/badges")
      .then((r) => setBadges(r.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Cruza catálogo com candidaturas + badges ganhos (apenas consultor)
  useEffect(() => {
    if (!isConsultant) return;
    Promise.all([
      api.get("/applications/mine").catch(() => ({ data: [] })),
      api.get("/me/badges").catch(() => ({ data: [] })),
    ]).then(([appsRes, badgesRes]) => {
      const map: Record<number, CatalogStatus> = {};
      // Candidaturas em curso / fechadas
      for (const a of (appsRes.data ?? []) as { badge_id: number; status: string; final_result: string | null }[]) {
        let s: CatalogStatus | null = null;
        if (a.status === "submitted") s = "submitted";
        else if (a.status === "in_validation") s = "in_validation";
        else if (a.status === "open") s = "open";
        else if (a.status === "closed") s = a.final_result === "rejected" ? "rejected" : "earned";
        // prioridade: earned > in_validation > submitted > open > rejected
        if (s && (!map[a.badge_id] || rank(s) > rank(map[a.badge_id]))) map[a.badge_id] = s;
      }
      // Badges efetivamente ganhos (têm sempre prioridade máxima)
      for (const b of (badgesRes.data ?? []) as { badge_id: number }[]) {
        map[b.badge_id] = "earned";
      }
      setStatusByBadge(map);
    });
  }, [isConsultant]);

  const servicelines = Array.from(new Set(badges.map((b) => b.service_line_name).filter(Boolean)));

  const filtered = badges.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.area_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.service_line_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSL = filterSL === "all" || b.service_line_name === filterSL;
    return matchSearch && matchSL;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="h-6 w-6 text-accent" />
            {t("page.badges.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("page.badges.sub")}
          </p>
        </motion.div>

        {/* Integração com www.softinsa.pt (Req. Consultor 28) */}
        <motion.div {...fadeIn} transition={{ delay: 0.08 }}>
          <a
            href="https://www.softinsa.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{t("page.badges.softinsaTitle")}</div>
                <div className="text-xs text-muted-foreground truncate">{t("page.badges.softinsaText")}</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary shrink-0">
              {t("page.badges.softinsaCta")}
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        </motion.div>

        {/* Filtros */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("page.badges.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <select
              value={filterSL}
              onChange={(e) => setFilterSL(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">{t("page.badges.allSL")}</option>
              {servicelines.map((sl) => (
                <option key={sl} value={sl!}>{sl}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Contagem */}
        {!loading && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} badge{filtered.length !== 1 ? "s" : ""} {filtered.length !== 1 ? t("page.badges.foundPlural") : t("page.badges.found")}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            {t("page.badges.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Award className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{t("page.badges.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((badge, i) => {
              const levelKey = badge.level_code?.charAt(0) ?? "";
              const levelColor = LEVEL_COLORS[levelKey] ?? "bg-gray-100 text-gray-600 border-gray-200";
              const catStatus = statusByBadge[badge.id];
              const statusCfg = catStatus ? STATUS_BADGE[catStatus] : null;

              return (
                <motion.div key={badge.id} {...fadeIn} transition={{ delay: 0.04 * (i % 9) }}>
                  <Link href={`/badges/${badge.id}`}>
                    <Card className="border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all h-full cursor-pointer group">
                      <CardContent className="p-5 flex flex-col h-full">
                        {/* Estado da candidatura do consultor */}
                        {statusCfg && (
                          <div className="mb-2">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                              <statusCfg.icon className="h-3 w-3" />
                              {t(statusCfg.labelKey)}
                            </span>
                          </div>
                        )}
                        {/* Topo */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <span className="text-base font-bold text-primary">
                              {badge.level_code ?? "?"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColor}`}>
                                {levelKey ? t(`level.${levelKey}`) : getTypeLabel(badge.badge_type)}
                            </span>
                            {badge.points > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-yellow-600 font-medium">
                                <Zap className="h-3 w-3" />
                                {badge.points} pts
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                            {badge.name}
                          </h3>
                          {badge.area_name && (
                            <p className="text-xs text-muted-foreground">{badge.area_name}</p>
                          )}
                          {badge.service_line_name && (
                            <p className="text-xs text-muted-foreground/70">{badge.service_line_name}</p>
                          )}
                          {badge.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{badge.description}</p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{badge.code}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-1.5 transition-all">
                            {t("page.badges.viewDetails")}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
