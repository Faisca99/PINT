"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Award, XCircle, ShieldCheck, RefreshCw, Calendar, User } from "lucide-react";
import { api } from "@/lib/api";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Badge não encontrado</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Este link de verificação é inválido ou o badge foi removido. Contacta a Softinsa para mais informações.
        </p>
        <a href="https://www.softinsa.pt" className="text-sm text-primary hover:underline">
          www.softinsa.pt
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header Softinsa */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-foreground mb-1">SOFTINSA</div>
          <p className="text-sm text-muted-foreground">Plataforma de Badges Digitais</p>
        </div>

        {/* Card principal */}
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Faixa de verificação */}
          <div className={`px-6 py-4 flex items-center gap-3 ${isExpired ? "bg-red-500" : "bg-green-600"}`}>
            <ShieldCheck className="h-6 w-6 text-white shrink-0" />
            <div>
              <div className="text-white font-semibold text-sm">
                {isExpired ? "Badge Expirado" : "Badge Verificado ✓"}
              </div>
              <div className="text-white/80 text-xs">
                {isExpired
                  ? "Este badge expirou mas foi genuinamente emitido pela Softinsa"
                  : "Este badge foi genuinamente emitido pela Softinsa"}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Badge info */}
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary">{data?.level_code ?? "?"}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{data?.badge_name}</h2>
                {data?.level_name && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Nível {data.level_code} — {data.level_name}
                  </span>
                )}
                {data?.area_name && (
                  <p className="text-sm text-muted-foreground mt-1">{data.area_name} · {data.service_line_name}</p>
                )}
              </div>
            </div>

            {data?.badge_description && (
              <p className="text-sm text-muted-foreground">{data.badge_description}</p>
            )}

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Atribuído a:</span>
                <span className="font-semibold text-foreground">{data?.consultant_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Data de atribuição:</span>
                <span className="font-medium text-foreground">
                  {data?.awarded_at ? new Date(data.awarded_at).toLocaleDateString("pt-PT") : "—"}
                </span>
              </div>
              {data?.expires_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Válido até:</span>
                  <span className={`font-medium ${isExpired ? "text-red-600" : "text-foreground"}`}>
                    {new Date(data.expires_at).toLocaleDateString("pt-PT")}
                    {isExpired && " (Expirado)"}
                  </span>
                </div>
              )}
              {data && data.points_awarded > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span className="text-muted-foreground">Pontos atribuídos:</span>
                  <span className="font-medium text-yellow-600">{data.points_awarded} pts</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-xs text-green-700">
                Verificado em {new Date().toLocaleString("pt-PT")} · Emitido pela Softinsa
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Plataforma de Badges Digitais · <a href="https://www.softinsa.pt" className="hover:underline">softinsa.pt</a>
        </p>
      </div>
    </div>
  );
}
