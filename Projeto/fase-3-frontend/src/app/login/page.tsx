"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ChevronRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import { markFirstLogin } from "@/lib/greeting";
import Link from "next/link";
import { api } from "@/lib/api";
import { useUser, UserRole } from "@/lib/user-context";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();

  const [email, setEmail] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("pint_saved_email") ?? "" : ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() =>
    typeof window !== "undefined" ? !!localStorage.getItem("pint_saved_email") : false
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Detectar 1º login: se vier do registo ou se last_login_at === null
      const isNewUser = !user.last_login_at || searchParams?.get("registered") === "1";
      if (isNewUser) markFirstLogin(Number(user.id));

      login({
        id: Number(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role as UserRole,
        area: user.area ?? null,
        serviceLine: user.service_line ?? null,
        accessToken,
        mustChangePassword: user.must_change_password ?? false,
        lastLoginAt: user.last_login_at ?? null,
      });

      if (user.must_change_password) {
        router.push("/change-password");
      } else {
        const dashboards: Record<string, string> = {
          consultant:           "/",
          talent_manager:       "/dashboard-tm",
          service_line_leader:  "/dashboard-sl",
          admin:                "/admin",
        };
        router.push(dashboards[user.role] ?? "/");
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
    <div className="flex min-h-screen">
      {/* Painel esquerdo — Hero */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <SoftinsaLogo size={40} />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">
              Softinsa Badges
            </span>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-lg"
          >
            <h1 className="text-5xl font-bold text-primary-foreground leading-tight mb-6">
              Certifica as tuas
              <br />
              <span className="text-accent">competências</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              Plataforma de badges digitais da Softinsa. Valida, evidencia e
              partilha as tuas certificações profissionais.
            </p>
          </motion.div>

          {/* Stats */}
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
            <span className="text-lg font-bold text-foreground tracking-tight">
              Softinsa Badges
            </span>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Acede à tua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nome@softinsa.pt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar + Recuperar */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-muted-foreground">Lembrar email</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Esqueceste a password?
              </Link>
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-md gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Link para registo */}
          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">Ainda não tens conta? </span>
            <Link href="/register" className="text-sm font-medium text-accent hover:underline">
              Registar
            </Link>
          </div>

          {/* Rodapé segurança */}
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
