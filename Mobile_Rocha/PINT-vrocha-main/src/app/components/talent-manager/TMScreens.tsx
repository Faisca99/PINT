import { useState } from "react";
import { Search, Filter, AlertTriangle, ChevronRight, Clock, Users, BarChart2, FileText, Download, X, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppHeader, DashboardHeader } from "../shared/AppHeader";
import { TMBottomNav } from "../shared/BottomNav";
import { StatusChip, LevelChip, SLAChip } from "../shared/StatusChip";
import { mockApplications, mockUsers, mockBadges, monthlyBadgesData, badgesByLevel } from "../../data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

// TM Dashboard
export function TMDashboard() {
  const { user, navigate } = useApp();
  const pending = mockApplications.filter((a) => a.status === "submitted").length;
  const validating = mockApplications.filter((a) => a.status === "em-validacao").length;
  const approved = mockApplications.filter((a) => a.status === "fechado-aprovado").length;
  const rejected = mockApplications.filter((a) => a.status === "fechado-rejeitado").length;
  const slaRisk = mockApplications.filter((a) => a.slaRisk).length;
  const consultors = mockUsers.filter((u) => u.role === "consultor").length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <DashboardHeader greeting="Olá," name={user.name} area={`Talent Manager · ${user.serviceLine}`} avatar={user.avatar} />
      <div className="flex-1 overflow-y-auto pb-4">
        {/* SLA Alert */}
        {slaRisk > 0 && (
          <div className="mx-4 mt-3 bg-red-50 rounded-2xl p-3 border border-red-200 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">{slaRisk} candidatura{slaRisk > 1 ? "s" : ""} em risco SLA</p>
              <p className="text-xs text-red-500">Necessita ação urgente</p>
            </div>
            <button onClick={() => navigate("tm-validations")} className="text-xs text-red-600 font-semibold whitespace-nowrap">Ver →</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {[
            { label: "Pendentes", value: pending, icon: "📋", color: "#f59e0b", screen: "tm-validations" as const },
            { label: "Em Validação", value: validating, icon: "🔄", color: "#8b5cf6", screen: "tm-validations" as const },
            { label: "Aprovadas", value: approved, icon: "✅", color: "#10b981", screen: "tm-validations" as const },
            { label: "Consultores", value: consultors, icon: "👥", color: "#0066cc", screen: "tm-users" as const },
          ].map((card) => (
            <button key={card.label} onClick={() => navigate(card.screen)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left">
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Monthly chart */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Badges validados por mês</h4>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={monthlyBadgesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Bar dataKey="badges" radius={[4, 4, 0, 0]} fill="#0066cc" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Badges by level */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Badges por nível</h4>
          <div className="flex items-center gap-3">
            {badgesByLevel.map((d) => (
              <div key={d.level} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm" style={{ height: `${d.count * 3}px`, background: d.color }} />
                <span className="text-xs font-bold" style={{ color: d.color }}>{d.level}</span>
                <span className="text-[10px] text-slate-400">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent candidaturas */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-800">Recentes</h4>
            <button onClick={() => navigate("tm-validations")} className="text-xs text-blue-600 font-medium">Ver todas</button>
          </div>
          {mockApplications.slice(0, 3).map((app) => (
            <button key={app.id} onClick={() => navigate("tm-validation-detail", { appId: app.id })}
              className="flex items-center gap-3 w-full py-2.5 border-b border-slate-50 last:border-0">
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-700">{app.consultorName}</p>
                <p className="text-xs text-slate-400">{app.badgeTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
                <StatusChip status={app.status} size="sm" />
              </div>
            </button>
          ))}
        </div>

        <div className="px-4">
          <button onClick={() => navigate("tm-validations")}
            className="w-full py-4 rounded-2xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Ver Validações Pendentes
          </button>
        </div>
      </div>
      <TMBottomNav />
    </div>
  );
}

// Validations List
export function TMValidationsList() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState("Pendentes");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterArea, setFilterArea] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSL, setFilterSL] = useState("");
  const tabs = ["Pendentes", "Em Validação", "Devolvidas", "Fechadas"];
  const areas = [...new Set(mockApplications.map((a) => a.consultorArea))];
  const levels = ["A", "B", "C", "D", "E"];
  const serviceLines = ["Technology", "Digital & Analytics"];
  const activeFiltersCount = [filterArea, filterLevel, filterSL].filter(Boolean).length;

  const filtered = mockApplications.filter((a) => {
    const matchSearch = a.consultorName.toLowerCase().includes(search.toLowerCase()) || a.badgeTitle.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "Pendentes" ? a.status === "submitted"
      : activeTab === "Em Validação" ? a.status === "em-validacao"
      : activeTab === "Devolvidas" ? a.status === "devolvido"
      : ["fechado-aprovado", "fechado-rejeitado"].includes(a.status);
    const matchArea = !filterArea || a.consultorArea === filterArea;
    const matchLevel = !filterLevel || a.badgeLevel === filterLevel;
    return matchSearch && matchTab && matchArea && matchLevel;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
      <AppHeader title="Validações" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
            <Search size={14} className="text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              placeholder="Consultor ou badge..." />
          </div>
          <button onClick={() => setShowFilters(true)}
            className={`relative px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${activeFiltersCount > 0 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
            <Filter size={14} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{activeFiltersCount}</span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Filtros</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Área</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilterArea("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!filterArea ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                    Todas
                  </button>
                  {areas.map((a) => (
                    <button key={a} onClick={() => setFilterArea(a === filterArea ? "" : a)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterArea === a ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Nível</p>
                <div className="flex gap-2">
                  <button onClick={() => setFilterLevel("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!filterLevel ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                    Todos
                  </button>
                  {levels.map((l) => (
                    <button key={l} onClick={() => setFilterLevel(l === filterLevel ? "" : l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterLevel === l ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Service Line</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilterSL("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!filterSL ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                    Todas
                  </button>
                  {serviceLines.map((sl) => (
                    <button key={sl} onClick={() => setFilterSL(sl === filterSL ? "" : sl)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterSL === sl ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
                      {sl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setFilterArea(""); setFilterLevel(""); setFilterSL(""); setShowFilters(false); }}
                  className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">
                  Limpar
                </button>
                <button onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm"
                  style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex bg-white border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${activeTab === tab ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent"}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-slate-500 text-sm">Sem candidaturas nesta categoria</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <button key={app.id} onClick={() => navigate("tm-validation-detail", { appId: app.id })}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{app.consultorName}</p>
                    <p className="text-xs text-slate-500">{app.consultorArea}</p>
                  </div>
                  <LevelChip level={app.badgeLevel} size="sm" />
                </div>
                <p className="text-sm text-slate-600 mb-2">{app.badgeTitle}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusChip status={app.status} size="sm" />
                  {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
                  <span className="text-xs text-slate-400 ml-auto">{app.submittedDate}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <TMBottomNav />
    </div>
  );
}

// Validation Detail
export function TMValidationDetail() {
  const { screenParams, goBack, navigate } = useApp();
  const app = mockApplications.find((a) => a.id === screenParams.appId) ?? mockApplications[0];
  const [showReturnSheet, setShowReturnSheet] = useState(false);
  const [returnComment, setReturnComment] = useState("");
  const [showSuccess, setShowSuccess] = useState<"sent" | "returned" | null>(null);

  if (showSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-4xl">{showSuccess === "sent" ? "🚀" : "↩️"}</span>
        </div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">{showSuccess === "sent" ? "Enviado para SLL!" : "Devolvida ao consultor!"}</h3>
          <p className="text-slate-500 text-sm">{showSuccess === "sent" ? "A candidatura foi enviada para o Service Line Leader para aprovação final." : "A candidatura foi devolvida com o comentário registado."}</p>
        </div>
        <button onClick={() => navigate("tm-validations")}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Voltar às Validações
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Detalhe da Validação" showBack />
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="bg-white px-5 py-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
              {app.consultorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{app.consultorName}</p>
              <p className="text-xs text-slate-500">{app.consultorArea}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">{app.badgeTitle}</p>
              <p className="text-xs text-slate-400">Submetida: {app.submittedDate}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <LevelChip level={app.badgeLevel} />
              {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
            </div>
          </div>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <h4 className="text-slate-700 mb-3">Evidências submetidas</h4>
          <div className="flex flex-col gap-2">
            {app.evidences.map((ev) => (
              <div key={ev.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{ev.requirementTitle}</p>
                  <p className="text-xs text-slate-400">{ev.fileName}</p>
                </div>
                <button className="text-xs text-blue-600 font-medium">Ver</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <h4 className="text-slate-700 mb-3">Histórico</h4>
          <div className="flex flex-col gap-2">
            {app.timeline.map((event) => (
              <div key={event.id} className="flex gap-3 py-1">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={10} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">{event.action}</p>
                  <p className="text-[10px] text-slate-400">{event.actor} · {event.date}</p>
                  {event.comment && <p className="text-xs text-slate-500 italic mt-0.5">"{event.comment}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {["submitted", "em-validacao"].includes(app.status) && (
        <div className="bg-white border-t border-slate-100 px-4 py-4 flex gap-2">
          <button onClick={() => setShowReturnSheet(true)}
            className="flex-1 py-3 rounded-2xl border-2 border-orange-300 text-orange-700 font-semibold text-sm">
            Devolver
          </button>
          <button onClick={() => setShowSuccess("sent")}
            className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Enviar para SLL
          </button>
        </div>
      )}

      {/* Return bottom sheet */}
      {showReturnSheet && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Devolver ao Consultor</h3>
              <button onClick={() => setShowReturnSheet(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-3">Obrigatório: indicar motivo da devolução</p>
            <textarea value={returnComment} onChange={(e) => setReturnComment(e.target.value)}
              className="w-full h-28 bg-slate-50 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 resize-none outline-none focus:border-blue-400"
              placeholder="Descreva o motivo..." />
            <button onClick={() => { setShowReturnSheet(false); setShowSuccess("returned"); }}
              disabled={!returnComment.trim()}
              className="w-full mt-3 py-4 rounded-2xl text-white font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
              Confirmar Devolução
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// TM Reports
export function TMReports() {
  const { navigate } = useApp();
  const [period, setPeriod] = useState("Maio 2025");
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = (name: string) => {
    setExportSuccess(name);
    setTimeout(() => setExportSuccess(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Relatórios" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Filtros</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Período", value: "Maio 2025" },
              { label: "Área", value: "Todas" },
              { label: "Service Line", value: "Todas" },
              { label: "Nível", value: "Todos" },
            ].map((f) => (
              <div key={f.label} className="bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
                <p className="text-[10px] text-slate-400">{f.label}</p>
                <p className="text-sm font-medium text-slate-700">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Indicadores</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "% Badges aprovados", value: "68%", color: "#10b981" },
              { label: "Badges por mês", value: "12", color: "#0066cc" },
              { label: "Badges por LP", value: "4.3", color: "#8b5cf6" },
              { label: "Utilizadores ativos", value: "48", color: "#f59e0b" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exports */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Exportar</h4>
          {exportSuccess && (
            <div className="mb-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <span className="text-sm text-emerald-700 font-medium">A exportar: {exportSuccess}...</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {[
              "Pedidos (Excel)",
              "Badges (PDF)",
              "Consultores (Excel)",
              "Aprovações (PDF)",
              "Rejeições (Excel)",
            ].map((exp) => (
              <button key={exp} onClick={() => handleExport(exp)}
                className="flex items-center gap-3 py-3 px-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                <Download size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700">{exp}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TMBottomNav />
    </div>
  );
}

// TM Users
export function TMUsersList() {
  const { navigate } = useApp();
  const [search, setSearch] = useState("");
  const consultors = mockUsers.filter((u) => u.role === "consultor");
  const filtered = consultors.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Consultores" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Pesquisar consultor..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20 flex flex-col gap-2">
        {filtered.map((user) => (
          <button key={user.id} onClick={() => navigate("tm-user-detail", { userId: user.id })}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.area}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-400">🏅 {user.badges} badges</span>
                <span className="text-[10px] text-slate-400">⭐ {user.points} pts</span>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {user.status === "active" ? "Ativo" : "Inativo"}
            </span>
          </button>
        ))}
      </div>
      <TMBottomNav />
    </div>
  );
}

// TM More
export function TMMoreScreen() {
  const { navigate } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const items = [
    { icon: "⏰", label: "Badges a expirar", screen: "tm-expiring" as const },
    { icon: "📅", label: "Histórico de Processos", screen: "tm-history" as const },
    { icon: "📢", label: "Avisos", screen: "notices" as const },
    { icon: "⚙️", label: "Definições", screen: "c-settings" as const },
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
      <TMBottomNav />

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
