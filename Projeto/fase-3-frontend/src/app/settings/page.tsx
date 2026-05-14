"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, ChevronDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface Area { id: number; name: string; code: string; service_line_name: string; }

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  const { user, login } = useUser();
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaId, setAreaId] = useState("");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/auth/areas")
      .then((r) => setAreas(r.data ?? []))
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.patch("/auth/profile", {
        full_name: fullName || undefined,
        area_id: areaId ? Number(areaId) : undefined,
      });
      // Actualizar o user no contexto
      if (user) {
        const selectedArea = areas.find((a) => a.id === Number(areaId));
        login({
          ...user,
          name: fullName || user.name,
          area: selectedArea?.name ?? user.area,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erro ao guardar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-accent" />
            Definições de Perfil
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Atualiza as tuas informações pessoais</p>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {/* Info atual */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm">
                  <div className="text-foreground font-medium">{user?.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{user?.email} · {user?.role}</div>
                  {user?.area && <div className="text-muted-foreground text-xs mt-0.5">Área atual: {user.area}</div>}
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-background border border-border text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Nome Sobrenome" />
                </div>

                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Área preferencial
                  </label>
                  {areas.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Sem áreas disponíveis. Verifica se o backend está a correr e se a BD tem áreas inseridas.
                    </p>
                  ) : (
                    <div className="relative">
                      <select value={areaId} onChange={(e) => setAreaId(e.target.value)}
                        className="w-full appearance-none bg-background border border-border text-foreground rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="">— Manter área atual —</option>
                        {areas.map((a) => (
                          <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Os badges da tua área aparecem em destaque no dashboard.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                {saved && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Alterações guardadas com sucesso!
                  </div>
                )}

                <Button type="submit" disabled={saving} className="w-full gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "A guardar..." : "Guardar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info sobre áreas disponíveis */}
        {areas.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Áreas disponíveis na plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {areas.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-sm text-foreground">{a.name}</span>
                      <span className="text-xs text-muted-foreground">{a.service_line_name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
