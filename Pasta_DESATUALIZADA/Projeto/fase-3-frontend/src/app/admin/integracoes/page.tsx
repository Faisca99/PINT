"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plug, RefreshCw, Save, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const PROVIDERS = [
  { key: "teams", label: "Microsoft Teams", icon: "🟦", placeholder: "https://xxx.webhook.office.com/webhookb2/..." },
  { key: "slack",  label: "Slack",          icon: "💬", placeholder: "https://hooks.slack.com/services/..." },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AdminIntegracoesPage() {
  const [configs, setConfigs] = useState<Record<string, { url: string; active: boolean }>>({
    teams: { url: "", active: false },
    slack: { url: "", active: false },
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    api.get("/admin/integrations").then((r) => {
      const map: typeof configs = { teams: { url: "", active: false }, slack: { url: "", active: false } };
      for (const row of r.data ?? []) {
        map[row.provider] = { url: row.config?.webhook_url ?? "", active: row.is_active };
      }
      setConfigs(map);
    }).catch(() => {});
  }, []);

  const handleSave = async (provider: string) => {
    setSaving(provider);
    try {
      await api.post("/admin/integrations", {
        provider,
        webhook_url: configs[provider].url,
        active: configs[provider].active,
      });
      setSaved(provider);
      setTimeout(() => setSaved(null), 2000);
    } catch { alert("Erro ao guardar."); }
    finally { setSaving(null); }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Plug className="h-6 w-6 text-accent" /> Integrações
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configura webhooks para receber notificações no Teams ou Slack quando badges são atribuídos
          </p>
        </motion.div>

        {PROVIDERS.map((p, i) => (
          <motion.div key={p.key} {...fadeIn} transition={{ delay: 0.1 + i * 0.05 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">{p.icon}</span> {p.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">URL do Webhook</label>
                  <input
                    type="url"
                    value={configs[p.key]?.url ?? ""}
                    onChange={(e) => setConfigs((prev) => ({ ...prev, [p.key]: { ...prev[p.key], url: e.target.value } }))}
                    placeholder={p.placeholder}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configs[p.key]?.active ?? false}
                      onChange={(e) => setConfigs((prev) => ({ ...prev, [p.key]: { ...prev[p.key], active: e.target.checked } }))}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-sm text-foreground">Ativar integração</span>
                  </label>
                  <Button size="sm" onClick={() => handleSave(p.key)} disabled={saving === p.key} className="gap-2">
                    {saving === p.key ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : saved === p.key ? (
                      <><CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Guardado!</>
                    ) : (
                      <><Save className="h-3.5 w-3.5" /> Guardar</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Como configurar:</p>
            <p>• <strong>Teams:</strong> Canal → ··· → Conectores → Webhook de Entrada → Criar</p>
            <p>• <strong>Slack:</strong> api.slack.com/apps → Incoming Webhooks → Adicionar Webhook</p>
            <p>Será enviada uma notificação sempre que um badge for atribuído a um consultor.</p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
