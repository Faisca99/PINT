"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser, ROLE_LABELS } from "@/lib/user-context";
import { NotificationBell } from "@/components/NotificationBell";
import { getLang, setLang, type Lang } from "@/lib/i18n";

interface AppLayoutProps { children: ReactNode; }

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "pt", flag: "🇵🇹", label: "PT" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, isAuthenticated, logout } = useUser();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentLang, setCurrentLang] = useState<Lang>("pt");
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    setCurrentLang(getLang());
  }, []);

  useEffect(() => {
    const handler = () => setShowLogoutModal(true);
    window.addEventListener("logout-request", handler);
    return () => window.removeEventListener("logout-request", handler);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.mustChangePassword) {
      router.replace("/change-password");
    }
  }, [isAuthenticated, user?.mustChangePassword, router]);

  // Fechar menu de língua ao clicar fora
  useEffect(() => {
    if (!showLangMenu) return;
    const close = () => setShowLangMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showLangMenu]);

  if (!isAuthenticated || !user) return null;

  const handleLogoutConfirm = () => {
    logout();
    router.replace("/login");
  };

  const handleLangChange = (lang: Lang) => {
    setShowLangMenu(false);
    if (lang === currentLang) return;
    setCurrentLang(lang);
    setLang(lang); // guarda e recarrega
  };

  const activeLang = LANGS.find((l) => l.code === currentLang) ?? LANGS[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <NotificationBell />

              {/* Selector de língua */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span className="text-base leading-none">{activeLang.flag}</span>
                  <span className="text-xs font-medium hidden sm:block">{activeLang.label}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[120px]">
                    {LANGS.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted ${
                          lang.code === currentLang ? "bg-primary/5 text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label === "PT" ? "Português" : lang.label === "EN" ? "English" : "Español"}</span>
                        {lang.code === currentLang && <span className="ml-auto text-xs text-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-foreground leading-tight">{user.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{ROLE_LABELS[user.role]}</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLogoutModal(true)}
                className="text-muted-foreground hover:text-destructive"
                title="Terminar Sessão"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-card px-6 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Softinsa Badges Platform</span>
            <a href="https://www.softinsa.pt" target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline">
              www.softinsa.pt
            </a>
          </footer>
        </div>
      </div>

      {/* Modal de logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Terminar Sessão</h2>
              <button onClick={() => setShowLogoutModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Pretende terminar a sua sessão? Terá de efetuar login novamente para aceder à plataforma.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1 gap-2" onClick={handleLogoutConfirm}>
                <LogOut className="h-4 w-4" />
                Terminar Sessão
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default AppLayout;
