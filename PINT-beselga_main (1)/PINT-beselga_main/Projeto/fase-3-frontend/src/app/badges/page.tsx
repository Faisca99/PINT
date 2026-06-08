"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Search, RefreshCw, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
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

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function BadgesCatalog() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSL, setFilterSL] = useState("all");

  useEffect(() => {
    api.get("/badges")
      .then((r) => setBadges(r.data ?? []))
      .finally(() => setLoading(false));
  }, []);

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

              return (
                <motion.div key={badge.id} {...fadeIn} transition={{ delay: 0.04 * (i % 9) }}>
                  <Link href={`/badges/${badge.id}`}>
                    <Card className="border border-border shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all h-full cursor-pointer group">
                      <CardContent className="p-5 flex flex-col h-full">
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
