"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, ArrowLeft, ChevronRight, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import Link from "next/link";
import { api } from "@/lib/api";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data?.reset_token) setToken(res.data.reset_token);
      setStep("reset");
    } catch {
      setError("Erro ao processar o pedido. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("As passwords não coincidem."); return; }
    if (password.length < 6) { setError("A password deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", { token, password });
      setStep("done");
    } catch {
      setError("Token inválido ou expirado. Reinicia o processo.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    email: { heading: "Recuperar Password", sub: "Insere o teu email para receberes o link de recuperação" },
    reset: { heading: "Nova Password", sub: "Define a tua nova password de acesso" },
    done: { heading: "Password Redefinida", sub: "A tua password foi atualizada com sucesso" },
  };

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — Hero */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <SoftinsaLogo size={40} />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">Softinsa Badges</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-lg"
          >
            <h1 className="text-5xl font-bold text-primary-foreground leading-tight mb-6">
              Recupera o teu
              <br />
              <span className="text-accent">acesso</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              Não percas o acesso às tuas certificações e badges profissionais. Segue os passos para repor a tua password.
            </p>
          </motion.div>

          <div className="flex gap-8">
            {[
              { value: "15+", label: "Badges disponíveis" },
              { value: "3", label: "Service Lines" },
              { value: "5", label: "Níveis de progressão" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel direito — Formulário */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <SoftinsaLogo size={36} />
            <span className="text-lg font-bold text-foreground tracking-tight">Softinsa Badges</span>
          </div>

          {/* Indicador de passos */}
          {step !== "done" && (
            <div className="flex items-center gap-2 mb-8">
              {(["email", "reset"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? "gradient-primary text-primary-foreground" :
                    (s === "email" && step === "reset") ? "bg-green-100 text-green-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {s === "email" && step === "reset" ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  {i === 0 && <div className={`h-px w-8 ${step === "reset" ? "bg-green-300" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{stepTitles[step].heading}</h2>
            <p className="text-muted-foreground">{stepTitles[step].sub}</p>
          </div>

          <AnimatePresence mode="wait">
            {/* Passo 1 — Email */}
            {step === "email" && (
              <motion.form key="email"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRequestReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Email corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@softinsa.pt"
                      className="pl-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Enviar Pedido <ChevronRight className="h-4 w-4" /></>}
                </button>

                <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Login
                </Link>
              </motion.form>
            )}

            {/* Passo 2 — Nova password */}
            {step === "reset" && (
              <motion.form key="reset"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handleResetPassword} className="space-y-5">
                {token && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                    <p className="font-medium mb-1">Modo académico — token de reset:</p>
                    <p className="font-mono break-all">{token}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Token de recuperação</label>
                  <input type="text" required value={token} onChange={(e) => setToken(e.target.value)}
                    placeholder="Cole o token aqui"
                    className="h-11 w-full bg-card border border-border text-foreground rounded-md px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Nova Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Confirmar Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />{error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Redefinir Password <ChevronRight className="h-4 w-4" /></>}
                </button>

                <button type="button" onClick={() => { setStep("email"); setError(null); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
                  Cancelar
                </button>
              </motion.form>
            )}

            {/* Passo 3 — Concluído */}
            {step === "done" && (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    A tua password foi redefinida com sucesso. Podes agora iniciar sessão com a nova password.
                  </p>
                </div>

                <Link href="/login"
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                  Ir para o Login <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Protegido por encriptação end-to-end</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
