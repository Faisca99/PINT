"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, PlusCircle, RefreshCw, X, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface RgpdPolicy { id: number; version: string; content: string; is_current: boolean; effective_from: string; created_at: string; }
const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AdminRgpdPage() {
  const [policies, setPolicies] = useState<RgpdPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ version: "", content: "", effective_from: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = () => {
    setLoading(true);
    api.get("/admin/rgpd").then((r) => setPolicies(r.data ?? [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.version || !form.content) { setError("Versão e conteúdo são obrigatórios."); return; }
    setSaving(true);
    setError(null);
    try {
      await api.post("/admin/rgpd", form);
      setShowForm(false);
      setForm({ version: "", content: "", effective_from: new Date().toISOString().slice(0, 10) });
      fetchPolicies();
    } catch { setError("Erro ao criar política."); }
    finally { setSaving(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-accent" /> Políticas RGPD
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Gerir as políticas de privacidade da plataforma</p>
            </div>
            <Button onClick={() => { setShowForm(true); setError(null); }} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Nova Política
            </Button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div {...fadeIn}>
            <Card className="border border-primary/30 shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Nova Política RGPD</CardTitle>
                  <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Versão</label>
                      <input type="text" value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))}
                        placeholder="ex: 2.0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Data de entrada em vigor</label>
                      <input type="date" value={form.effective_from} onChange={(e) => setForm((p) => ({ ...p, effective_from: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Conteúdo da Política</label>
                    <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                      rows={8} placeholder="Texto completo da política de privacidade..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                  </div>
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                    ⚠️ Ao criar uma nova política, a versão atual será marcada como inativa.
                  </p>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      {saving ? "A criar..." : "Publicar Política"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mx-auto" /></div>
          ) : (
            <div className="space-y-3">
              {policies.map((p, i) => (
                <Card key={p.id} className={`border shadow-sm ${p.is_current ? "border-green-200 bg-green-50/30" : "border-border opacity-70"}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {p.is_current && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                        <span className="font-semibold text-foreground">Versão {p.version}</span>
                        {p.is_current && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Atual</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">Em vigor desde {new Date(p.effective_from).toLocaleDateString("pt-PT")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">{p.content}</p>
                  </CardContent>
                </Card>
              ))}
              {policies.length === 0 && (
                <Card className="border border-border">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Sem políticas RGPD definidas.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
