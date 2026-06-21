"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Award, ExternalLink, RefreshCw, XCircle, User, Calendar, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { t, formatDate } from "@/lib/i18n";

interface GalleryBadge {
  id: number;
  badge_name: string;
  description: string;
  badge_type: string;
  level_code: string | null;
  level_name: string | null;
  area_name: string | null;
  service_line_name: string | null;
  awarded_at: string;
  expires_at: string | null;
  public_token: string | null;
  points_awarded: number;
}

interface Gallery {
  consultant: { full_name: string; email: string };
  badges: GalleryBadge[];
}

const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-purple-100 text-purple-700 border-purple-200",
  E: "bg-red-100 text-red-700 border-red-200",
};

export default function GaleriaPage() {
  const params = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/me/gallery/${params.userId}`)
      .then((r) => setGallery(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !gallery) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
        <XCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold text-foreground">{t("page.galeria.notFound")}</h1>
        <p className="text-muted-foreground text-center">{t("page.galeria.notFoundSub")}</p>
        <a href="https://www.softinsa.pt" className="text-sm text-primary hover:underline">www.softinsa.pt</a>
      </div>
    );
  }

  const totalPoints = gallery.badges.reduce((s, b) => s + (b.points_awarded ?? 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Softinsa */}
        <div className="text-center mb-10">
          <div className="text-3xl font-bold text-foreground mb-1">SOFTINSA</div>
          <p className="text-sm text-muted-foreground">{t("page.galeria.platform")}</p>
        </div>

        {/* Perfil do consultor */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 mb-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">
              {gallery.consultant.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{gallery.consultant.full_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{gallery.consultant.email}</p>

          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{gallery.badges.length}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("page.galeria.verified")}</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("page.myBadges.totalPoints")}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-green-600">
            <ShieldCheck className="h-4 w-4" />
            {t("page.galeria.verifiedBy")}
          </div>
        </div>

        {/* Grid de badges */}
        {gallery.badges.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>{t("page.galeria.noBadges")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.badges.map((badge) => {
              const levelKey = badge.level_code?.charAt(0) ?? "";
              const levelColor = LEVEL_COLORS[levelKey] ?? "bg-gray-100 text-gray-600 border-gray-200";
              const expired = badge.expires_at && new Date(badge.expires_at) < new Date();

              return (
                <div key={badge.id} className={`bg-card border rounded-2xl shadow-card p-5 flex flex-col ${expired ? "opacity-60" : "border-border"}`}>
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
                    {badge.area_name && <p className="text-xs text-muted-foreground">{badge.area_name}</p>}
                    {badge.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {expired ? (
                        <span className="text-red-600">{t("page.galeria.expiredOn")} {formatDate(badge.expires_at!)}</span>
                      ) : (
                        `${t("page.galeria.awardedOn")} ${formatDate(badge.awarded_at)}`
                      )}
                    </div>
                    {badge.points_awarded > 0 && (
                      <div className="text-xs text-yellow-600 font-medium">+{badge.points_awarded} pts</div>
                    )}
                    {badge.public_token && (
                      <a href={`/verify/${badge.public_token}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                        <ExternalLink className="h-3 w-3" />
                        {t("page.galeria.verify")}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-10">
          {t("page.galeria.platform")} · <a href="https://www.softinsa.pt" className="hover:underline">softinsa.pt</a>
        </p>
      </div>
    </div>
  );
}
