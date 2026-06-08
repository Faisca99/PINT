"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Share2, TrendingUp } from "lucide-react";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";
import { t } from "@/lib/i18n";

interface AuthHeroProps {
  /** Primeira linha do título. */
  title: string;
  /** Segunda linha destacada (cor accent). */
  highlight: string;
  /** Parágrafo de apoio. */
  subtitle: string;
}

const STATS = [
  { value: "15+", labelKey: "login.hero.stat1" },
  { value: "3",   labelKey: "login.hero.stat2" },
  { value: "5",   labelKey: "login.hero.stat3" },
];

const FEATURES = [
  { icon: ShieldCheck, labelKey: "auth.feature1" },
  { icon: Share2,      labelKey: "auth.feature2" },
  { icon: TrendingUp,  labelKey: "auth.feature3" },
];

/**
 * Painel esquerdo partilhado por todas as páginas de autenticação
 * (login, registo, recuperação de password). Fundo gráfico profissional,
 * sem fotografias.
 */
export function AuthHero({ title, highlight, subtitle }: AuthHeroProps) {
  return (
    <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
      {/* Gradiente de marca */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Padrão de hexágonos subtil (tema dos badges) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="authHexPattern" width="56" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(1.4)">
            <path d="M14 0 L42 0 L56 24 L42 48 L14 48 L0 24 Z" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#authHexPattern)" />
      </svg>

      {/* Hexágonos decorativos em contorno */}
      <svg className="absolute -top-16 -right-10 w-72 h-72 text-accent/20" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path d="M25 3 L75 3 L97 50 L75 97 L25 97 L3 50 Z" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-8 right-24 w-40 h-40 text-white/10" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path d="M25 3 L75 3 L97 50 L75 97 L25 97 L3 50 Z" stroke="currentColor" strokeWidth="2.5" />
      </svg>

      {/* Orbes desfocados + brilho radial */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_38%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <SoftinsaLogo size={40} />
          <span className="text-xl font-bold text-primary-foreground tracking-tight">Softinsa Badges</span>
        </div>

        {/* Headline + features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="max-w-lg"
        >
          <h1 className="text-5xl font-bold text-primary-foreground leading-tight mb-5">
            {title}
            <br />
            <span className="text-accent">{highlight}</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 leading-relaxed mb-8">{subtitle}</p>

          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.labelKey}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-primary-foreground/90"
              >
                <span className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/15">
                  <f.icon className="h-4 w-4 text-accent" />
                </span>
                <span className="text-sm font-medium">{t(f.labelKey)}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Stats */}
        <div className="flex gap-8 pt-6 border-t border-white/10">
          {STATS.map((stat) => (
            <div key={stat.labelKey}>
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-primary-foreground/50">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
