"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useUser, UserRole } from "@/lib/user-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState(() => typeof window !== "undefined" ? localStorage.getItem("pint_saved_email") ?? "" : "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => typeof window !== "undefined" ? !!localStorage.getItem("pint_saved_email") : false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;

      if (rememberMe) {
        localStorage.setItem("pint_saved_email", email);
      } else {
        localStorage.removeItem("pint_saved_email");
      }

      login({
        id: Number(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role as UserRole,
        area: user.area ?? null,
        serviceLine: user.service_line ?? null,
        accessToken,
        mustChangePassword: user.must_change_password ?? false,
      });

      if (user.must_change_password) {
        router.push("/change-password");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(
        msg === "Credenciais invalidas"
          ? "Email ou palavra-passe incorretos."
          : "Erro ao ligar ao servidor. Tenta novamente."
      );
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
          <h1 className="text-2xl font-bold text-foreground">Softinsa Badges</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Acede à tua plataforma de evolução técnica
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              E-mail corporativo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                placeholder="nome.sobrenome@softinsa.pt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                className="pl-10 w-full bg-background border border-border text-foreground rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-xs text-muted-foreground">Lembrar email</span>
            </label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Esqueceste a password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-primary-foreground gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Ainda não tens conta?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">Registar</Link>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Acesso restrito a colaboradores Softinsa.
          </p>
          <div className="mt-3 text-xs text-muted-foreground/60 space-y-0.5">
            <p>Conta de teste: <span className="font-mono">joao.silva@softinsa.pt</span></p>
            <p>Password: <span className="font-mono">Softinsa2025!</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
