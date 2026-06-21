"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, RefreshCw, AlertCircle, Search, PlusCircle, ShieldCheck, UserX, UserCheck, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t, formatDate } from "@/lib/i18n";

interface UserRow {
  id: number;
  full_name: string;
  email: string;
  account_status: string;
  role: string;
  role_name: string;
  area_name: string | null;
  service_line_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

interface Role { id: number; code: string; name: string; }
interface Area { id: number; name: string; code: string; service_line_name: string; }

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  consultant: "bg-blue-100 text-blue-700",
  talent_manager: "bg-amber-100 text-amber-700",
  service_line_leader: "bg-purple-100 text-purple-700",
};

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AdminUtilizadoresPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role_code: "consultant", area_id: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, areasRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/roles"),
        api.get("/admin/areas"),
      ]);
      setUsers(usersRes.data ?? []);
      setRoles(rolesRes.data ?? []);
      setAreas(areasRes.data ?? []);
    } catch {
      setError(t("admin.users.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      setFormError(t("admin.users.requiredFields"));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/admin/users", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role_code: form.role_code,
        area_id: form.area_id ? Number(form.area_id) : undefined,
      });
      setShowCreate(false);
      setForm({ full_name: "", email: "", password: "", role_code: "consultant", area_id: "" });
      fetchUsers();
    } catch {
      setFormError(t("admin.users.createError"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (userId: number, active: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { active });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, account_status: active ? "active" : "suspended" } : u));
    } catch {
      alert(t("admin.users.statusError"));
    }
  };

  const handleChangeRole = async (userId: number, roleCode: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role_code: roleCode });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: roleCode } : u));
    } catch {
      alert(t("admin.users.roleError"));
    }
  };

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                {t("admin.users.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{t("admin.users.sub")}</p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              {t("admin.users.new")}
            </Button>
          </div>
        </motion.div>

        {/* Modal criar utilizador */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{t("admin.users.new")}</h2>
                <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                {[
                  { label: t("admin.users.fullName"), key: "full_name", type: "text", placeholder: t("admin.users.fullNamePlaceholder") },
                  { label: t("admin.users.email"), key: "email", type: "email", placeholder: "nome@softinsa.pt" },
                  { label: t("admin.users.initialPassword"), key: "password", type: "password", placeholder: "••••••••" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.users.role")}</label>
                  <select
                    value={form.role_code}
                    onChange={(e) => setForm((prev) => ({ ...prev, role_code: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {roles.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.users.prefArea")}</label>
                  <select
                    value={form.area_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, area_id: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">{t("admin.users.noArea")}</option>
                    {areas.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>)}
                  </select>
                </div>
                {formError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {formError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? t("admin.users.creating") : t("admin.users.create")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pesquisa */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("admin.users.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </motion.div>

        {/* Tabela */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{loading ? t("admin.common.loading") : `${filtered.length} ${filtered.length !== 1 ? t("admin.users.countPlural") : t("admin.users.countSingular")}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {[t("admin.users.col.user"), t("admin.users.col.role"), t("admin.users.col.area"), t("admin.users.col.status"), t("admin.users.col.lastLogin"), t("admin.users.col.actions")].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((user, i) => (
                        <motion.tr key={user.id} {...fadeIn} transition={{ delay: 0.03 * i }} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-primary">
                                  {user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{user.full_name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role ?? "consultant"}
                              onChange={(e) => handleChangeRole(user.id, e.target.value)}
                              className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}
                            >
                              {roles.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{user.area_name ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.account_status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {user.account_status === "active" ? t("admin.users.active") : t("admin.users.suspended")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {user.last_login_at ? formatDate(user.last_login_at) : t("admin.users.never")}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleStatus(user.id, user.account_status !== "active")}
                              className={`gap-1.5 text-xs ${user.account_status === "active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                            >
                              {user.account_status === "active"
                                ? <><UserX className="h-3.5 w-3.5" />{t("admin.users.suspend")}</>
                                : <><UserCheck className="h-3.5 w-3.5" />{t("admin.users.activate")}</>}
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
