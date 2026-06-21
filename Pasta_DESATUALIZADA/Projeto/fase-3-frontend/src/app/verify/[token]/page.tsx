"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award, CheckCircle2, Shield, Calendar, Star,
  RefreshCw, XCircle, ExternalLink, AlertTriangle, User, Download, Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import { downloadCertificate } from "@/lib/certificate";

interface BadgeVerification {
  consultant_name: string;
  badge_name: string;
  badge_description: string;
  badge_type: string;
  points: number;
  level_code: string | null;
  level_name: string | null;
  area_name: string | null;
  service_line_name: string | null;
  awarded_at: string;
  expires_at: string | null;
  points_awarded: number;
}

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  A: { label: "Júnior",               color: "bg-success/10 text-success" },
  B: { label: "Intermédio",           color: "bg-info/10 text-info" },
  C: { label: "Sénior",              color: "bg-warning/10 text-warning" },
  D: { label: "Especialista",         color: "bg-primary/10 text-primary" },
  E: { label: "Líder de Conhecimento", color: "bg-destructive/10 text-destructive" },
};

export default function VerifyBadgePage() {
  const params = useParams();
  const [data, setData] = useState<BadgeVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/me/verify/${params.token}`)
      .then((r) => setData(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.token]);

  const isExpired = data?.expires_at && new Date(data.expires_at) < new Date();
  const levelKey  = data?.level_code?.charAt(0) ?? "A";
  const tier      = TIER_CONFIG[levelKey] ?? TIER_CONFIG.A;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ── Não encontrado ── */
  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 gap-5 text-center">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">Badge não encontrado</h1>
          <p className="text-muted-foreground text-sm max-w-sm">
            Este link de verificação é inválido ou o badge foi removido.
          </p>
        </div>
        <a href="https://www.softinsa.pt"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> www.softinsa.pt
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">

      {/* Topo — Softinsa */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2.5 mb-8"
      >
        <SoftinsaLogo size={28} />
        <span className="font-bold text-foreground tracking-tight">Softinsa Badges</span>
      </motion.div>

      {/* Card — estilo idêntico ao template MyBadgesPage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border shadow-card hover:shadow-card-hover transition-all overflow-hidden">

          {/* Faixa de cor no topo — igual ao template */}
          <div className={`h-2 ${isExpired ? "bg-warning" : "gradient-primary"}`} />

          <CardContent className="p-6">
            {/* Badge icon + info — igual ao template */}
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                <Award className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {data?.badge_name}
                </h3>
                {(data?.area_name || data?.service_line_name) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {[data.area_name, data.service_line_name].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {data?.level_name && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tier.color}`}>
                      {tier.label}
                    </span>
                  )}
                  {data && data.points_awarded > 0 && (
                    <span className="flex items-center gap-1 text-xs text-warning font-medium">
                      <Star className="h-3 w-3" />
                      {data.points_awarded} pts
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes — espaçamento igual ao template */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Atribuído a{" "}
                  <span className="font-semibold text-foreground">{data?.consultant_name}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Obtido a{" "}
                  {data?.awarded_at
                    ? new Date(data.awarded_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })
                    : "—"}
                </span>
              </div>

              {data?.expires_at && (
                <div className={`flex items-center gap-2 text-xs ${isExpired ? "text-warning" : "text-muted-foreground"}`}>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {isExpired ? "⚠ Expirou a " : "Válido até "}
                    {new Date(data.expires_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </div>
              )}

              {/* Verificado — classe text-success igual ao template */}
              {isExpired ? (
                <div className="flex items-center gap-2 text-xs text-warning">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Badge expirado — emitido genuinamente pela Softinsa</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Verificado</span>
                </div>
              )}

              {/* Código — font-mono igual ao template */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{String(params.token).slice(0, 32).toUpperCase()}</span>
              </div>
            </div>

            {/* Botões — igual ao template */}
            <div className="flex gap-2 pt-3 border-t border-border">
              <Button
                variant="outline" size="sm" className="flex-1 text-xs"
                onClick={() => downloadCertificate({
                  consultantName: data?.consultant_name ?? "",
                  badgeName: data?.badge_name ?? "",
                  levelCode: data?.level_code,
                  levelName: data?.level_name,
                  areaName: data?.area_name,
                  serviceLineName: data?.service_line_name,
                  awardedAt: data?.awarded_at ?? new Date().toISOString(),
                  pointsAwarded: data?.points_awarded,
                })}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                PDF
              </Button>
              <Button
                variant="outline" size="sm" className="flex-1 text-xs"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                <a href="https://www.softinsa.pt" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Softinsa
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Verificado em {new Date().toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          {" · "}
          <a href="https://www.softinsa.pt" className="hover:underline" target="_blank" rel="noopener noreferrer">
            softinsa.pt
          </a>
        </p>
      </motion.div>
    </div>
  );
}
