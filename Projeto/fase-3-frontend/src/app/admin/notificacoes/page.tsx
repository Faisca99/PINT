"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, RefreshCw, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const NOTIFICATION_EVENTS = [
  { key: "application_submitted", label: "Candidatura submetida", desc: "Notifica TM quando consultor submete" },
  { key: "application_forwarded", label: "Candidatura encaminhada", desc: "Notifica SLL quando TM valida" },
  { key: "application_approved", label: "Badge aprovado", desc: "Notifica consultor quando SLL aprova" },
  { key: "application_rejected", label: "Candidatura rejeitada", desc: "Notifica consultor quando SLL rejeita" },
  { key: "application_send_back", label: "Candidatura devolvida", desc: "Notifica consultor quando é devolvida" },
  { key: "badge_expiring", label: "Badge a expirar", desc: "Notifica consultor 30 dias antes de expirar" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AdminNotificacoesPage() {
  const [configs, setConfigs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/admin/config/notifications")
      .then((r) => setConfigs(r.data ?? {}))
      .catch(() => {
        // Default: todos activos
        const defaults: Record<string, boolean> = {};
        NOTIFICATION_EVENTS.forEach((e) => { defaults[e.key] = true; });
        setConfigs(defaults);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await api.post("/admin/config/notifications", configs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Erro ao guardar configurações.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-accent" /> Configuração de Notificações
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ativa ou desativa os tipos de notificações enviadas pela plataforma
          </p>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Eventos de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {loading ? (
                <div className="p-4 text-center"><RefreshCw className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
              ) : NOTIFICATION_EVENTS.map((event) => (
                <div key={event.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-foreground">{event.label}</div>
                    <div className="text-xs text-muted-foreground">{event.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configs[event.key] ?? true}
                      onChange={(e) => setConfigs((p) => ({ ...p, [event.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Button onClick={handleSave} className="w-full gap-2">
            {saved ? "Guardado ✓" : <><Save className="h-4 w-4" />Guardar Configurações</>}
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
