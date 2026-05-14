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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useUser, UserRole } from "@/lib/user-context";
const badgeIcon = "/softinsa-badge-icon.png";

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

// Itens por role
const NAV_CONFIG: Record<UserRole, { label: string; items: { title: string; url: string; icon: any }[] }[]> = {
  consultant: [
    {
      label: "Principal",
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Catálogo de Badges", url: "/badges", icon: Award },
        { title: "Minhas Candidaturas", url: "/candidaturas", icon: Send },
        { title: "Meus Badges", url: "/my-badges", icon: Hexagon },
        { title: "Timeline", url: "/timeline", icon: FileText },
        { title: "Lembretes", url: "/lembretes", icon: Bell },
      ],
    },
    {
      label: "Gamificação",
      items: [
        { title: "Conquistas", url: "/achievements", icon: Trophy },
        { title: "Ranking", url: "/leaderboard", icon: Star },
        { title: "Assinatura Email", url: "/assinatura", icon: Mail },
      ],
    },
  ],
  talent_manager: [
    {
      label: "Principal",
      items: [
        { title: "Dashboard", url: "/dashboard-tm", icon: LayoutDashboard },
        { title: "Caixa de Entrada", url: "/validacao", icon: Inbox },
        { title: "Catálogo de Badges", url: "/badges", icon: Award },
      ],
    },
    {
      label: "Relatórios",
      items: [
        { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
        { title: "Consultores", url: "/utilizadores", icon: Users },
        { title: "Ranking", url: "/leaderboard", icon: Star },
        { title: "Assinatura Email", url: "/assinatura", icon: Mail },
      ],
    },
  ],
  service_line_leader: [
    {
      label: "Validação",
      items: [
        { title: "Caixa de Entrada", url: "/validacao", icon: Inbox },
        { title: "Catálogo de Badges", url: "/badges", icon: Award },
        { title: "Dashboard da Service Line", url: "/dashboard-sl", icon: LayoutDashboard },
      ],
    },
    {
      label: "Relatórios",
      items: [
        { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
        { title: "Consultores", url: "/utilizadores", icon: Users },
        { title: "Ranking", url: "/leaderboard", icon: Star },
        { title: "Assinatura Email", url: "/assinatura", icon: Mail },
      ],
    },
  ],
  admin: [
    {
      label: "Gestão",
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Utilizadores", url: "/admin/utilizadores", icon: Users },
        { title: "Badges", url: "/admin/badges", icon: Award },
        { title: "Estrutura LP", url: "/admin/estrutura", icon: ShieldCheck },
      ],
    },
    {
      label: "Configuração",
      items: [
        { title: "Avisos", url: "/admin/avisos", icon: Bell },
        { title: "Notificações", url: "/admin/notificacoes", icon: Megaphone },
        { title: "Políticas RGPD", url: "/admin/rgpd", icon: FileText },
        { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
      ],
    },
  ],
};

const bottomItems = [
  { title: "Avisos", url: "/avisos", icon: Megaphone },
  { title: "Definições", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const { user, logout } = useUser();

  const navGroups = NAV_CONFIG[user?.role ?? "consultant"] ?? NAV_CONFIG.consultant;
  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar"
      collapsible="icon"
    >
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <img src={badgeIcon} alt="Softinsa" className="h-8 w-8 shrink-0" />
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-sidebar-primary-foreground leading-tight">Softinsa</div>
            <div className="text-[10px] text-sidebar-foreground/60 leading-tight">Badge Platform</div>
          </div>
        )}
      </div>

      <SidebarContent className="px-2 py-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
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
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
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
                {!collapsed && <span>Sair</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
