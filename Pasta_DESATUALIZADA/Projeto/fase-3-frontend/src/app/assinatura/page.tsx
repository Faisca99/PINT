"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface UserBadge {
  id: number;
  badge_name: string;
  level_code: string | null;
  area_name: string | null;
  awarded_at: string;
  public_token: string | null;
  is_published: boolean;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AssinaturaPage() {
  const { user } = useUser();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [maxBadges, setMaxBadges] = useState(3);
  const [customTitle, setCustomTitle] = useState("");
  const [showPoints, setShowPoints] = useState(true);
  const [layout, setLayout] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    api.get("/me/badges")
      .then((r) => setBadges((r.data ?? []).filter((b: UserBadge) => b.is_published)))
      .finally(() => setLoading(false));
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://softinsa.pt/badges";
  const selectedBadges = badges.slice(0, maxBadges);

  const generateHtml = () => {
    const title = customTitle || "🏅 Badges Certificados";
    const galleryUrl = `${origin}/galeria/${user?.id}`;

    const badgeItems = selectedBadges.map((b) => {
      const verifyUrl = b.public_token ? `${origin}/verify/${b.public_token}` : "#";
      const label = `${b.level_code ?? "?"} · ${b.badge_name}${showPoints && b.points > 0 ? ` (${b.points}pts)` : ""}`;
      return `<a href="${verifyUrl}" target="_blank" style="text-decoration:none;display:inline-block;margin:${layout === "horizontal" ? "0 4px 4px 0" : "0 0 4px 0"}">
        <span style="background:#6366f1;color:#fff;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;font-family:Arial,sans-serif">${label}</span>
      </a>`;
    }).join(layout === "horizontal" ? "" : "<br>");

    return `<!-- Softinsa Badges Signature -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif">
  <tr>
    <td style="padding-bottom:8px">
      <strong style="font-size:14px;color:#1e293b">${user?.name ?? ""}</strong><br>
      <span style="font-size:12px;color:#64748b">${user?.area ?? ""} · Softinsa</span>
    </td>
  </tr>
  <tr>
    <td>
      <p style="font-size:11px;color:#64748b;margin:0 0 6px 0;font-family:Arial,sans-serif">${title}</p>
      <div>${badgeItems}</div>
      <div style="margin-top:6px">
        <a href="${galleryUrl}" target="_blank" style="font-size:10px;color:#6366f1">Ver galeria completa →</a>
      </div>
    </td>
  </tr>
</table>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateHtml());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Erro ao copiar. Seleciona o texto manualmente.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6 text-accent" />
            Assinatura de Email com Badges
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gera o HTML da tua assinatura de email com os badges publicados
          </p>
        </motion.div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
          </div>
        ) : badges.length === 0 ? (
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Precisas de ter badges publicados para gerar a assinatura.</p>
              <p className="text-xs mt-1">Vai a "Meus Badges" e publica os teus badges primeiro.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Configuração */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Configuração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Nº máximo de badges</label>
                      <select value={maxBadges} onChange={(e) => setMaxBadges(Number(e.target.value))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} badge{n !== 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Layout dos badges</label>
                      <select value={layout} onChange={(e) => setLayout(e.target.value as any)}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="horizontal">Horizontal (linha)</option>
                        <option value="vertical">Vertical (coluna)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Título personalizado <span className="text-muted-foreground font-normal">(opcional)</span>
                    </label>
                    <input type="text" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="🏅 Badges Certificados"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showPoints} onChange={(e) => setShowPoints(e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm text-foreground">Mostrar pontos em cada badge</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBadges.map((b) => (
                      <span key={b.id} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        {b.level_code} · {b.badge_name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pré-visualização */}
            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Pré-visualização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="mb-2">
                      <strong className="text-sm text-gray-800">{user?.name}</strong><br />
                      <span className="text-xs text-gray-500">{user?.area} · Softinsa</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">🏅 Badges Certificados:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedBadges.map((b) => (
                          <span key={b.id} className="inline-block bg-indigo-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            {b.level_code} · {b.badge_name}
                          </span>
                        ))}
                      </div>
                      <div className="mt-1.5 text-xs text-indigo-500">Ver galeria completa</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* HTML gerado */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="border border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Código HTML</CardTitle>
                    <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copiado!" : "Copiar HTML"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted rounded-lg p-4 text-xs text-foreground overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                    {generateHtml()}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-3">
                    Cola este HTML nas definições de assinatura do teu cliente de email (ex: Outlook, Gmail em HTML mode).
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
