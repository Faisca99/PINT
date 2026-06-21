import { Bell, ChevronLeft, Globe, Menu, Search } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotif?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  showLang?: boolean;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  transparent?: boolean;
}

export function AppHeader({
  title,
  showBack = false,
  showNotif = true,
  showMenu = false,
  showSearch = false,
  showLang = false,
  onMenuClick,
  onSearchClick,
  transparent = false,
}: AppHeaderProps) {
  const { goBack, notifCount, navigate } = useApp();

  return (
    <div className={`flex items-center justify-between px-4 py-3 ${transparent ? "" : "bg-white border-b border-slate-100"}`}>
      <div className="flex items-center gap-2">
        {showBack && (
          <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
        )}
        {showMenu && (
          <button onClick={onMenuClick} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <Menu size={20} className="text-slate-600" />
          </button>
        )}
        {title && <h1 className="text-slate-800">{title}</h1>}
      </div>

      <div className="flex items-center gap-1">
        {showLang && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Globe size={18} className="text-slate-600" />
          </button>
        )}
        {showSearch && (
          <button onClick={onSearchClick} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Search size={18} className="text-slate-600" />
          </button>
        )}
        {showNotif && (
          <button
            onClick={() => navigate("c-notifications")}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors relative"
          >
            <Bell size={18} className="text-slate-600" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface DashboardHeaderProps {
  greeting: string;
  name: string;
  area: string;
  avatar: string;
  level?: string;
}

export function DashboardHeader({ greeting, name, area, avatar, level }: DashboardHeaderProps) {
  const { notifCount, navigate } = useApp();

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="text-xs text-slate-500">{greeting}</p>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-400">{area}{level ? ` · Nível ${level}` : ""}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate("c-notifications")}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 relative"
        >
          <Bell size={18} className="text-slate-600" />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
