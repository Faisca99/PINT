"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, PlusCircle, RefreshCw, AlertCircle, X, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface BadgeRow {
  id: number; code: string; name: string; description: string;
  badge_type: string; points: number; has_expiration: boolean;
  valid_days: number | null; is_active: boolean;
  level_code: string | null; level_name: string | null;
  area_name: string | null; service_line_name: string | null;
}
interface Level { id: number; code: string; name: string; area_name: string; }

const TYPE_LABELS: Record<string, string> = { level: "Nível", special: "Conquista", premium: "Premium" };
const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const EMPTY_FORM = { level_id: "", code: "", name: "", description: "", badge_type: "level", points: "0", has_expiration: false, valid_days: "" };

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBadge, setEditBadge] = useState<BadgeRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, lRes] = await Promise.all([api.get("/admin/badges"), api.get("/admin/levels")]);
      setBadges(bRes.data ?? []);
      setLevels(lRes.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditBadge(null); setForm(EMPTY_FORM); setFormError(null); setShowModal(true); };

  const openEdit = (b: BadgeRow) => {
    setEditBadge(b);
    setForm({ level_id: "", code: b.code, name: b.name, description: b.description ?? "", badge_type: b.badge_type, points: String(b.points), has_expiration: b.has_expiration, valid_days: b.valid_days ? String(b.valid_days) : "" });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) { setFormError("Nome e código são obrigatórios."); return; }
    setSaving(true);
    setFormError(null);
    try {
      if (editBadge) {
        await api.patch(`/admin/badges/${editBadge.id}`, {
          name: form.name, description: form.description || undefined,
          points: Number(form.points), has_expiration: form.has_expiration,
          valid_days: form.has_expiration && form.valid_days ? Number(form.valid_days) : null,
        });
      } else {
        if (!form.level_id) { setFormError("Seleciona um nível."); setSaving(false); return; }
        await api.post("/admin/badges", {
          level_id: Number(form.level_id), code: form.code, name: form.name,
          description: form.description || undefined, badge_type: form.badge_type,
          points: Number(form.points), has_expiration: form.has_expiration,
          valid_days: form.has_expiration && form.valid_days ? Number(form.valid_days) : undefined,
        });
      }
      setShowModal(false);
      fetchData();
    } catch { setFormError("Erro ao guardar badge."); }
    finally { setSaving(false); }
  };

  const handleToggleActive = async (b: BadgeRow) => {
    try {
      await api.patch(`/admin/badges/${b.id}`, { is_active: !b.is_active });
      setBadges((prev) => prev.map((x) => x.id === b.id ? { ...x, is_active: !b.is_active } : x));
    } catch { alert("Erro ao alterar estado."); }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Award className="h-6 w-6 text-accent" /> Gestão de Badges
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Criar e configurar badges, pontos e expiração</p>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Novo Badge
            </Button>
          </div>
        </motion.div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{editBadge ? "Editar Badge" : "Novo Badge"}</h2>
                <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {!editBadge && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Nível</label>
                    <select value={form.level_id} onChange={(e) => setForm((p) => ({ ...p, level_id: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">— Seleciona —</option>
                      {levels.map((l) => <option key={l.id} value={l.id}>{l.code} — {l.area_name} ({l.name})</option>)}
                    </select>
                  </div>
                )}
                {[
                  { label: "Código", key: "code", placeholder: "BDG-LC-A", disabled: !!editBadge },
                  { label: "Nome", key: "name", placeholder: "Bronze — LowCode" },
                  { label: "Descrição", key: "description", placeholder: "Descrição do badge..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} disabled={f.disabled}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                {!editBadge && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
                    <select value={form.badge_type} onChange={(e) => setForm((p) => ({ ...p, badge_type: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="level">Nível</option>
                      <option value="special">Conquista Especial</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Pontos</label>
                  <input type="number" min="0" value={form.points}
                    onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="exp" checked={form.has_expiration}
                    onChange={(e) => setForm((p) => ({ ...p, has_expiration: e.target.checked }))}
                    className="h-4 w-4 rounded" />
                  <label htmlFor="exp" className="text-sm text-foreground">Badge tem data de expiração</label>
                </div>
                {form.has_expiration && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Válido por (dias)</label>
                    <input type="number" min="1" value={form.valid_days}
                      onChange={(e) => setForm((p) => ({ ...p, valid_days: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                )}
                {formError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? "A guardar..." : "Guardar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabela */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{loading ? "A carregar..." : `${badges.length} badge${badges.length !== 1 ? "s" : ""}`}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Badge", "Nível", "Tipo", "Pontos", "Expiração", "Estado", "Ações"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {badges.map((b, i) => (
                        <motion.tr key={b.id} {...fadeIn} transition={{ delay: 0.03 * i }} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-foreground">{b.name}</div>
                            <div className="text-xs text-muted-foreground">{b.code}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            <div>{b.level_code} — {b.level_name}</div>
                            <div>{b.area_name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {TYPE_LABELS[b.badge_type] ?? b.badge_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-yellow-600">{b.points} pts</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {b.has_expiration ? `${b.valid_days} dias` : "Permanente"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {b.is_active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEdit(b)} className="gap-1 text-xs">
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleToggleActive(b)}
                                className={`gap-1 text-xs ${b.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                                {b.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                              </Button>
                            </div>
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
