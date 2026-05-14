"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
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
      // Em modo académico o token é devolvido diretamente
      if (res.data?.reset_token) {
        setToken(res.data.reset_token);
      }
      setStep("reset");
    } catch {
      setError("Erro ao processar o pedido. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("As passwords não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A password deve ter pelo menos 6 caracteres.");
      return;
    }
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 w-full">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-card border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glow">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === "email" && "Recuperar Password"}
            {step === "reset" && "Nova Password"}
            {step === "done" && "Password Redefinida"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            {step === "email" && "Insere o teu email corporativo para recuperar o acesso"}
            {step === "reset" && "Define a tua nova password"}
            {step === "done" && "A tua password foi redefinida com sucesso"}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="nome@softinsa.pt"
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "A processar..." : "Enviar Pedido"}
            </button>

            <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao Login
            </Link>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {token && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <p className="font-medium mb-1">Modo académico — token de reset:</p>
                <p className="font-mono break-all">{token}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Token de recuperação</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Cole o token aqui"
              />
            </div>

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
                  placeholder="••••••••"
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
                  placeholder="••••••••"
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "A redefinir..." : "Redefinir Password"}
            </button>

            <button type="button" onClick={() => { setStep("email"); setError(null); }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center">
              Cancelar
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              A tua password foi redefinida com sucesso. Podes agora iniciar sessão com a nova password.
            </p>
            <Link href="/login"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-all">
              Ir para o Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
