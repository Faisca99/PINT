"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, PlusCircle, RefreshCw, X, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t, formatDate } from "@/lib/i18n";

interface Reminder {
  id: number;
  title: string;
  message: string;
  scheduled_for: string;
  sent_at: string | null;
  dismissed_at: string | null;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const EMPTY = { title: "", message: "", scheduled_for: "" };

export default function LembretesPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchReminders = () => {
    setLoading(true);
    api.get("/me/reminders")
      .then((r) => setReminders(r.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReminders(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduled_for) { setFormError(t("page.lembretes.form.errReq")); return; }
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/me/reminders", form);
      setShowForm(false);
      setForm(EMPTY);
      fetchReminders();
    } catch { setFormError(t("page.lembretes.form.errCreate")); }
    finally { setSaving(false); }
  };

  const handleDismiss = async (id: number) => {
    try {
      await api.post(`/me/reminders/${id}/dismiss`);
      setReminders((prev) => prev.map((r) => r.id === id ? { ...r, dismissed_at: new Date().toISOString() } : r));
    } catch { alert(t("page.lembretes.errDismiss")); }
  };

  const now = new Date();
  const active = reminders.filter((r) => !r.dismissed_at);
  const overdue = active.filter((r) => new Date(r.scheduled_for) < now);
  const upcoming = active.filter((r) => new Date(r.scheduled_for) >= now);
  const dismissed = reminders.filter((r) => !!r.dismissed_at);

  const ReminderCard = ({ r }: { r: Reminder }) => {
    const isOverdue = new Date(r.scheduled_for) < now && !r.dismissed_at;
    return (
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${isOverdue ? "border-red-200 bg-red-50/40" : r.dismissed_at ? "border-border opacity-50" : "border-border bg-card"}`}>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isOverdue ? "bg-red-100" : r.dismissed_at ? "bg-muted" : "bg-amber-100"}`}>
          {r.dismissed_at ? <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            : isOverdue ? <AlertTriangle className="h-4 w-4 text-red-600" />
            : <Clock className="h-4 w-4 text-amber-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{r.title}</span>
            <span className={`text-xs shrink-0 ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
              {isOverdue ? "⚠️ " : ""}{formatDate(r.scheduled_for)}
            </span>
          </div>
          {r.message && <p className="text-xs text-muted-foreground mt-0.5">{r.message}</p>}
          {!r.dismissed_at && (
            <button onClick={() => handleDismiss(r.id)}
              className="mt-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> {t("page.lembretes.markDone")}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6 text-accent" /> {t("page.lembretes.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("page.lembretes.sub")}
              </p>
            </div>
            <Button onClick={() => { setShowForm(true); setForm(EMPTY); setFormError(null); }} className="gap-2">
              <PlusCircle className="h-4 w-4" /> {t("page.lembretes.new")}
            </Button>
          </div>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div {...fadeIn} transition={{ delay: 0 }}>
            <Card className="border border-primary/30 shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t("page.lembretes.form.title")}</CardTitle>
                  <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-3">
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder={t("page.lembretes.form.ph1")}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="text" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder={t("page.lembretes.form.ph2")}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="flex gap-3">
                    <input type="date" value={form.scheduled_for} onChange={(e) => setForm((p) => ({ ...p, scheduled_for: e.target.value }))}
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <Button type="submit" disabled={saving} className="gap-2">
                      {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                      {saving ? t("page.lembretes.form.creating") : t("page.lembretes.form.create")}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t("btn.cancel")}</Button>
                  </div>
                  {formError && <p className="text-xs text-destructive">{formError}</p>}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
          </div>
        ) : (
          <>
            {overdue.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                <h2 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> {t("page.lembretes.overdue")} ({overdue.length})
                </h2>
                <div className="space-y-2">{overdue.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
              </motion.div>
            )}

            {upcoming.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
                <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" /> {t("page.lembretes.upcoming")} ({upcoming.length})
                </h2>
                <div className="space-y-2">{upcoming.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
              </motion.div>
            )}

            {active.length === 0 && dismissed.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">{t("page.lembretes.empty")}</p>
              </div>
            )}

            {dismissed.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> {t("page.lembretes.done")} ({dismissed.length})
                </h2>
                <div className="space-y-2">{dismissed.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
