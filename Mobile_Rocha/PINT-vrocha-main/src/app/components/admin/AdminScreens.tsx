import { useState } from "react";
import { Search, Plus, ChevronRight, Download, AlertTriangle, Settings, X, Clock, Globe, Bell, Shield, Zap, FileText, Users, Award, BarChart2, Sliders } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppHeader, DashboardHeader } from "../shared/AppHeader";
import { AdminBottomNav } from "../shared/BottomNav";
import { StatusChip, LevelChip } from "../shared/StatusChip";
import { mockUsers, mockBadges, mockApplications, mockNotices, monthlyBadgesData, badgesByLevel } from "../../data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

// Admin Dashboard
export function AdminDashboard() {
  const { user, navigate } = useApp();
  const totalUsers = mockUsers.length;
  const totalBadges = mockBadges.length;
  const pendingApps = mockApplications.filter((a) => a.status === "submitted").length;
  const approvedBadges = mockApplications.filter((a) => a.status === "fechado-aprovado").length;
  const activeNotices = mockNotices.filter((n) => n.active).length;
  const slaBreached = mockApplications.filter((a) => a.slaRisk).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <DashboardHeader greeting="Bem-vindo," name={user.name} area="Administrador · Softinsa PINT" avatar={user.avatar} />
      <div className="flex-1 overflow-y-auto pb-4">
        {slaBreached > 0 && (
          <div className="mx-4 mt-3 bg-red-50 rounded-2xl p-3 border border-red-200 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700 flex-1">{slaBreached} SLA ultrapassado{slaBreached > 1 ? "s" : ""}</p>
            <button onClick={() => navigate("a-sla")} className="text-xs text-red-600 font-semibold">Ver →</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {[
            { label: "Utilizadores", value: totalUsers, icon: "👥", screen: "a-users" as const },
            { label: "Total Badges", value: totalBadges, icon: "🏅", screen: "a-badges-mgmt" as const },
            { label: "Pendentes", value: pendingApps, icon: "📋", screen: "a-users" as const },
            { label: "Avisos Ativos", value: activeNotices, icon: "📢", screen: "a-notices" as const },
          ].map((card) => (
            <button key={card.label} onClick={() => navigate(card.screen)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left">
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Badges por mês</h4>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={monthlyBadgesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Bar dataKey="badges" radius={[4, 4, 0, 0]} fill="#1a3a6b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Badge by level */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Badges por nível</h4>
          <div className="flex gap-2">
            {badgesByLevel.map((d) => (
              <div key={d.level} className="flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm" style={{ height: `${d.count * 2.5}px`, background: d.color, minHeight: 4 }} />
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.level}</span>
                  <span className="text-[10px] text-slate-400">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Ações rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Criar utilizador", icon: <Users size={16} />, screen: "a-create-user" as const, color: "#0066cc" },
              { label: "Criar badge", icon: <Award size={16} />, screen: "a-create-badge" as const, color: "#10b981" },
              { label: "Criar aviso", icon: <Bell size={16} />, screen: "a-notices" as const, color: "#f59e0b" },
              { label: "Config. SLA", icon: <Clock size={16} />, screen: "a-sla" as const, color: "#8b5cf6" },
            ].map((action) => (
              <button key={action.label} onClick={() => navigate(action.screen)}
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-blue-300 transition-colors">
                <span style={{ color: action.color }}>{action.icon}</span>
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-2">Alertas de sistema</h4>
          <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2 mb-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs text-amber-700">2 badges próximos da expiração</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
            <Settings size={14} className="text-blue-500" />
            <span className="text-xs text-blue-700">Manutenção programada: 22 Mai</span>
          </div>
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}

// Users Management
export function AdminUsers() {
  const { navigate } = useApp();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const roles = ["Todos", "Consultor", "TM", "SLL", "Admin"];

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos" ? true
      : roleFilter === "Consultor" ? u.role === "consultor"
      : roleFilter === "TM" ? u.role === "talent-manager"
      : roleFilter === "SLL" ? u.role === "service-line-leader"
      : u.role === "admin";
    return matchSearch && matchRole;
  });

  const roleLabels: Record<string, string> = {
    consultor: "Consultor",
    "talent-manager": "Talent Manager",
    "service-line-leader": "SLL",
    admin: "Admin",
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Utilizadores" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 mb-2">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Nome ou email..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {roles.map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${roleFilter === r ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">👤</span>
            <p className="text-sm font-semibold text-slate-600">Nenhum utilizador encontrado</p>
            <p className="text-xs text-slate-400">Tente ajustar os filtros ou a pesquisa.</p>
          </div>
        ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{roleLabels[user.role]}</span>
                  <span className="text-[10px] text-slate-400">{user.area}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {user.status === "active" ? "Ativo" : "Inativo"}
                </span>
                <button onClick={() => navigate("a-edit-user", { userId: user.id })}
                  className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      <div className="px-4 pb-2 bg-white border-t border-slate-100">
        <button onClick={() => navigate("a-create-user")}
          className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 my-2"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          <Plus size={16} /> Criar Utilizador
        </button>
      </div>
      <AdminBottomNav />
    </div>
  );
}

// Create User
export function CreateUser() {
  const { goBack } = useApp();
  const [form, setForm] = useState({ name: "", email: "", role: "", serviceLine: "", area: "", active: true, forcePasswordChange: true });
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">✅</div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">Utilizador criado!</h3>
          <p className="text-slate-500 text-sm">Um email foi enviado para <strong>{form.email}</strong> com as credenciais de acesso.</p>
        </div>
        <button onClick={goBack} className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <AppHeader title="Criar Utilizador" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
        {[
          { label: "Nome completo", key: "name", placeholder: "Nome Apelido" },
          { label: "Email", key: "email", placeholder: "email@softinsa.pt" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <input value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-400"
              placeholder={f.placeholder} />
          </div>
        ))}
        {[
          { label: "Perfil", key: "role", options: ["consultor", "talent-manager", "service-line-leader", "admin"] },
          { label: "Service Line", key: "serviceLine", options: ["Technology", "Digital & Analytics", "Security", "Consulting"] },
          { label: "Área", key: "area", options: ["Cloud & DevOps", "Data & Analytics", "Cybersecurity", "Digital", "Gestão de Projetos"] },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <select value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none appearance-none">
              <option value="">Selecionar...</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {[
          { label: "Utilizador ativo", key: "active", val: form.active },
          { label: "Obrigar alteração de password", key: "forcePasswordChange", val: form.forcePasswordChange },
        ].map((f) => (
          <div key={f.key} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <span className="text-sm font-medium text-slate-700">{f.label}</span>
            <button onClick={() => setForm({ ...form, [f.key]: !f.val })}
              className={`w-12 h-6 rounded-full relative transition-colors ${f.val ? "bg-blue-600" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${f.val ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <button onClick={() => setSuccess(true)}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Criar Utilizador
        </button>
      </div>
    </div>
  );
}

// Edit User
export function EditUser() {
  const { goBack, screenParams } = useApp();
  const existing = mockUsers.find((u) => u.id === screenParams.userId) ?? mockUsers[0];
  const [form, setForm] = useState({
    name: existing.name,
    email: existing.email,
    role: existing.role,
    serviceLine: existing.serviceLine,
    area: existing.area,
    active: existing.status === "active",
    forcePasswordChange: false,
  });
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">✅</div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">Utilizador atualizado!</h3>
          <p className="text-slate-500 text-sm">As alterações a <strong>{form.name}</strong> foram guardadas com sucesso.</p>
        </div>
        <button onClick={goBack} className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <AppHeader title="Editar Utilizador" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg">
            {existing.avatar}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{existing.name}</p>
            <p className="text-xs text-slate-500">{existing.email}</p>
          </div>
        </div>
        {[
          { label: "Nome completo", key: "name", placeholder: "Nome Apelido" },
          { label: "Email", key: "email", placeholder: "email@softinsa.pt" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <input value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-400"
              placeholder={f.placeholder} />
          </div>
        ))}
        {[
          { label: "Perfil", key: "role", options: ["consultor", "talent-manager", "service-line-leader", "admin"] },
          { label: "Service Line", key: "serviceLine", options: ["Technology", "Digital & Analytics", "Security", "Consulting"] },
          { label: "Área", key: "area", options: ["Cloud & DevOps", "Data & Analytics", "Cybersecurity", "Digital", "Gestão de Projetos"] },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <select value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none appearance-none">
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {[
          { label: "Utilizador ativo", key: "active", val: form.active },
          { label: "Obrigar alteração de password", key: "forcePasswordChange", val: form.forcePasswordChange },
        ].map((f) => (
          <div key={f.key} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <span className="text-sm font-medium text-slate-700">{f.label}</span>
            <button onClick={() => setForm({ ...form, [f.key]: !f.val })}
              className={`w-12 h-6 rounded-full relative transition-colors ${f.val ? "bg-blue-600" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${f.val ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <button onClick={() => setSuccess(true)}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Guardar Alterações
        </button>
      </div>
    </div>
  );
}

// Admin Badges
export function AdminBadges() {
  const { navigate } = useApp();
  const [search, setSearch] = useState("");
  const filtered = mockBadges.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Gestão de Badges" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Pesquisar badge..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-2 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🏅</span>
            <p className="text-sm font-semibold text-slate-600">Nenhum badge encontrado</p>
            <p className="text-xs text-slate-400">Tente ajustar a pesquisa.</p>
          </div>
        ) : filtered.map((badge) => (
          <div key={badge.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${badge.color}22` }}>
              {badge.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm text-slate-800">{badge.title}</p>
                <LevelChip level={badge.level} size="sm" />
              </div>
              <p className="text-xs text-slate-500">{badge.area} · {badge.points} pts</p>
            </div>
            <button onClick={() => navigate("a-edit-badge", { badgeId: badge.id })}
              className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-lg">Editar</button>
          </div>
        ))}
      </div>
      <div className="px-4 pb-2 bg-white border-t border-slate-100">
        <button onClick={() => navigate("a-create-badge")}
          className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 my-2"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          <Plus size={16} /> Criar Badge
        </button>
      </div>
      <AdminBottomNav />
    </div>
  );
}

// Create Badge
export function CreateBadge() {
  const { goBack } = useApp();
  const [form, setForm] = useState({ title: "", description: "", level: "", area: "", serviceLine: "", learningPath: "", points: "", expiration: "" });
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">🏅</div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">Badge criado!</h3>
          <p className="text-slate-500 text-sm">O badge <strong>{form.title || "Novo Badge"}</strong> foi criado com sucesso e já está disponível no catálogo.</p>
        </div>
        <button onClick={goBack} className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <AppHeader title="Criar Badge" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
        {[
          { label: "Título", key: "title", placeholder: "Nome do badge" },
          { label: "Descrição", key: "description", placeholder: "Descrição do badge..." },
          { label: "Pontos", key: "points", placeholder: "ex: 300" },
          { label: "Expiração (opcional)", key: "expiration", placeholder: "ex: 2027-12-31" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <input value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-400"
              placeholder={f.placeholder} />
          </div>
        ))}
        {[
          { label: "Nível", key: "level", options: ["A", "B", "C", "D", "E"] },
          { label: "Service Line", key: "serviceLine", options: ["Technology", "Digital & Analytics", "Security"] },
          { label: "Área", key: "area", options: ["Cloud & DevOps", "Data & Analytics", "Cybersecurity", "Digital"] },
          { label: "Learning Path", key: "learningPath", options: ["Cloud Journey", "Data Journey", "Security Path", "Agile Leadership"] },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <select value={form[f.key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none appearance-none">
              <option value="">Selecionar...</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <button onClick={() => setSuccess(true)}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Criar Badge
        </button>
      </div>
    </div>
  );
}

// Edit Badge
export function EditBadge() {
  const { goBack, screenParams } = useApp();
  const existing = mockBadges.find((b) => b.id === screenParams.badgeId) ?? mockBadges[0];
  const [form, setForm] = useState({
    title: existing.title,
    description: existing.description,
    level: existing.level,
    area: existing.area,
    serviceLine: existing.serviceLine,
    learningPath: existing.learningPath,
    points: String(existing.points),
    expiration: existing.expiration ?? "",
  });
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">🏅</div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">Badge atualizado!</h3>
          <p className="text-slate-500 text-sm">O badge <strong>{form.title}</strong> foi atualizado com sucesso.</p>
        </div>
        <button onClick={goBack} className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <AppHeader title="Editar Badge" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col gap-3">
        <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${existing.color}22` }}>
            {existing.icon}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{existing.title}</p>
            <p className="text-xs text-slate-500">{existing.holders} holders · {existing.points} pts</p>
          </div>
        </div>
        {[
          { label: "Título", key: "title", placeholder: "Nome do badge" },
          { label: "Descrição", key: "description", placeholder: "Descrição..." },
          { label: "Pontos", key: "points", placeholder: "ex: 300" },
          { label: "Expiração (opcional)", key: "expiration", placeholder: "ex: 2027-12-31" },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <input value={form[f.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-400"
              placeholder={f.placeholder} />
          </div>
        ))}
        {[
          { label: "Nível", key: "level", options: ["A", "B", "C", "D", "E"] },
          { label: "Service Line", key: "serviceLine", options: ["Technology", "Digital & Analytics", "Security"] },
          { label: "Área", key: "area", options: ["Cloud & DevOps", "Data & Analytics", "Cybersecurity", "Digital", "Gestão de Projetos"] },
          { label: "Learning Path", key: "learningPath", options: ["Cloud Journey", "Data Journey", "Security Path", "Agile Leadership", "AI Journey"] },
        ].map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-slate-600 text-sm">{f.label}</label>
            <select value={form[f.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm text-slate-800 outline-none appearance-none">
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-slate-100 px-4 py-4 flex gap-3">
        <button onClick={goBack}
          className="flex-1 py-4 rounded-2xl border-2 border-red-200 text-red-600 font-semibold text-sm">
          Desativar
        </button>
        <button onClick={() => setSuccess(true)}
          className="flex-1 py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Guardar
        </button>
      </div>
    </div>
  );
}

// Structure Management
export function AdminStructure() {
  type StructureItem = { id: string; name: string; type: string; children: string[] };
  const [activeTab, setActiveTab] = useState("Learning Paths");
  const [expanded, setExpanded] = useState<string[]>(["lp1"]);
  const [showModal, setShowModal] = useState<{ mode: "add-parent" | "add-child" | "edit-child"; parentId?: string; childName?: string } | null>(null);
  const [inputName, setInputName] = useState("");
  const [items, setItems] = useState<StructureItem[]>([
    { id: "lp1", name: "Cloud Journey", type: "LP", children: ["Technology", "Digital & Analytics"] },
    { id: "lp2", name: "Data Journey", type: "LP", children: ["Digital & Analytics"] },
    { id: "lp3", name: "Security Path", type: "LP", children: ["Technology"] },
    { id: "lp4", name: "Agile Leadership", type: "LP", children: ["All"] },
  ]);

  const tabData: Record<string, StructureItem[]> = {
    "Learning Paths": items,
    "Service Lines": [
      { id: "sl1", name: "Technology", type: "SL", children: ["Cloud & DevOps", "Cybersecurity"] },
      { id: "sl2", name: "Digital & Analytics", type: "SL", children: ["Data & Analytics", "Digital"] },
    ],
    "Áreas": [
      { id: "a1", name: "Cloud & DevOps", type: "Área", children: ["AWS", "Azure", "Kubernetes"] },
      { id: "a2", name: "Data & Analytics", type: "Área", children: ["Python", "Power BI", "ML"] },
      { id: "a3", name: "Cybersecurity", type: "Área", children: ["CompTIA", "SIEM", "Compliance"] },
    ],
    "Níveis": [
      { id: "n1", name: "Nível A — Expert", type: "N", children: ["500+ pontos", "Máximo impacto"] },
      { id: "n2", name: "Nível B — Advanced", type: "N", children: ["300-499 pontos"] },
      { id: "n3", name: "Nível C — Intermediate", type: "N", children: ["150-299 pontos"] },
      { id: "n4", name: "Nível D — Foundation", type: "N", children: ["75-149 pontos"] },
      { id: "n5", name: "Nível E — Entry", type: "N", children: ["0-74 pontos"] },
    ],
  };

  const currentItems = tabData[activeTab] ?? items;

  const handleSave = () => {
    if (!inputName.trim()) return;
    if (showModal?.mode === "add-parent") {
      setItems([...items, { id: `lp${Date.now()}`, name: inputName, type: "LP", children: [] }]);
    } else if (showModal?.mode === "add-child" && showModal.parentId) {
      setItems(items.map((i) => i.id === showModal.parentId ? { ...i, children: [...i.children, inputName] } : i));
    } else if (showModal?.mode === "edit-child" && showModal.parentId) {
      setItems(items.map((i) => i.id === showModal.parentId
        ? { ...i, children: i.children.map((c) => c === showModal.childName ? inputName : c) }
        : i));
    }
    setShowModal(null);
    setInputName("");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Estrutura" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
          {["Learning Paths", "Service Lines", "Áreas", "Níveis"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeTab === tab ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {currentItems.map((item) => {
            const isExpanded = expanded.includes(item.id);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded((prev) => isExpanded ? prev.filter((x) => x !== item.id) : [...prev, item.id])}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-left">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{item.type}</span>
                  <span className="flex-1 text-sm font-medium text-slate-800">{item.name}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-50 px-4 py-2">
                    {item.children.map((child) => (
                      <div key={child} className="flex items-center gap-2 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                        <span className="text-sm text-slate-600 flex-1">{child}</span>
                        <button onClick={() => { setShowModal({ mode: "edit-child", parentId: item.id, childName: child }); setInputName(child); }}
                          className="text-xs text-blue-500 font-medium">Editar</button>
                        <button onClick={() => setItems(items.map((i) => i.id === item.id ? { ...i, children: i.children.filter((c) => c !== child) } : i))}
                          className="text-xs text-red-400 font-medium ml-1">✕</button>
                      </div>
                    ))}
                    {activeTab === "Learning Paths" && (
                      <button onClick={() => { setShowModal({ mode: "add-child", parentId: item.id }); setInputName(""); }}
                        className="flex items-center gap-2 py-1.5 text-blue-500">
                        <Plus size={12} />
                        <span className="text-xs font-medium">Adicionar</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {activeTab === "Learning Paths" && (
          <button onClick={() => { setShowModal({ mode: "add-parent" }); setInputName(""); }}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600">
            <Plus size={16} /><span className="text-sm font-medium">Novo Learning Path</span>
          </button>
        )}
      </div>
      <AdminBottomNav />

      {showModal && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">
                {showModal.mode === "add-parent" ? "Novo Learning Path"
                  : showModal.mode === "add-child" ? "Adicionar elemento"
                  : `Editar: ${showModal.childName}`}
              </h3>
              <button onClick={() => setShowModal(null)}><X size={20} className="text-slate-500" /></button>
            </div>
            <input value={inputName} onChange={(e) => setInputName(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none mb-4"
              placeholder="Nome..." autoFocus />
            <button onClick={handleSave}
              className="w-full py-4 rounded-2xl text-white font-semibold"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Notices Management
export function AdminNotices() {
  const [notices, setNotices] = useState(mockNotices);
  const [showCreate, setShowCreate] = useState(false);
  const [editingNotice, setEditingNotice] = useState<typeof mockNotices[0] | null>(null);
  const [newNotice, setNewNotice] = useState({ title: "", message: "", category: "Geral" });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Avisos" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-4 flex flex-col gap-3">
        {notices.map((notice) => (
          <div key={notice.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${notice.active ? "border-slate-100" : "border-slate-100 opacity-50"}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{notice.title}</p>
                <p className="text-xs text-slate-500">{notice.category} · {notice.date}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${notice.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {notice.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{notice.message}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setEditingNotice({ ...notice })}
                className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-lg">Editar</button>
              <button onClick={() => setNotices(notices.map((n) => n.id === notice.id ? { ...n, active: !n.active } : n))}
                className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 rounded-lg">
                {notice.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-2 bg-white border-t border-slate-100">
        <button onClick={() => setShowCreate(true)}
          className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 my-2"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          <Plus size={16} /> Criar Aviso
        </button>
      </div>

      {showCreate && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Criar Aviso</h3>
              <button onClick={() => setShowCreate(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Título" />
              <textarea value={newNotice.message} onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                className="h-24 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm resize-none outline-none" placeholder="Mensagem..." />
              <select value={newNotice.category} onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none appearance-none">
                {["Geral", "Formação", "Política", "Sistema", "Novidades"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => {
                setNotices([{ id: `av${Date.now()}`, ...newNotice, date: "2025-05-16", active: true, read: false }, ...notices]);
                setShowCreate(false);
              }}
                className="w-full py-4 rounded-2xl text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                Publicar Aviso
              </button>
            </div>
          </div>
        </div>
      )}

      {editingNotice && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Editar Aviso</h3>
              <button onClick={() => setEditingNotice(null)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={editingNotice.title} onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Título" />
              <textarea value={editingNotice.message} onChange={(e) => setEditingNotice({ ...editingNotice, message: e.target.value })}
                className="h-24 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm resize-none outline-none" placeholder="Mensagem..." />
              <select value={editingNotice.category} onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none appearance-none">
                {["Geral", "Formação", "Política", "Sistema", "Novidades"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => {
                setNotices(notices.map((n) => n.id === editingNotice.id ? editingNotice : n));
                setEditingNotice(null);
              }}
                className="w-full py-4 rounded-2xl text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SLA Configuration
export function AdminSLA() {
  const { goBack } = useApp();
  const [slas, setSlas] = useState([
    { id: "sla1", role: "Talent Manager", hours: 72, active: true, email: true, push: true },
    { id: "sla2", role: "Service Line Leader", hours: 48, active: true, email: true, push: false },
  ]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Configuração SLA" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        {slas.map((sla) => (
          <div key={sla.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-800">{sla.role}</p>
              <button onClick={() => setSlas(slas.map((s) => s.id === sla.id ? { ...s, active: !s.active } : s))}
                className={`w-12 h-6 rounded-full relative transition-colors ${sla.active ? "bg-blue-600" : "bg-slate-300"}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${sla.active ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 mb-3">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm text-slate-600">Prazo SLA:</span>
              <div className="flex items-center gap-1 ml-auto">
                <button onClick={() => setSlas(slas.map((s) => s.id === sla.id ? { ...s, hours: Math.max(1, s.hours - 24) } : s))}
                  className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">-</button>
                <span className="text-sm font-bold text-slate-800 w-12 text-center">{sla.hours}h</span>
                <button onClick={() => setSlas(slas.map((s) => s.id === sla.id ? { ...s, hours: s.hours + 24 } : s))}
                  className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">+</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Notif. Email", key: "email", val: sla.email },
                { label: "Notif. Push", key: "push", val: sla.push },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{opt.label}</span>
                  <button onClick={() => setSlas(slas.map((s) => s.id === sla.id ? { ...s, [opt.key]: !opt.val } : s))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${opt.val ? "bg-blue-600" : "bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${opt.val ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* SLA breaches */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Incumprimentos SLA
          </h4>
          {mockApplications.filter((a) => a.slaRisk).length === 0 ? (
            <p className="text-sm text-slate-400">Sem incumprimentos SLA ativos.</p>
          ) : (
            mockApplications.filter((a) => a.slaRisk).map((app) => (
              <div key={app.id} className="bg-red-50 rounded-xl p-3 mb-2 border border-red-100">
                <p className="text-sm font-medium text-red-800">{app.consultorName}</p>
                <p className="text-xs text-red-600">{app.badgeTitle} · {app.badgeLevel}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Integrations
export function AdminIntegrations() {
  const { goBack } = useApp();
  const [integrations, setIntegrations] = useState([
    { id: "i1", name: "Microsoft Teams", icon: "💬", connected: true, lastSync: "2025-05-15 14:30", status: "ok" },
    { id: "i2", name: "Slack", icon: "⚡", connected: false, lastSync: "—", status: "disconnected" },
    { id: "i3", name: "Softinsa.pt", icon: "🌐", connected: true, lastSync: "2025-05-16 09:15", status: "ok" },
    { id: "i4", name: "LinkedIn", icon: "💼", connected: true, lastSync: "2025-05-10 11:00", status: "ok" },
  ]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Integrações" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4 flex flex-col gap-3">
        {integrations.map((integ) => (
          <div key={integ.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{integ.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{integ.name}</p>
                <p className="text-xs text-slate-400">Último sync: {integ.lastSync}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${integ.connected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {integ.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-xl">Configurar</button>
              <button className="flex-1 py-2 text-xs font-medium bg-slate-50 text-slate-600 rounded-xl">Testar</button>
              <button onClick={() => setIntegrations(integrations.map((i) => i.id === integ.id ? { ...i, connected: !i.connected } : i))}
                className={`flex-1 py-2 text-xs font-medium rounded-xl ${integ.connected ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {integ.connected ? "Desligar" : "Ligar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Reports
export function AdminReports() {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const handleExport = (name: string) => {
    setExportSuccess(name);
    setTimeout(() => setExportSuccess(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Relatórios Globais" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">KPIs Globais</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "% Badges aprovados", value: "68%", color: "#10b981" },
              { label: "Badges por mês", value: "12", color: "#0066cc" },
              { label: "Por Learning Path", value: "8.5", color: "#8b5cf6" },
              { label: "Utilizadores ativos", value: "48", color: "#f59e0b" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Exportar Relatórios</h4>
          {exportSuccess && (
            <div className="mb-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <span className="text-sm text-emerald-700 font-medium">A exportar: {exportSuccess}...</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {["Pedidos globais (Excel)", "Badges por área (PDF)", "Utilizadores registados (Excel)", "Aprovações por período (PDF)", "Rejeições (Excel)"].map((exp) => (
              <button key={exp} onClick={() => handleExport(exp)}
                className="flex items-center gap-3 py-3 px-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                <Download size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700">{exp}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin More
export function AdminMoreScreen() {
  const { navigate } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const items = [
    { icon: "📢", label: "Avisos / Informações", screen: "a-notices" as const },
    { icon: "🔔", label: "Config. Notificações", screen: "a-notif-config" as const },
    { icon: "🛡️", label: "Políticas RGPD", screen: "a-rgpd" as const },
    { icon: "⏰", label: "Configurar SLA", screen: "a-sla" as const },
    { icon: "🔗", label: "Integrações", screen: "a-integrations" as const },
    { icon: "📊", label: "Relatórios", screen: "a-reports" as const },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Mais" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {items.map((item, i) => (
            <button key={item.label} onClick={() => navigate(item.screen)}
              className={`flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-slate-50 ${i < items.length - 1 ? "border-b border-slate-50" : ""}`}>
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
        <button onClick={() => setShowLogout(true)}
          className="mt-4 flex items-center gap-3 w-full px-4 py-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-red-50 transition-colors">
          <span className="text-xl w-8 text-center">🚪</span>
          <span className="flex-1 text-sm font-medium text-red-600">Terminar sessão</span>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </div>
      <AdminBottomNav />

      {showLogout && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <h3 className="text-slate-800 mb-2">Terminar sessão</h3>
            <p className="text-sm text-slate-500 mb-6">Pretende terminar a sua sessão? Terá de fazer login novamente para aceder à plataforma.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("login")}
                className="w-full py-4 rounded-2xl text-white font-semibold bg-red-500">
                Terminar sessão
              </button>
              <button onClick={() => setShowLogout(false)}
                className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// RGPD
export function AdminRGPD() {
  type Policy = { id: string; title: string; version: string; date: string; content: string; active: boolean; acceptances: number };
  const [policies, setPolicies] = useState<Policy[]>([
    { id: "r1", title: "Política de Privacidade", version: "2.0", date: "2025-01-01", content: "Esta política descreve como a Softinsa recolhe, usa e protege os dados pessoais dos utilizadores da plataforma PINT 2025.", active: true, acceptances: 48 },
    { id: "r2", title: "Política de Privacidade", version: "1.5", date: "2024-06-01", content: "Versão anterior da política de privacidade.", active: false, acceptances: 52 },
    { id: "r3", title: "Termos de Utilização", version: "1.0", date: "2024-01-15", content: "Termos e condições de utilização da plataforma PINT 2025.", active: true, acceptances: 61 },
  ]);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ title: "", version: "", content: "" });
  const [showHistory, setShowHistory] = useState<Policy | null>(null);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Políticas RGPD" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4 flex flex-col gap-3">
        {policies.map((p) => (
          <div key={p.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${p.active ? "border-slate-100" : "border-slate-100 opacity-60"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm text-slate-800">{p.title} v{p.version}</p>
                <p className="text-xs text-slate-400">{p.date}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {p.active ? "Ativa" : "Arquivada"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.content}</p>
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 mb-3">
              <Users size={12} className="text-blue-600" />
              <span className="text-xs text-blue-700">{p.acceptances} utilizadores aceitaram</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingPolicy({ ...p })}
                className="flex-1 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-xl">Editar</button>
              <button onClick={() => setShowHistory(p)}
                className="flex-1 py-2 text-xs font-medium bg-slate-50 text-slate-600 rounded-xl">Histórico</button>
              <button onClick={() => setPolicies(policies.map((pol) => pol.id === p.id ? { ...pol, active: !pol.active } : pol))}
                className={`flex-1 py-2 text-xs font-medium rounded-xl ${p.active ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {p.active ? "Arquivar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}
        <button onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600">
          <Plus size={16} />
          <span className="text-sm font-medium">Nova Política</span>
        </button>
      </div>

      {editingPolicy && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 max-h-[80%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Editar Política</h3>
              <button onClick={() => setEditingPolicy(null)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={editingPolicy.title} onChange={(e) => setEditingPolicy({ ...editingPolicy, title: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Título" />
              <input value={editingPolicy.version} onChange={(e) => setEditingPolicy({ ...editingPolicy, version: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Versão (ex: 2.1)" />
              <textarea value={editingPolicy.content} onChange={(e) => setEditingPolicy({ ...editingPolicy, content: e.target.value })}
                className="h-28 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm resize-none outline-none" placeholder="Conteúdo da política..." />
              <button onClick={() => { setPolicies(policies.map((p) => p.id === editingPolicy.id ? editingPolicy : p)); setEditingPolicy(null); }}
                className="w-full py-4 rounded-2xl text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                Guardar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 max-h-[80%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Nova Política</h3>
              <button onClick={() => setShowCreate(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={newPolicy.title} onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Título da política" />
              <input value={newPolicy.version} onChange={(e) => setNewPolicy({ ...newPolicy, version: e.target.value })}
                className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm outline-none" placeholder="Versão (ex: 1.0)" />
              <textarea value={newPolicy.content} onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                className="h-28 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-sm resize-none outline-none" placeholder="Conteúdo da política..." />
              <button onClick={() => {
                setPolicies([{ id: `r${Date.now()}`, ...newPolicy, date: "2026-05-16", active: true, acceptances: 0 }, ...policies]);
                setShowCreate(false);
                setNewPolicy({ title: "", version: "", content: "" });
              }}
                className="w-full py-4 rounded-2xl text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                Publicar Política
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Histórico — {showHistory.title}</h3>
              <button onClick={() => setShowHistory(null)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-2">
              {policies.filter((p) => p.title === showHistory.title).map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">v{p.version}</p>
                    <p className="text-xs text-slate-400">{p.date} · {p.acceptances} aceitações</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.active ? "Ativa" : "Arquivada"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Notifications Config
export function AdminNotifConfig() {
  const [config, setConfig] = useState([
    { id: "n1", label: "Candidatura aprovada", email: true, push: true, inApp: true },
    { id: "n2", label: "Candidatura rejeitada", email: true, push: true, inApp: true },
    { id: "n3", label: "Send back", email: true, push: false, inApp: true },
    { id: "n4", label: "SLA ultrapassado", email: true, push: true, inApp: true },
    { id: "n5", label: "Badge expirando", email: true, push: false, inApp: true },
    { id: "n6", label: "Novos avisos", email: false, push: true, inApp: true },
  ]);

  const toggle = (id: string, channel: "email" | "push" | "inApp") => {
    setConfig(config.map((c) => c.id === id ? { ...c, [channel]: !c[channel] } : c));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Config. Notificações" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center px-4 py-2.5 border-b border-slate-50 bg-slate-50">
            <span className="flex-1 text-xs font-medium text-slate-500">Tipo</span>
            <span className="w-12 text-center text-xs font-medium text-slate-500">Email</span>
            <span className="w-12 text-center text-xs font-medium text-slate-500">Push</span>
            <span className="w-14 text-center text-xs font-medium text-slate-500">In-App</span>
          </div>
          {config.map((item) => (
            <div key={item.id} className="flex items-center px-4 py-3 border-b border-slate-50 last:border-0">
              <span className="flex-1 text-xs font-medium text-slate-700">{item.label}</span>
              {(["email", "push", "inApp"] as const).map((ch) => (
                <div key={ch} className="w-12 flex justify-center">
                  <button onClick={() => toggle(item.id, ch)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${item[ch] ? "bg-blue-600" : "bg-slate-200"}`}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${item[ch] ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
