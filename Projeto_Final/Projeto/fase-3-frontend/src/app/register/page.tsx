"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Mail, Lock, ChevronRight, Eye, EyeOff, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import { AuthHero } from "@/components/AuthHero";
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
  const [attempted, setAttempted] = useState(false);

  const inv = (key: "full_name" | "email" | "password" | "confirm") =>
    attempted && !form[key].trim();

  useEffect(() => {
    api.get("/auth/areas")
      .then((r) => setAreas(r.data ?? []))
      .catch((e) => console.error("Erro ao carregar áreas:", e));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (!form.full_name.trim() || !form.email.trim() || !form.password.trim() || !form.confirm.trim()) {
      setError("Preenche os campos obrigatórios assinalados."); return;
    }
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

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — Hero partilhado */}
      <AuthHero
        title="Inicia a tua"
        highlight="jornada técnica"
        subtitle="Regista-te na plataforma de badges digitais da Softinsa e começa a evidenciar as tuas competências profissionais."
      />

      {/* Painel direito — Formulário */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <SoftinsaLogo size={36} />
            <span className="text-lg font-bold text-foreground tracking-tight">Softinsa Badges</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Criar conta</h2>
            <p className="text-muted-foreground">Regista-te para começar a tua jornada</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={form.full_name} onChange={set("full_name")}
                  placeholder="Nome Sobrenome" aria-invalid={inv("full_name")}
                  className={`pl-10 h-11 w-full bg-card border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground ${inv("full_name") ? "border-destructive ring-1 ring-destructive/40 focus:ring-destructive/40" : "border-border focus:ring-primary/30"}`} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Email corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={set("email")}
                  placeholder="nome@softinsa.pt" aria-invalid={inv("email")}
                  className={`pl-10 h-11 w-full bg-card border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground ${inv("email") ? "border-destructive ring-1 ring-destructive/40 focus:ring-destructive/40" : "border-border focus:ring-primary/30"}`} />
              </div>
            </div>

            {/* Área */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Área preferencial <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <select value={form.area_id} onChange={set("area_id")}
                  className="h-11 w-full appearance-none bg-card border border-border text-foreground rounded-md px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">— Seleciona a tua área —</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">Os badges da tua área serão mostrados em destaque no dashboard.</p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Mínimo 6 caracteres" aria-invalid={inv("password")}
                  className={`pl-10 pr-10 h-11 w-full bg-card border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground ${inv("password") ? "border-destructive ring-1 ring-destructive/40 focus:ring-destructive/40" : "border-border focus:ring-primary/30"}`} />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Confirmar password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={form.confirm} onChange={set("confirm")}
                  placeholder="Repete a password" aria-invalid={inv("confirm")}
                  className={`pl-10 h-11 w-full bg-card border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground ${inv("confirm") ? "border-destructive ring-1 ring-destructive/40 focus:ring-destructive/40" : "border-border focus:ring-primary/30"}`} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-md gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Criar Conta <ChevronRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">Já tens conta? </span>
            <Link href="/login" className="text-sm font-medium text-accent hover:underline">Entrar</Link>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Acesso restrito a colaboradores Softinsa</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
