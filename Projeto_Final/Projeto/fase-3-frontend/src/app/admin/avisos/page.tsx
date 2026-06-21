"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, PlusCircle, RefreshCw, AlertCircle, X, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t, formatDate } from "@/lib/i18n";

interface Notice {
  id: number;
  title: string;
  content: string;
  target_roles: string[] | null;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

const ROLE_CODES = ["consultant", "talent_manager", "service_line_leader", "admin"];
const roleLabel = (code: string) => t(`admin.role.${code}`);

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const EMPTY = { title: "", content: "", starts_at: new Date().toISOString().slice(0, 10), ends_at: "", target_roles: [] as string[] };

export default function AdminAvisosPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    try { const r = await api.get("/admin/notices"); setNotices(r.data ?? []); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const toggleRole = (role: string) =>
    setForm((p) => ({
      ...p,
      target_roles: p.target_roles.includes(role)
        ? p.target_roles.filter((r) => r !== role)
        : [...p.target_roles, role],
    }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.starts_at) { setError(t("admin.notices.errRequired")); return; }
    setSaving(true);
    setError(null);
    try {
      await api.post("/admin/notices", {
        title: form.title, content: form.content,
        starts_at: form.starts_at,
        ends_at: form.ends_at || undefined,
        target_roles: form.target_roles.length ? form.target_roles : undefined,
      });
      setShowModal(false);
      setForm(EMPTY);
      fetchNotices();
    } catch { setError(t("admin.notices.errCreate")); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await api.patch(`/admin/notices/${id}/status`, { active });
      setNotices((prev) => prev.map((n) => n.id === id ? { ...n, is_active: active } : n));
    } catch { alert(t("admin.notices.errToggle")); }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(t("admin.notices.confirmDelete").replace("{title}", title))) return;
    try {
      await api.delete(`/admin/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch { alert(t("admin.notices.errDelete")); }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6 text-accent" /> {t("admin.notices.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{t("admin.notices.sub")}</p>
            </div>
            <Button onClick={() => { setForm(EMPTY); setError(null); setShowModal(true); }} className="gap-2">
              <PlusCircle className="h-4 w-4" /> {t("admin.notices.new")}
            </Button>
          </div>
        </motion.div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{t("admin.notices.new")}</h2>
                <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("admin.notices.startDate")}</label>
                    <input type="date" value={form.starts_at} onChange={(e) => setForm((p) => ({ ...p, starts_at: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("admin.notices.endDate")}</label>
                    <input type="date" value={form.ends_at} onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("admin.notices.targetRoles")}</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_CODES.map((code) => (
                      <button key={code} type="button" onClick={() => toggleRole(code)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.target_roles.includes(code) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}>
                        {roleLabel(code)}
                      </button>
                    ))}
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? t("admin.struct.creating") : t("admin.notices.publish")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de avisos */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{loading ? t("admin.common.loading") : `${notices.length} ${notices.length !== 1 ? t("admin.notices.countPlural") : t("admin.notices.countSingular")}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
              ) : notices.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("admin.notices.empty")}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notices.map((n, i) => (
                    <motion.div key={n.id} {...fadeIn} transition={{ delay: 0.04 * i }} className="px-6 py-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold text-foreground">{n.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {n.is_active ? t("admin.badges.active") : t("admin.badges.inactive")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{n.content}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>📅 {formatDate(n.starts_at)}{n.ends_at ? ` → ${formatDate(n.ends_at)}` : ` ${t("admin.notices.noEnd")}`}</span>
                          {n.target_roles?.length ? (
                            <span>👥 {n.target_roles.map((r) => roleLabel(r)).join(", ")}</span>
                          ) : (
                            <span>👥 {t("admin.notices.allRoles")}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => handleToggle(n.id, !n.is_active)}
                          className={`gap-1.5 text-xs ${n.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                          {n.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          {n.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(n.id, n.title)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title={t("admin.notices.remove")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
