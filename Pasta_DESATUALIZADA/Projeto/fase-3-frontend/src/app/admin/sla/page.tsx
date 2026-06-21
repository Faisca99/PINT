"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer, PlusCircle, RefreshCw, ToggleLeft, ToggleRight, X, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface SlaPolicy { id: number; team_type: string; limit_hours: number; warning_at_percent: number; is_active: boolean; created_by_name: string; }

const TEAM_LABELS: Record<string, string> = { talent_manager: "Talent Manager", service_line_leader: "Service Line Leader" };
const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AdminSlaPage() {
  const [slas, setSlas] = useState<SlaPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ team_type: "talent_manager", limit_hours: "48", warning_at_percent: "80" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlas = () => {
    setLoading(true);
    api.get("/admin/slas").then((r) => setSlas(r.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlas(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await api.post("/admin/slas", { team_type: form.team_type, limit_hours: Number(form.limit_hours), warning_at_percent: Number(form.warning_at_percent) });
      setShowForm(false);
      fetchSlas();
    } catch { setError("Erro ao criar SLA."); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await api.patch(`/admin/slas/${id}/status`, { active });
      setSlas((prev) => prev.map((s) => s.id === id ? { ...s, is_active: active } : s));
    } catch { alert("Erro ao alterar."); }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Timer className="h-6 w-6 text-accent" /> Gestão de SLAs
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Define os tempos limite de resposta para Talent Managers e Service Line Leaders
              </p>
            </div>
            <Button onClick={() => { setShowForm(true); setError(null); }} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Novo SLA
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div {...fadeIn}>
            <Card className="border border-primary/30 shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Novo SLA</CardTitle>
                  <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Equipa</label>
                      <select value={form.team_type} onChange={(e) => setForm((p) => ({ ...p, team_type: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="talent_manager">Talent Manager</option>
                        <option value="service_line_leader">Service Line Leader</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Limite (horas)</label>
                      <input type="number" min="1" value={form.limit_hours}
                        onChange={(e) => setForm((p) => ({ ...p, limit_hours: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Alerta em (%)</label>
                      <input type="number" min="1" max="99" value={form.warning_at_percent}
                        onChange={(e) => setForm((p) => ({ ...p, warning_at_percent: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ex: limite 48h com alerta em 80% → notificação ao atingir 38.4h sem resposta.
                  </p>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      {saving ? "A criar..." : "Criar SLA"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{loading ? "A carregar..." : `${slas.length} política${slas.length !== 1 ? "s" : ""} SLA`}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center"><RefreshCw className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
              ) : slas.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Timer className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sem políticas SLA definidas.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {slas.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{TEAM_LABELS[s.team_type] ?? s.team_type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {s.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Limite: <strong>{s.limit_hours}h</strong> · Alerta a {s.warning_at_percent}% ({Math.round(s.limit_hours * s.warning_at_percent / 100)}h)
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleToggle(s.id, !s.is_active)}
                        className={`gap-1.5 text-xs ${s.is_active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                        {s.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        {s.is_active ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <div className="flex items-start gap-2 p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Como funcionam os SLAs</p>
              <p>Quando uma candidatura ultrapassa o limite de horas sem resposta, o sistema regista o incumprimento em `sla_breach_logs` e pode notificar a equipa responsável por Teams/Slack (se configurado).</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
