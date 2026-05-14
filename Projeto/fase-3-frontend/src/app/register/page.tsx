"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Area { id: number; name: string; code: string; service_line_name: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "", area_id: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/auth/areas")
      .then((r) => setAreas(r.data ?? []))
      .catch((e) => console.error("Erro ao carregar áreas:", e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("A password deve ter pelo menos 6 caracteres."); return; }
    if (form.password !== form.confirm) { setError("As passwords não coincidem."); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        area_id: form.area_id ? Number(form.area_id) : undefined,
      });
      router.push("/login?registered=1");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg === "Email já registado" ? "Este email já está registado." : "Erro ao criar conta. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 w-full">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-card border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glow">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground text-sm mt-1">Regista-te na plataforma Softinsa Badges</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <input type="text" required value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Nome Sobrenome" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email corporativo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <input type="email" required value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="nome@softinsa.pt" />
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Área preferencial <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <select value={form.area_id} onChange={(e) => setForm((p) => ({ ...p, area_id: e.target.value }))}
                className="w-full appearance-none bg-background border border-border text-foreground rounded-lg px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">— Seleciona a tua área —</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Os badges da tua área serão mostrados em destaque no dashboard.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input type={showPass ? "text" : "password"} required value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="pl-10 pr-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Mínimo 6 caracteres" />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input type="password" required value={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Repete a password" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-primary-foreground gradient-primary hover:opacity-90 focus:outline-none disabled:opacity-50 transition-all mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "A criar conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já tens conta?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
