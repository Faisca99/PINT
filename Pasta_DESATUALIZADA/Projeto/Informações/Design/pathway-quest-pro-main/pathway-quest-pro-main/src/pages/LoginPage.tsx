import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroBg from "@/assets/hero-bg.jpg";
import badgeIcon from "@/assets/softinsa-badge-icon.png";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard (mock)
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Hero */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src={badgeIcon} alt="Softinsa" className="h-10 w-10" />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">
              Softinsa Badges
            </span>
          </div>

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

          <div className="flex gap-8">
            {[
              { value: "500+", label: "Badges disponíveis" },
              { value: "1.2k", label: "Certificações" },
              { value: "5", label: "Learning Paths" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src={badgeIcon} alt="Softinsa" className="h-9 w-9" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              Softinsa Badges
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Bem-vindo de volta" : "Criar conta"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Acede à tua conta para continuar"
                : "Regista-te para começar a tua jornada"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@softinsa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-card border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-card border-border"
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

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-accent hover:underline">
                  Esqueceste a password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {isLogin ? "Entrar" : "Registar"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              {isLogin ? "Não tens conta? " : "Já tens conta? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-accent hover:underline"
            >
              {isLogin ? "Registar" : "Entrar"}
            </button>
          </div>

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
};

export default LoginPage;
