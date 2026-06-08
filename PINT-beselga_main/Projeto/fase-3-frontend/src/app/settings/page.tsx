"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Globe, Check } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { FlagIcon } from "@/components/FlagIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLang, setLang, t, type Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  const [currentLang, setCurrentLang] = useState<Lang>("pt");

  useEffect(() => { setCurrentLang(getLang()); }, []);

  const handleLangChange = (lang: Lang) => {
    if (lang === currentLang) return;
    setCurrentLang(lang);
    setLang(lang);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-accent" />
            {t("page.settings.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("page.settings.sub")}</p>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                Idioma / Language / Idioma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {LANGS.map((lang) => (
                  <button key={lang.code} onClick={() => handleLangChange(lang.code)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      currentLang === lang.code
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}>
                    <FlagIcon code={lang.code} className="w-10 h-7" />
                    <span className="text-sm font-medium text-foreground">{lang.label}</span>
                    {currentLang === lang.code && (
                      <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                        <Check className="h-3 w-3" /> {t("page.settings.lang.active")}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {t("page.settings.lang.note")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
