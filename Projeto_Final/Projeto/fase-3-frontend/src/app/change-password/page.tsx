"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck, ChevronRight } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import { AuthHero } from "@/components/AuthHero";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, login } = useUser();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("A password deve ter pelo menos 6 caracteres."); return; }
    if (password !== confirm) { setError("As passwords não coincidem."); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/change-password", { password });
      // Atualizar o user em localStorage sem mustChangePassword
      if (user) {
        login({ ...user, mustChangePassword: false });
      }
      router.replace("/");
    } catch {
      setError("Erro ao alterar a password. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — Hero partilhado */}
      <AuthHero
        title="Protege a tua"
        highlight="conta"
        subtitle="É a tua primeira entrada. Por segurança, define uma nova password antes de continuares."
      />

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

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Alterar Password</h1>
              <p className="text-muted-foreground text-sm">Define uma nova password para continuar.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nova Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Repete a password"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-primary-foreground gradient-primary hover:opacity-90 focus:outline-none disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Definir Nova Password <ChevronRight className="h-4 w-4" /></>}
          </button>
        </form>
        </motion.div>
      </div>
    </div>
  );
}
