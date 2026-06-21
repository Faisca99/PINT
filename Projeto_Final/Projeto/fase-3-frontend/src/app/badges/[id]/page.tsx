"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Award, Zap, CheckCircle2, FileText,
  Clock, RefreshCw, AlertCircle, Send,
} from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { t, tOrDefault } from "@/lib/i18n";

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-purple-100 text-purple-700 border-purple-200",
  E: "bg-red-100 text-red-700 border-red-200",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function BadgeDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const isConsultant = user?.role === "consultant";
  const [badgeData, setBadgeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    api.get(`/badges/${params.id}`)
      .then((r) => setBadgeData(r.data))
      .catch(() => setError(t("page.badges.detail.error")))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleApply = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await api.post("/applications", { badgeId: Number(params.id) });
      router.push(`/candidaturas/${res.data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? t("page.badges.detail.applyError") ?? "Erro ao criar candidatura.");
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          {t("page.badges.detail.loading")}
        </div>
      </AppLayout>
    );
  }

  if (error && !badgeData) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive text-sm">{error}</p>
          <Link href="/badges">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" /> {t("page.badges.detail.back2")}
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { badge, requirements = [] } = badgeData ?? {};
  const levelKey = badge?.level_code?.charAt(0) ?? "";
  const levelColor = LEVEL_COLORS[levelKey] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Voltar */}
        <motion.div {...fadeIn} transition={{ delay: 0.0 }}>
          <Link
            href="/badges"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("page.badges.detail.back")}
          </Link>
        </motion.div>

        {/* Header do badge */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <Card className="border border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Ícone + info */}
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-primary">{badge?.level_code ?? "?"}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h1 className="text-xl font-bold text-foreground">{badge?.name}</h1>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelColor}`}>
                        {levelKey ? t(`level.${levelKey}`) : badge?.level_name}
                      </span>
                    </div>
                    {badge?.description && (
                      <p className="text-sm text-muted-foreground max-w-xl">{badge.description}</p>
                    )}
                    {/* Tags de contexto */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {badge?.area_name && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                          📁 {badge.area_name}
                        </span>
                      )}
                      {badge?.service_line_name && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                          🏢 {badge.service_line_name}
                        </span>
                      )}
                      {badge?.learning_path_name && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                          📚 {badge.learning_path_name}
                        </span>
                      )}
                      {badge?.points > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                          <Zap className="h-3 w-3" />
                          {badge.points} {t("page.badges.detail.points")}
                        </span>
                      )}
                      {badge?.has_expiration && badge?.valid_days && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                          <Clock className="h-3 w-3" />
                          {t("page.badges.detail.validity")} {badge.valid_days} {t("page.badges.detail.days")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botão candidatura — apenas para consultores */}
                {isConsultant && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      onClick={handleApply}
                      disabled={creating}
                      className="gap-2 min-w-[160px]"
                    >
                      {creating
                        ? <><RefreshCw className="h-4 w-4 animate-spin" /> {t("page.badges.detail.applying")}</>
                        : <><Send className="h-4 w-4" /> {t("page.badges.detail.apply")}</>}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      {t("page.badges.detail.noLevels")}
                    </p>
                  </div>
                )}
              </div>

              {/* Erro de candidatura */}
              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Requisitos */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                {t("page.badges.detail.reqTitle")} ({requirements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requirements.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  {t("page.badges.detail.noReq")}
                </p>
              ) : (
                <div className="space-y-4">
                  {requirements.map((req: any, i: number) => (
                    <motion.div
                      key={req.id}
                      {...fadeIn}
                      transition={{ delay: 0.06 * i }}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-sm text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">
                            {req.code ? tOrDefault(`req.${req.code}.title`, req.title) : req.title}
                          </h3>
                          {req.code && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                              {req.code}
                            </span>
                          )}
                        </div>
                        {req.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {req.code ? tOrDefault(`req.${req.code}.desc`, req.description) : req.description}
                          </p>
                        )}
                        {req.evidence_instructions && (
                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70">
                            <FileText className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-medium text-amber-800">{t("page.badges.detail.evidence")} </span>
                              <span className="text-xs text-amber-700">
                                {req.code ? tOrDefault(`req.${req.code}.evidence`, req.evidence_instructions) : req.evidence_instructions}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to action final — apenas para consultores */}
        {requirements.length > 0 && isConsultant && (
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div>
                <p className="text-sm font-medium text-foreground">{t("page.badges.detail.ctaTitle")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("page.badges.detail.ctaSub")}
                </p>
              </div>
              <Button onClick={handleApply} disabled={creating} size="sm" className="gap-2 shrink-0">
                {creating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {creating ? t("page.badges.detail.applying") : t("page.badges.detail.apply")}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
