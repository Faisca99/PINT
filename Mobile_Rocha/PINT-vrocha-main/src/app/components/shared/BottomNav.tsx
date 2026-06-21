import { type Screen, useApp } from "../../context/AppContext";
import { Home, Award, FileText, Clock, User } from "lucide-react";
import { useTranslation } from "../../i18n/translations";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  screen: Screen;
}

export function ConsultorBottomNav() {
  const { screen, navigate, lang } = useApp();
  const tr = useTranslation(lang);
  const labels: Record<string, Record<string, string>> = {
    pt: { home: "Início", badges: "Badges", apps: "Candidaturas", timeline: "Timeline", profile: "Perfil" },
    en: { home: "Home", badges: "Badges", apps: "Applications", timeline: "Timeline", profile: "Profile" },
    es: { home: "Inicio", badges: "Insignias", apps: "Solicitudes", timeline: "Timeline", profile: "Perfil" },
  };
  const l = labels[lang] ?? labels.pt;
  void tr;
  const items: NavItem[] = [
    { label: l.home, icon: <Home size={20} />, screen: "c-dashboard" },
    { label: l.badges, icon: <Award size={20} />, screen: "c-badges" },
    { label: l.apps, icon: <FileText size={20} />, screen: "c-applications" },
    { label: l.timeline, icon: <Clock size={20} />, screen: "c-timeline" },
    { label: l.profile, icon: <User size={20} />, screen: "c-more" },
  ];
  return <BottomNavBase items={items} activeScreen={screen} navigate={navigate} />;
}

function BottomNavBase({ items, activeScreen, navigate }: {
  items: NavItem[];
  activeScreen: Screen;
  navigate: (s: Screen) => void;
}) {
  return (
    <div className="bg-white border-t border-slate-100 flex items-center justify-around px-1 py-2 safe-bottom">
      {items.map((item) => {
        const active = item.screen === activeScreen || (item.screen === "c-more" && ["c-more", "c-my-badges", "c-achievements", "c-leaderboard", "c-recommendations", "c-settings", "c-notifications", "c-reminders"].includes(activeScreen));
        return (
          <button
            key={item.screen}
            onClick={() => navigate(item.screen)}
            className="flex flex-col items-center gap-0.5 min-w-[56px] py-1 px-1 relative"
          >
            <span className={active ? "text-blue-700" : "text-slate-400"}>{item.icon}</span>
            <span className={`text-[10px] font-medium ${active ? "text-blue-700" : "text-slate-400"}`}>{item.label}</span>
            {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-700" />}
          </button>
        );
      })}
    </div>
  );
}
