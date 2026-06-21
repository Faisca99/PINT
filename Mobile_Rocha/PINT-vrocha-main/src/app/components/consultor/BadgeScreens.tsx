import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Star, Users, CheckCircle, Upload, X, Share2, ExternalLink, Download, ChevronLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppHeader } from "../shared/AppHeader";
import { ConsultorBottomNav } from "../shared/BottomNav";
import { LevelChip, StatusChip } from "../shared/StatusChip";
import { getBadges, getBadgeById, type ApiBadge } from "../../services/badgeService";
import { getMyBadges, type MyBadge } from "../../services/meService";
import { getMyApplications, type ApiApplicationSummary } from "../../services/applicationService";
import { getBadgeIcon, getBadgeColor, formatDate, isExpiringSoon, isExpired, LEVEL_NAMES } from "../../lib/badgeUtils";
import { WEB_BASE } from "../../lib/config";

type BadgeStatus = "obtained" | "in-progress" | "available";

interface MergedBadge extends ApiBadge {
  computedStatus: BadgeStatus;
  myBadge?: MyBadge;
}

function mergeBadgeData(
  allBadges: ApiBadge[],
  myBadges: MyBadge[],
  apps: ApiApplicationSummary[]
): MergedBadge[] {
  const myBadgeMap = new Map(myBadges.map((b) => [b.badge_id, b]));
  const inProgressIds = new Set(
    apps.filter((a) => ["open", "submitted", "em-validacao", "devolvido"].includes(a.status)).map((a) => a.badge_id)
  );
  return allBadges.map((b) => {
    const myBadge = myBadgeMap.get(b.id);
    const computedStatus: BadgeStatus = myBadge ? "obtained" : inProgressIds.has(b.id) ? "in-progress" : "available";
    return { ...b, computedStatus, myBadge };
  });
}

// Badge Catalog
export function BadgeCatalog() {
  const { navigate, user } = useApp();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [badges, setBadges] = useState<MergedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, myB, apps] = await Promise.all([getBadges(), getMyBadges(), getMyApplications()]);
        setBadges(mergeBadgeData(all, myB, apps));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const tabs = ["Todos", "Recomendados", "Obtidos", "Em Progresso"];
  const levels = [...new Set(badges.map((b) => b.level_code))].sort();
  const areas = [...new Set(badges.map((b) => b.area_name))];
  const activeFiltersCount = [selectedLevel, selectedArea].filter(Boolean).length;

  const filtered = useMemo(() => {
    return badges.filter((b) => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.area_name.toLowerCase().includes(search.toLowerCase());
      const matchLevel = !selectedLevel || b.level_code === selectedLevel;
      const matchArea = !selectedArea || b.area_name === selectedArea;
      const matchTab =
        activeTab === "Todos" ? true
        : activeTab === "Obtidos" ? b.computedStatus === "obtained"
        : activeTab === "Em Progresso" ? b.computedStatus === "in-progress"
        : activeTab === "Recomendados" ? b.area_name === (user?.area ?? "") || b.computedStatus !== "obtained"
        : true;
      return matchSearch && matchLevel && matchArea && matchTab;
    });
  }, [badges, search, selectedLevel, selectedArea, activeTab, user]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Catálogo de Badges" showNotif />

      <div className="px-4 pb-3 bg-white border-b border-slate-100">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
            <Search size={14} className="text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              placeholder="Pesquisar badges..." />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`relative px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters || activeFiltersCount > 0 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
            <Filter size={14} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{activeFiltersCount}</span>
            )}
          </button>
        </div>
        {showFilters && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">Filtros</p>
              {activeFiltersCount > 0 && (
                <button onClick={() => { setSelectedLevel(""); setSelectedArea(""); }} className="text-xs text-blue-600 font-medium">Limpar</button>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Nível</p>
              <div className="flex gap-1.5 flex-wrap">
                <FilterPill label="Todos" active={!selectedLevel} onClick={() => setSelectedLevel("")} />
                {levels.map((l) => <FilterPill key={l} label={`${l} — ${LEVEL_NAMES[l] ?? l}`} active={selectedLevel === l} onClick={() => setSelectedLevel(l === selectedLevel ? "" : l)} />)}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Área</p>
              <div className="flex gap-1.5 flex-wrap">
                <FilterPill label="Todas" active={!selectedArea} onClick={() => setSelectedArea("")} />
                {areas.map((a) => <FilterPill key={a} label={a} active={selectedArea === a} onClick={() => setSelectedArea(a === selectedArea ? "" : a)} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex bg-white border-b border-slate-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title="Nenhum badge encontrado" desc="Tente ajustar os filtros ou a pesquisa." />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} onClick={() => navigate("c-badge-detail", { badgeId: badge.id })} />
            ))}
          </div>
        )}
      </div>

      <ConsultorBottomNav />
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>
      {label}
    </button>
  );
}

function BadgeCard({ badge, onClick }: { badge: MergedBadge; onClick: () => void }) {
  const icon = getBadgeIcon(badge.area_name, badge.level_code);
  const color = getBadgeColor(badge.level_code);
  return (
    <button onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-98 transition-all flex gap-3">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
        style={{ background: `${color}22` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-semibold text-slate-800 text-sm leading-tight">{badge.name}</p>
          <LevelChip level={badge.level_code} size="sm" />
        </div>
        <p className="text-xs text-slate-500 mb-2">{badge.area_name} · {badge.service_line_name}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-amber-600">
            <Star size={10} fill="#f59e0b" /> {badge.points} pts
          </span>
          <StatusChip status={badge.computedStatus} size="sm" />
        </div>
        {badge.myBadge?.expires_at && isExpiringSoon(badge.myBadge.expires_at) && (
          <p className="text-[10px] text-amber-600 mt-1">⏰ Expira em {formatDate(badge.myBadge.expires_at)}</p>
        )}
      </div>
    </button>
  );
}

// Badge Detail
export function BadgeDetail() {
  const { screenParams, navigate, goBack } = useApp();
  const badgeId = screenParams.badgeId as number;
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getBadgeById>> | null>(null);
  const [myBadge, setMyBadge] = useState<MyBadge | null>(null);
  const [status, setStatus] = useState<BadgeStatus>("available");
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [det, myBadges] = await Promise.all([getBadgeById(badgeId), getMyBadges()]);
        setDetail(det);
        const mine = myBadges.find((b) => b.badge_id === badgeId);
        if (mine) { setMyBadge(mine); setStatus("obtained"); }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [badgeId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50">
        <span className="text-4xl">😕</span>
        <p className="text-slate-500">Badge não encontrado.</p>
        <button onClick={goBack} className="text-blue-600 font-medium">Voltar</button>
      </div>
    );
  }

  const { badge, requirements } = detail;
  const icon = getBadgeIcon(badge.area_name, badge.level_code);
  const color = getBadgeColor(badge.level_code);

  const handleLinkedIn = () => {
    if (!myBadge?.public_token) return;
    const verifyUrl = `${WEB_BASE}/?verify=${myBadge.public_token}`;
    const text = encodeURIComponent(`Acabei de conquistar o badge ${badge.name} na plataforma PINT 2025 da Softinsa! #PINT2025 #Softinsa`);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(verifyUrl)}&title=${text}`, "_blank");
  };

  const handleCopyLink = async () => {
    if (!myBadge?.public_token) return;
    const link = `${WEB_BASE}/?verify=${myBadge.public_token}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const actionBtn =
    status === "obtained"
      ? { label: "Ver Certificado", action: () => navigate("c-certificate", { badgeId: badge.id, myBadgeId: myBadge?.id }), color: "#10b981" }
      : { label: "Candidatar-me", action: () => navigate("c-new-application", { badgeId: badge.id }), color: "#0066cc" };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="relative h-44 flex items-center justify-center"
        style={{ background: `linear-gradient(160deg, #0f1f3d, ${color})` }}>
        <button onClick={goBack} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <ChevronLeft size={18} className="text-white" />
        </button>
        {status === "obtained" && (
          <button onClick={() => setShowShareModal(true)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Share2 size={16} className="text-white" />
          </button>
        )}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-xl"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            {icon}
          </div>
          {status === "obtained" && (
            <div className="flex items-center gap-1 bg-emerald-500 rounded-full px-3 py-1">
              <CheckCircle size={12} className="text-white" />
              <span className="text-white text-xs font-semibold">Obtido</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white px-5 py-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-slate-800 flex-1">{badge.name}</h2>
            <LevelChip level={badge.level_code} />
          </div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs text-slate-500">{badge.area_name}</span>
            <span className="text-slate-200">·</span>
            <span className="text-xs text-slate-500">{badge.service_line_name}</span>
            <span className="text-slate-200">·</span>
            <span className="flex items-center gap-1 text-xs text-amber-600"><Star size={10} fill="#f59e0b" /> {badge.points} pts</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{badge.description}</p>
          {myBadge?.expires_at && (
            <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2 mb-3">
              <span className="text-amber-600 text-sm">⏰</span>
              <span className="text-xs text-amber-700">Expira em: <strong>{formatDate(myBadge.expires_at)}</strong></span>
            </div>
          )}
          {myBadge?.awarded_at && (
            <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2 mb-3">
              <CheckCircle size={14} className="text-emerald-600" />
              <span className="text-xs text-emerald-700">Obtido em: <strong>{formatDate(myBadge.awarded_at)}</strong></span>
            </div>
          )}
          {myBadge?.points_awarded && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <span className="text-sm">⭐</span>
              <span className="text-xs text-blue-700">+{myBadge.points_awarded} pontos atribuídos</span>
            </div>
          )}
        </div>

        {requirements.length > 0 && (
          <div className="bg-white mt-2 px-5 py-4">
            <h4 className="text-slate-700 mb-3">Requisitos / Evidências</h4>
            <div className="flex flex-col gap-2">
              {requirements.map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Upload size={12} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{req.title}</p>
                    <p className="text-xs text-slate-500">{req.description}</p>
                    {req.evidence_instructions && (
                      <p className="text-xs text-blue-600 mt-1">{req.evidence_instructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white mt-2 px-5 py-4 mb-24">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-400" />
            <span className="text-sm text-slate-600">Badge da área <strong>{badge.area_name}</strong></span>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 px-4 py-4 flex gap-2">
        <button onClick={actionBtn.action}
          className="flex-1 py-4 rounded-2xl text-white font-semibold shadow-md"
          style={{ background: `linear-gradient(135deg, #1a3a6b, ${actionBtn.color})` }}>
          {actionBtn.label}
        </button>
        {status === "obtained" && (
          <button onClick={() => setShowShareModal(true)}
            className="w-14 py-4 rounded-2xl border-2 border-slate-200 flex items-center justify-center">
            <Share2 size={18} className="text-slate-600" />
          </button>
        )}
      </div>

      {showShareModal && (
        <div className="absolute inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-800">Partilhar Badge</h3>
              <button onClick={() => setShowShareModal(false)}><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleLinkedIn}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-left">
                <ExternalLink size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-slate-800">Partilhar no LinkedIn</span>
              </button>
              <button onClick={handleDownloadPDF}
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left">
                <Download size={20} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-800">Download do Certificado PDF</span>
              </button>
              <button onClick={handleCopyLink}
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left">
                <Share2 size={20} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-800">
                  {copied ? "✓ Link copiado!" : "Copiar link de verificação"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-4xl">{icon}</span>
      <h4 className="text-slate-700">{title}</h4>
      <p className="text-slate-400 text-sm text-center">{desc}</p>
    </div>
  );
}
