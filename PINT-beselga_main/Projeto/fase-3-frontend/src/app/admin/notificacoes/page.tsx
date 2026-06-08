"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, RefreshCw, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t } from "@/lib/i18n";

const NOTIFICATION_EVENT_KEYS = [
  "application_submitted",
  "application_forwarded",
  "application_approved",
  "application_rejected",
  "application_send_back",
  "badge_expiring",
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
        NOTIFICATION_EVENT_KEYS.forEach((k) => { defaults[k] = true; });
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
      alert(t("admin.notif.errSave"));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-accent" /> {t("admin.notif.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("admin.notif.sub")}
          </p>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("admin.notif.events")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {loading ? (
                <div className="p-4 text-center"><RefreshCw className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
              ) : NOTIFICATION_EVENT_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-foreground">{t(`admin.notif.${key}.label`)}</div>
                    <div className="text-xs text-muted-foreground">{t(`admin.notif.${key}.desc`)}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configs[key] ?? true}
                      onChange={(e) => setConfigs((p) => ({ ...p, [key]: e.target.checked }))}
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
            {saved ? t("admin.notif.savedCheck") : <><Save className="h-4 w-4" />{t("admin.notif.saveConfig")}</>}
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
