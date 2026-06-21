import { useState } from "react";
import { Search, ChevronRight, FileText, Clock, X, AlertTriangle, Download } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppHeader, DashboardHeader } from "../shared/AppHeader";
import { SLLBottomNav } from "../shared/BottomNav";
import { StatusChip, LevelChip, SLAChip } from "../shared/StatusChip";
import { mockApplications, mockUsers, mockLeaderboard, monthlyBadgesData } from "../../data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

// SLL Dashboard
export function SLLDashboard() {
  const { user, navigate } = useApp();
  const validating = mockApplications.filter((a) => a.status === "em-validacao").length;
  const approved = mockApplications.filter((a) => a.status === "fechado-aprovado").length;
  const slaRisk = mockApplications.filter((a) => a.slaRisk).length;
  const teamSize = mockUsers.filter((u) => u.role === "consultor" && u.serviceLine === "Technology").length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <DashboardHeader greeting="Bem-vinda," name={user.name} area={`Service Line Leader · ${user.serviceLine}`} avatar={user.avatar} />
      <div className="flex-1 overflow-y-auto pb-4">
        {slaRisk > 0 && (
          <div className="mx-4 mt-3 bg-red-50 rounded-2xl p-3 border border-red-200 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">{slaRisk} SLA em risco</p>
              <p className="text-xs text-red-500">Ação necessária</p>
            </div>
            <button onClick={() => navigate("sll-approvals")} className="text-xs text-red-600 font-semibold">Ver →</button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 px-4 py-3">
          {[
            { label: "Em Validação", value: validating, icon: "🔄", screen: "sll-approvals" as const },
            { label: "Aprovados", value: approved, icon: "✅", screen: "sll-approvals" as const },
            { label: "Equipa", value: teamSize, icon: "👥", screen: "sll-ranking" as const },
            { label: "SLA Risco", value: slaRisk, icon: "⚠️", screen: "sll-approvals" as const },
          ].map((card) => (
            <button key={card.label} onClick={() => navigate(card.screen)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left">
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Team progress */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <h4 className="text-slate-800 mb-3">Progresso da Equipa — Technology</h4>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={monthlyBadgesData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Bar dataKey="badges" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top performers */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-800">Top da Equipa</h4>
            <button onClick={() => navigate("sll-ranking")} className="text-xs text-blue-600 font-medium">Ver tudo</button>
          </div>
          {mockLeaderboard.slice(0, 3).map((user, i) => (
            <div key={user.rank} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <span className={`text-sm font-bold w-5 ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-400"}`}>#{i + 1}</span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{user.name}</p>
              </div>
              <span className="text-xs font-bold text-slate-600">{user.points} pts</span>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-800">Para Aprovar</h4>
            <button onClick={() => navigate("sll-approvals")} className="text-xs text-blue-600 font-medium">Ver todas</button>
          </div>
          {mockApplications.filter((a) => a.status === "em-validacao").slice(0, 2).map((app) => (
            <button key={app.id} onClick={() => navigate("sll-approval-detail", { appId: app.id })}
              className="flex items-center gap-3 w-full py-2.5 border-b border-slate-50 last:border-0 text-left">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{app.consultorName}</p>
                <p className="text-xs text-slate-400">{app.badgeTitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>

        <div className="px-4">
          <button onClick={() => navigate("sll-approvals")}
            className="w-full py-4 rounded-2xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Ver Aprovações Pendentes
          </button>
        </div>
      </div>
      <SLLBottomNav />
    </div>
  );
}

// Approvals List
export function SLLApprovalsList() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState("Em Validação");
  const [search, setSearch] = useState("");
  const tabs = ["Em Validação", "Aprovadas", "Rejeitadas", "Devolvidas"];

  const filtered = mockApplications.filter((a) => {
    const matchSearch = a.consultorName.toLowerCase().includes(search.toLowerCase()) || a.badgeTitle.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "Em Validação" ? a.status === "em-validacao"
      : activeTab === "Aprovadas" ? a.status === "fechado-aprovado"
      : activeTab === "Rejeitadas" ? a.status === "fechado-rejeitado"
      : a.status === "devolvido";
    return matchSearch && matchTab;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Aprovações" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Consultor ou badge..." />
        </div>
      </div>
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
              <button key={app.id} onClick={() => navigate("sll-approval-detail", { appId: app.id })}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{app.consultorName}</p>
                    <p className="text-xs text-slate-500">{app.consultorArea}</p>
                  </div>
                  <LevelChip level={app.badgeLevel} size="sm" />
                </div>
                <p className="text-sm text-slate-600 mb-2">{app.badgeTitle}</p>
                <div className="flex items-center gap-2">
                  <StatusChip status={app.status} size="sm" />
                  {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
                  <span className="text-xs text-slate-400 ml-auto">{app.submittedDate}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <SLLBottomNav />
    </div>
  );
}

// Approval Detail
export function SLLApprovalDetail() {
  const { screenParams, navigate } = useApp();
  const app = mockApplications.find((a) => a.id === screenParams.appId) ?? mockApplications[0];
  const [showRejectSheet, setShowRejectSheet] = useState(false);
  const [showSendBackSheet, setShowSendBackSheet] = useState(false);
  const [comment, setComment] = useState("");
  const [result, setResult] = useState<"approved" | "rejected" | "returned" | null>(null);

  if (result) {
    const config = {
      approved: { icon: "🎉", title: "Badge Aprovado!", desc: `${app.consultorName} recebeu o badge ${app.badgeTitle}. Uma notificação foi enviada.`, color: "#10b981" },
      rejected: { icon: "❌", title: "Candidatura Rejeitada", desc: `A candidatura de ${app.consultorName} foi rejeitada. O consultor foi notificado.`, color: "#ef4444" },
      returned: { icon: "↩️", title: "Devolvida ao Consultor", desc: "A candidatura foi devolvida para o consultor rever as evidências.", color: "#f97316" },
    };
    const cfg = config[result];
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl" style={{ background: `${cfg.color}22` }}>
          {cfg.icon}
        </div>
        <div className="text-center">
          <h3 className="text-slate-800 mb-2">{cfg.title}</h3>
          <p className="text-slate-500 text-sm">{cfg.desc}</p>
        </div>
        <button onClick={() => navigate("sll-approvals")}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Voltar às Aprovações
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Detalhe de Aprovação" showBack />
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
          <p className="text-sm font-medium text-slate-700 mb-1">{app.badgeTitle}</p>
          <div className="flex items-center gap-2">
            <LevelChip level={app.badgeLevel} />
            <StatusChip status={app.status} />
            {app.slaDeadline && <SLAChip deadline={app.slaDeadline} risk={app.slaRisk} />}
          </div>
        </div>

        {app.lastComment && (
          <div className="bg-white mt-2 px-5 py-4">
            <h4 className="text-slate-700 mb-2">Nota do Talent Manager</h4>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-sm text-slate-600 italic">"{app.lastComment}"</p>
              <p className="text-xs text-slate-400 mt-1">— Carlos Mendes (Talent Manager)</p>
            </div>
          </div>
        )}

        <div className="bg-white mt-2 px-5 py-4">
          <h4 className="text-slate-700 mb-3">Evidências</h4>
          {app.evidences.map((ev) => (
            <div key={ev.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
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

        <div className="bg-white mt-2 px-5 py-4">
          <h4 className="text-slate-700 mb-3">Histórico</h4>
          {app.timeline.map((event) => (
            <div key={event.id} className="flex gap-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={10} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{event.action}</p>
                <p className="text-[10px] text-slate-400">{event.actor} · {event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {app.status === "em-validacao" && (
        <div className="bg-white border-t border-slate-100 px-4 py-4 flex gap-2">
          <button onClick={() => setShowSendBackSheet(true)}
            className="flex-1 py-3 rounded-2xl border-2 border-orange-300 text-orange-700 font-semibold text-sm">
            Devolver
          </button>
          <button onClick={() => setShowRejectSheet(true)}
            className="flex-1 py-3 rounded-2xl border-2 border-red-300 text-red-700 font-semibold text-sm">
            Rejeitar
          </button>
          <button onClick={() => setResult("approved")}
            className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
            Aprovar
          </button>
        </div>
      )}

      {/* Reject bottom sheet */}
      {showRejectSheet && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Rejeitar Candidatura</h3>
              <button onClick={() => setShowRejectSheet(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              className="w-full h-28 bg-slate-50 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 resize-none outline-none"
              placeholder="Motivo da rejeição (obrigatório)..." />
            <button onClick={() => { setShowRejectSheet(false); setResult("rejected"); }}
              disabled={!comment.trim()}
              className="w-full mt-3 py-4 rounded-2xl text-white font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)" }}>
              Confirmar Rejeição
            </button>
          </div>
        </div>
      )}

      {showSendBackSheet && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Devolver ao Consultor</h3>
              <button onClick={() => setShowSendBackSheet(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              className="w-full h-28 bg-slate-50 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 resize-none outline-none"
              placeholder="Motivo da devolução (obrigatório)..." />
            <button onClick={() => { setShowSendBackSheet(false); setResult("returned"); }}
              disabled={!comment.trim()}
              className="w-full mt-3 py-4 rounded-2xl text-white font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}>
              Confirmar Devolução
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// SLL Ranking
export function SLLRanking() {
  const { navigate } = useApp();
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Ranking da Service Line" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {/* Service Line info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4"
          style={{ background: "linear-gradient(135deg, #0f1f3d, #1a3a6b)" }}>
          <p className="text-blue-200 text-xs mb-1">Technology Service Line</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-lg">8 consultores</p>
              <p className="text-blue-300 text-xs">7.240 pontos totais</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold">42</p>
              <p className="text-blue-300 text-xs">badges totais</p>
            </div>
          </div>
        </div>

        {/* Top 3 */}
        <div className="flex items-end justify-center gap-3 mb-4">
          {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((user, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const height = rank === 1 ? "h-20" : rank === 2 ? "h-16" : "h-14";
            const bg = rank === 1 ? "#f59e0b33" : rank === 2 ? "#94a3b833" : "#cd7c3e33";
            const border = rank === 1 ? "#f59e0b66" : rank === 2 ? "#94a3b866" : "#cd7c3e66";
            return (
              <div key={user.rank} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <span className="text-[10px] text-slate-600 font-medium w-14 text-center truncate">{user.name.split(" ")[0]}</span>
                <div className={`w-14 ${height} rounded-t-xl flex items-start justify-center pt-1`} style={{ background: bg, border: `2px solid ${border}` }}>
                  <span className="text-xs font-bold" style={{ color: border }}>#{rank}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="flex flex-col gap-2">
          {mockLeaderboard.map((user) => (
            <div key={user.rank} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
              <span className={`text-sm font-bold w-6 ${user.rank <= 3 ? "text-amber-600" : "text-slate-400"}`}>#{user.rank}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-400">{user.area}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">{user.points.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">{user.badges} badges</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SLLBottomNav />
    </div>
  );
}

// SLL Reports
export function SLLReports() {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const handleExport = (name: string) => {
    setExportSuccess(name);
    setTimeout(() => setExportSuccess(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Relatórios" showNotif />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Indicadores — Technology</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Badges atribuídos", value: "42", color: "#0066cc" },
              { label: "% Aprovação", value: "87%", color: "#10b981" },
              { label: "Candidaturas abertas", value: "5", color: "#f59e0b" },
              { label: "Média pontos/consultor", value: "905", color: "#8b5cf6" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <h4 className="text-slate-700 mb-3">Exportar</h4>
          {exportSuccess && (
            <div className="mb-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <span className="text-emerald-600 text-sm">✓</span>
              <span className="text-sm text-emerald-700 font-medium">A exportar: {exportSuccess}...</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {["Candidaturas (Excel)", "Badges (PDF)", "Consultores (Excel)", "Aprovações (PDF)"].map((exp) => (
              <button key={exp} onClick={() => handleExport(exp)}
                className="flex items-center gap-3 py-3 px-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                <Download size={16} className="text-blue-600" />
                <span className="text-sm text-slate-700">{exp}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <SLLBottomNav />
    </div>
  );
}

// SLL More
export function SLLMoreScreen() {
  const { navigate } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const items = [
    { icon: "📊", label: "Métricas Comparativas", screen: "sll-metrics" as const },
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
      <SLLBottomNav />

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
