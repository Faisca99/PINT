"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Mail, Lock, ChevronRight, Eye, EyeOff, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import Link from "next/link";
import { api } from "@/lib/api";
import { t } from "@/lib/i18n";

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
    if (form.password.length < 6) { setError(t("auth.pwMin6")); return; }
    if (form.password !== form.confirm) { setError(t("auth.pwMismatch")); return; }
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
      setError(msg === "Email já registado" ? t("page.register.errEmailTaken") : t("page.register.errCreate"));
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

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
              {t("page.register.hero1")}
              <br />
              <span className="text-accent">{t("page.register.hero2")}</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 leading-relaxed">
              {t("page.register.heroSub")}
            </p>
          </motion.div>

          <div className="flex gap-8">
            {[
              { value: "15+", label: t("login.hero.stat1") },
              { value: "3", label: t("login.hero.stat2") },
              { value: "5", label: t("login.hero.stat3") },
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
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("page.register.title")}</h2>
            <p className="text-muted-foreground">{t("page.register.sub")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">{t("admin.users.fullName")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" required value={form.full_name} onChange={set("full_name")}
                  placeholder={t("admin.users.fullNamePlaceholder")}
                  className="pl-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">{t("auth.corporateEmail")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" required value={form.email} onChange={set("email")}
                  placeholder="nome@softinsa.pt"
                  className="pl-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
              </div>
            </div>

            {/* Área */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                {t("page.register.prefArea")} <span className="text-muted-foreground font-normal">{t("page.register.optional")}</span>
              </label>
              <div className="relative">
                <select value={form.area_id} onChange={set("area_id")}
                  className="h-11 w-full appearance-none bg-card border border-border text-foreground rounded-md px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">{t("page.register.selectArea")}</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">{t("page.register.areaHint")}</p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={set("password")}
                  placeholder={t("auth.min6chars")}
                  className="pl-10 pr-10 h-11 w-full bg-card border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">{t("auth.confirmPassword")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" required value={form.confirm} onChange={set("confirm")}
                  placeholder={t("auth.repeatPassword")}
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t("page.register.createAccount")} <ChevronRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">{t("page.register.haveAccount")} </span>
            <Link href="/login" className="text-sm font-medium text-accent hover:underline">{t("page.register.signIn")}</Link>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>{t("page.register.restricted")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
