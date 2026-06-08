"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hexagon, Award, RefreshCw, AlertCircle, ExternalLink, CheckCircle2, Globe, X, ShieldCheck, Share2, Download, Clock } from "lucide-react";
import { downloadCertificate } from "@/lib/certificate";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { EXPIRY_WARNING_DAYS } from "@/lib/constants";
import { t, formatDate } from "@/lib/i18n";

interface UserBadge {
  id: number;
  badge_id: number;
  badge_name: string;
  description: string;
  badge_type: string;
  points: number;
  level_code: string | null;
  level_name: string | null;
  area_name: string | null;
  awarded_at: string;
  expires_at: string | null;
  public_token: string | null;
  is_published?: boolean;
}

/** Nº de dias até expirar (negativo = já expirou, null = sem expiração). */
function daysToExpiry(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-purple-100 text-purple-700 border-purple-200",
  E: "bg-red-100 text-red-700 border-red-200",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function MyBadgesPage() {
  const { user } = useUser();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rgpdModal, setRgpdModal] = useState<UserBadge | null>(null);
  const [rgpdAccepted, setRgpdAccepted] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const fetchBadges = () => {
    api.get("/me/badges")
      .then((r) => setBadges(r.data ?? []))
      .catch(() => setError(t("page.myBadges.errorLoad")))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBadges(); }, []);

  const handlePublish = async () => {
    if (!rgpdModal || !rgpdAccepted) return;
    setPublishing(true);
    try {
      await api.post(`/me/badges/${rgpdModal.id}/publish`);
      setBadges((prev) => prev.map((b) => b.id === rgpdModal.id ? { ...b, is_published: true } : b));
      setRgpdModal(null);
      setRgpdAccepted(false);
    } catch {
      alert(t("page.myBadges.errorPublish"));
    } finally {
      setPublishing(false);
    }
  };

  const totalPoints = badges.reduce((s, b) => s + (b.points ?? 0), 0);

  // Badges a expirar dentro da janela de aviso (ainda não expirados)
  const expiringSoon = badges.filter((b) => {
    const d = daysToExpiry(b.expires_at);
    return d !== null && d >= 0 && d <= EXPIRY_WARNING_DAYS;
  });

  return (
    <AppLayout>
      {/* Modal RGPD */}
      {rgpdModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t("page.myBadges.publishTitle")}
              </h2>
              <button onClick={() => { setRgpdModal(null); setRgpdAccepted(false); }}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ao publicar <strong className="text-foreground">{rgpdModal.badge_name}</strong>, este badge ficará visível
              publicamente e verificável por qualquer pessoa através do link único.
            </p>
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground mb-4 max-h-32 overflow-y-auto">
              <p className="font-medium text-foreground mb-1">{t("page.myBadges.rgpdTitle")}</p>
              <p>
                Declaro que consinto no tratamento dos meus dados pessoais para efeitos de certificação,
                publicação e partilha de competências profissionais verificáveis, de acordo com o RGPD
                (Regulamento (UE) 2016/679). Os dados publicados incluem o meu nome e as competências
                certificadas associadas a este badge.
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={rgpdAccepted}
                onChange={(e) => setRgpdAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded"
              />
              <span className="text-sm text-foreground">
                {t("page.myBadges.rgpdAccept")}
              </span>
            </label>
            <div className="flex gap-3">
              <Button onClick={handlePublish} disabled={!rgpdAccepted || publishing} className="flex-1 gap-2">
                {publishing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                {publishing ? t("page.myBadges.publishing") : t("page.myBadges.confirmPublish")}
              </Button>
              <Button variant="outline" onClick={() => { setRgpdModal(null); setRgpdAccepted(false); }}>{t("btn.cancel")}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Hexagon className="h-6 w-6 text-accent" />
                {t("page.myBadges.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{t("page.myBadges.sub")}</p>
            </div>
            {user && (
              <Link href={`/galeria/${user.id}`} target="_blank">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {t("page.myBadges.viewGallery")}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Alerta de expiração (Req. Consultor 21) */}
        {!loading && expiringSoon.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.08 }}>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm mb-2">
                <Clock className="h-4 w-4" />
                {t("page.myBadges.expiringSoon")}
              </div>
              <ul className="space-y-1">
                {expiringSoon.map((b) => {
                  const d = daysToExpiry(b.expires_at)!;
                  return (
                    <li key={b.id} className="flex items-center justify-between text-xs text-orange-800">
                      <span className="font-medium">{b.badge_name}</span>
                      <span>
                        {d === 0 ? t("page.myBadges.expiresToday") : t("page.myBadges.expiresInDays").replace("{n}", String(d))}
                        {b.expires_at && ` · ${formatDate(b.expires_at)}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Award, value: badges.length, label: t("page.myBadges.badgesObtained"), color: "bg-primary/10 text-primary" },
              { icon: null, value: totalPoints, label: t("page.myBadges.totalPoints"), color: "bg-yellow-500/10 text-yellow-600", emoji: "⚡" },
              { icon: CheckCircle2, value: badges.filter((b) => b.is_published).length, label: t("page.myBadges.published"), color: "bg-green-500/10 text-green-600" },
            ].map((s, i) => (
              <Card key={s.label} className="border border-border shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                    {s.emoji ? <span className="text-sm font-bold">{s.emoji}</span> : s.icon && <s.icon className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{loading ? "—" : s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Grid de badges */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              {t("page.myBadges.loading")}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : badges.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="p-12 text-center text-muted-foreground">
                <Hexagon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">{t("page.myBadges.empty")}</p>
                <p className="text-xs mt-1">{t("page.myBadges.emptySub")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge, i) => {
                const levelKey = badge.level_code?.charAt(0) ?? "";
                const levelColor = LEVEL_COLORS[levelKey] ?? "bg-gray-100 text-gray-600 border-gray-200";
                const expDays = daysToExpiry(badge.expires_at);
                const expired = expDays !== null && expDays < 0;
                const expiringSoonCard = expDays !== null && expDays >= 0 && expDays <= EXPIRY_WARNING_DAYS;

                return (
                  <motion.div key={badge.id} {...fadeIn} transition={{ delay: 0.04 * i }}>
                    <Card className={`border shadow-card hover:shadow-card-hover transition-shadow h-full ${expired ? "opacity-60" : "border-border"}`}>
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-lg font-bold text-primary">{badge.level_code ?? "?"}</span>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColor}`}>
                            {badge.level_name ?? badge.badge_type}
                          </span>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-foreground leading-tight mb-1">{badge.badge_name}</h3>
                          {badge.area_name && <p className="text-xs text-muted-foreground mb-1">{badge.area_name}</p>}
                          {badge.description && <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                {expired ? t("page.myBadges.expired") : `${t("page.myBadges.awardedAt")} ${formatDate(badge.awarded_at)}`}
                              </div>
                              {expiringSoonCard && (
                                <div className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  {expDays === 0 ? t("page.myBadges.expiresToday") : t("page.myBadges.expiresInDays").replace("{n}", String(expDays))}
                                </div>
                              )}
                              {badge.points > 0 && (
                                <div className="text-xs font-medium text-yellow-600">+{badge.points} pts</div>
                              )}
                            </div>
                            {badge.public_token && badge.is_published && (
                              <a
                                href={`/verify/${badge.public_token}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                {t("page.myBadges.verify")}
                              </a>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!badge.is_published && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setRgpdModal(badge)}
                                className="flex-1 gap-1.5 text-xs h-7 border-primary/30 text-primary hover:bg-primary/5"
                              >
                                <Globe className="h-3 w-3" />
                                {t("page.myBadges.publish")}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadCertificate({
                                consultantName: user?.name ?? "",
                                badgeName: badge.badge_name,
                                levelCode: badge.level_code,
                                levelName: badge.level_name,
                                areaName: badge.area_name,
                                serviceLineName: null,
                                awardedAt: badge.awarded_at,
                                verifyUrl: badge.public_token
                                  ? `${typeof window !== "undefined" ? window.location.origin : ""}/verify/${badge.public_token}`
                                  : undefined,
                                pointsAwarded: badge.points,
                              })}
                              className={`${badge.is_published ? "w-full" : ""} gap-1.5 text-xs h-7`}
                            >
                              <Download className="h-3 w-3" />
                              {t("page.myBadges.certificate")}
                            </Button>
                          </div>
                          {badge.is_published && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                {t("page.myBadges.publishedVerify")}
                              </div>
                              {badge.public_token && (
                                <a
                                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/verify/${badge.public_token}` : "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-[#0077b5] hover:underline font-medium"
                                >
                                  <Share2 className="h-3 w-3" />
                                  {t("page.myBadges.shareLinkedIn")}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
