"use client";

import {
  LayoutDashboard,
  Award,
  Send,
  Trophy,
  Star,
  FileText,
  Settings,
  LogOut,
  Hexagon,
  Inbox,
  Users,
  BarChart3,
  ShieldCheck,
  Bell,
  Mail,
  Megaphone,
  Plug,
  Timer,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useUser, UserRole } from "@/lib/user-context";
import { getLang, t } from "@/lib/i18n";
import { SoftinsaLogo } from "@/components/SoftinsaLogo";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

// Itens por role — com chaves de tradução explícitas
const NAV_CONFIG: Record<UserRole, { labelKey: string; items: { key: string; url: string; icon: any }[] }[]> = {
  consultant: [
    {
      labelKey: "nav.group.principal",
      items: [
        { key: "nav.dashboard",    url: "/",             icon: LayoutDashboard },
        { key: "nav.badges",       url: "/badges",       icon: Award },
        { key: "nav.candidaturas", url: "/candidaturas", icon: Send },
        { key: "nav.myBadges",     url: "/my-badges",    icon: Hexagon },
        { key: "nav.timeline",     url: "/timeline",     icon: FileText },
        { key: "nav.lembretes",    url: "/lembretes",    icon: Bell },
      ],
    },
    {
      labelKey: "nav.group.gamification",
      items: [
        { key: "nav.achievements", url: "/achievements", icon: Trophy },
        { key: "nav.leaderboard",  url: "/leaderboard",  icon: Star },
        { key: "nav.assinatura",   url: "/assinatura",   icon: Mail },
      ],
    },
  ],
  talent_manager: [
    {
      labelKey: "nav.group.principal",
      items: [
        { key: "nav.dashboard",    url: "/dashboard-tm", icon: LayoutDashboard },
        { key: "nav.validacao",    url: "/validacao",    icon: Inbox },
        { key: "nav.badges",       url: "/badges",       icon: Award },
      ],
    },
    {
      labelKey: "nav.group.reports",
      items: [
        { key: "nav.relatorios",   url: "/relatorios",   icon: BarChart3 },
        { key: "nav.utilizadores", url: "/utilizadores", icon: Users },
        { key: "nav.leaderboard",  url: "/leaderboard",  icon: Star },
        { key: "nav.assinatura",   url: "/assinatura",   icon: Mail },
      ],
    },
  ],
  service_line_leader: [
    {
      labelKey: "nav.group.validation",
      items: [
        { key: "nav.validacao",    url: "/validacao",    icon: Inbox },
        { key: "nav.badges",       url: "/badges",       icon: Award },
        { key: "nav.dashboardSL",  url: "/dashboard-sl", icon: LayoutDashboard },
      ],
    },
    {
      labelKey: "nav.group.reports",
      items: [
        { key: "nav.relatorios",   url: "/relatorios",   icon: BarChart3 },
        { key: "nav.utilizadores", url: "/utilizadores", icon: Users },
        { key: "nav.leaderboard",  url: "/leaderboard",  icon: Star },
        { key: "nav.assinatura",   url: "/assinatura",   icon: Mail },
      ],
    },
  ],
  admin: [
    {
      labelKey: "nav.group.management",
      items: [
        { key: "nav.dashboard",    url: "/admin",             icon: LayoutDashboard },
        { key: "nav.utilizadores", url: "/admin/utilizadores",icon: Users },
        { key: "nav.badges",       url: "/admin/badges",      icon: Award },
        { key: "nav.estrutura",    url: "/admin/estrutura",   icon: ShieldCheck },
      ],
    },
    {
      labelKey: "nav.group.config",
      items: [
        { key: "nav.avisos",       url: "/admin/avisos",      icon: Bell },
        { key: "nav.notificacoes", url: "/admin/notificacoes",icon: Megaphone },
        { key: "nav.rgpd",         url: "/admin/rgpd",        icon: FileText },
        { key: "nav.integracoes",  url: "/admin/integracoes", icon: Plug },
        { key: "nav.sla",          url: "/admin/sla",         icon: Timer },
        { key: "nav.relatorios",   url: "/relatorios",        icon: BarChart3 },
      ],
    },
  ],
};

const bottomItems = [
  { key: "nav.avisos",   url: "/avisos",   icon: Megaphone },
  { key: "nav.settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const { user, logout } = useUser();
  const lang = getLang();

  const rawGroups = NAV_CONFIG[user?.role ?? "consultant"] ?? NAV_CONFIG.consultant;
  const navGroups = rawGroups.map((group) => ({
    label: t(group.labelKey, lang),
    labelKey: group.labelKey,
    items: group.items.map((item) => ({ ...item, title: t(item.key, lang) })),
  }));
  // Páginas que só devem ficar activas com exact match (não com startsWith)
  const EXACT_MATCH_PATHS = ["/", "/admin"];
  const isActive = (path: string) =>
    pathname === path ||
    (!EXACT_MATCH_PATHS.includes(path) && pathname.startsWith(path));

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <SoftinsaLogo size={32} className="shrink-0" />
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-sidebar-primary-foreground leading-tight">Softinsa</div>
            <div className="text-[10px] text-sidebar-foreground/60 leading-tight">Badge Platform</div>
          </div>
        )}
      </div>

      <SidebarContent className="px-2 py-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.labelKey}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(item.url)
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{t(item.key, lang)}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => {
                  // Disparar evento para o AppLayout abrir o modal de confirmação
                  window.dispatchEvent(new CustomEvent("logout-request"));
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-destructive/70 hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{t("nav.logout", lang)}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
