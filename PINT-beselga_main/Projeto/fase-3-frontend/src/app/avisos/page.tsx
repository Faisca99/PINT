"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, RefreshCw, Calendar, Users, PlusCircle, X, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser, ROLE_LABELS } from "@/lib/user-context";
import { t, formatDate } from "@/lib/i18n";

// Quem pode criar avisos (Bónus PDF: admin / service line / talent management)
const CAN_MANAGE_ROLES = ["admin", "service_line_leader", "talent_manager"];
const EMPTY_NOTICE = { title: "", content: "", ends_at: "" };

interface Notice {
  id: number;
  title: string;
  content: string;
  target_roles: string[] | null;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AvisosPage() {
  const { user } = useUser();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_NOTICE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = !!user && CAN_MANAGE_ROLES.includes(user.role);

  const fetchNotices = () => {
    if (!user) return;
    setLoading(true);
    api.get(`/admin/notices/active?role=${user.role}`)
      .then((r) => setNotices(r.data ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotices(); }, [user?.role]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setError(t("auth.fillFields")); return; }
    setSaving(true);
    setError(null);
    try {
      await api.post("/admin/notices", {
        title: form.title,
        content: form.content,
        starts_at: new Date().toISOString().slice(0, 10),
        ends_at: form.ends_at || undefined,
      });
      setShowModal(false);
      setForm(EMPTY_NOTICE);
      fetchNotices();
    } catch {
      setError(t("admin.notices.errCreate"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Megaphone className="h-6 w-6 text-accent" />
                {t("page.avisos.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("page.avisos.sub")}
              </p>
            </div>
            {canManage && (
              <Button onClick={() => { setForm(EMPTY_NOTICE); setError(null); setShowModal(true); }} className="gap-2">
                <PlusCircle className="h-4 w-4" /> {t("admin.notices.new")}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Modal de criação (admin / SL / TM) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{t("admin.notices.new")}</h2>
                <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreate} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.notices.titleField")}</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={t("admin.notices.titlePlaceholder")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.notices.content")}</label>
                  <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                    rows={4} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                    placeholder={t("admin.notices.contentPlaceholder")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.notices.endDate")}</label>
                  <input type="date" value={form.ends_at} onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t("admin.notices.publish")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            {t("page.avisos.loading")}
          </div>
        ) : notices.length === 0 ? (
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{t("page.avisos.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <motion.div key={notice.id} {...fadeIn} transition={{ delay: 0.05 * i }}>
                <Card className="border border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary shrink-0" />
                        {notice.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.starts_at)}
                          {notice.ends_at && ` → ${formatDate(notice.ends_at)}`}
                        </span>
                      </div>
                    </div>
                    {notice.target_roles && notice.target_roles.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {t("page.avisos.for")} {notice.target_roles.map((r) => (ROLE_LABELS as any)[r] ?? r).join(", ")}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{notice.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
