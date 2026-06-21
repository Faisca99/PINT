import { useState, useEffect, useRef } from "react";
import { Search, Upload, FileText, CheckCircle, X, ChevronLeft, Clock, Plus, Camera, Paperclip } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { AppHeader } from "../shared/AppHeader";
import { ConsultorBottomNav } from "../shared/BottomNav";
import { StatusChip, LevelChip } from "../shared/StatusChip";
import {
  getMyApplications, getApplicationById, createApplication, addEvidence, submitApplication,
  type ApiApplicationSummary, type ApiApplicationDetail, type ApiEvidence,
} from "../../services/applicationService";
import { getBadgeById, type ApiBadgeRequirement } from "../../services/badgeService";
import { getBadgeIcon, getBadgeColor, formatDate, LEVEL_NAMES } from "../../lib/badgeUtils";

// Applications List
export function ApplicationsList() {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [apps, setApps] = useState<ApiApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications().then(setApps).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tabs = ["Todas", "Abertas", "Submetidas", "Em Validação", "Fechadas"];

  const filtered = apps.filter((a) => {
    const matchSearch = a.badge_name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "Todas" ? true
      : activeTab === "Abertas" ? ["open", "devolvido"].includes(a.status)
      : activeTab === "Submetidas" ? a.status === "submitted"
      : activeTab === "Em Validação" ? a.status === "em-validacao"
      : ["fechado-aprovado", "fechado-rejeitado"].includes(a.status);
    return matchSearch && matchTab;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Candidaturas" showNotif />
      <div className="bg-white px-4 pb-3">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
          <Search size={14} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            placeholder="Pesquisar candidaturas..." />
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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-slate-500 text-sm">Sem candidaturas nesta categoria</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} onClick={() => navigate("c-application-detail", { appId: app.id })} />
            ))}
          </div>
        )}
      </div>
      <div className="px-4 pb-2 bg-white border-t border-slate-100">
        <button onClick={() => navigate("c-badges")}
          className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 my-2"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          <Plus size={16} /> Nova Candidatura
        </button>
      </div>
      <ConsultorBottomNav />
    </div>
  );
}

function AppCard({ app, onClick }: { app: ApiApplicationSummary; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-98 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${getBadgeColor(app.level_code)}22` }}>
            <span className="text-sm">{getBadgeIcon(app.area_name, app.level_code)}</span>
          </div>
          <p className="font-semibold text-sm text-slate-800 truncate">{app.badge_name}</p>
        </div>
        <LevelChip level={app.level_code} size="sm" />
      </div>
      <div className="flex items-center justify-between">
        <StatusChip status={app.status} size="sm" />
        <span className="text-xs text-slate-400">{formatDate(app.created_at)}</span>
      </div>
      {app.final_result && (
        <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-2 py-1.5">
          Resultado: {app.final_result}
        </div>
      )}
    </button>
  );
}

// Application Detail
export function ApplicationDetail() {
  const { screenParams, goBack, navigate } = useApp();
  const appId = screenParams.appId as number;
  const [app, setApp] = useState<ApiApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getApplicationById(appId).then(setApp).catch(() => {}).finally(() => setLoading(false));
  }, [appId]);

  const handleSubmit = async () => {
    if (!app) return;
    setSubmitting(true);
    setError("");
    try {
      await submitApplication(app.id);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao submeter candidatura.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-slate-800 mb-2">Candidatura submetida!</h2>
          <p className="text-slate-500 text-sm">A sua candidatura para <strong>{app.badge_name}</strong> foi submetida com sucesso para validação.</p>
        </div>
        <button onClick={() => navigate("c-applications")}
          className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Ver Candidaturas
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50">
        <span className="text-4xl">😕</span>
        <p className="text-slate-500">Candidatura não encontrada.</p>
        <button onClick={goBack} className="text-blue-600 font-medium">Voltar</button>
      </div>
    );
  }

  const statusSteps = [
    { label: "Aberta", status: "open" },
    { label: "Submetida", status: "submitted" },
    { label: "Em Validação", status: "em-validacao" },
    { label: "Fechada", status: "fechado-aprovado" },
  ];
  const currentStepIdx = ["fechado-aprovado", "fechado-rejeitado"].includes(app.status) ? 3
    : app.status === "em-validacao" ? 2
    : app.status === "submitted" ? 1 : 0;

  const canEdit = ["open", "devolvido"].includes(app.status);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <AppHeader title="Detalhe da Candidatura" showBack />
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="bg-white px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-800">{app.badge_name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusChip status={app.status} />
            {app.final_result && <span className="text-xs text-slate-500">· {app.final_result}</span>}
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="bg-white mt-2 px-5 py-4">
          <h4 className="text-slate-700 mb-4">Estado</h4>
          <div className="flex items-center gap-0">
            {statusSteps.map((step, i) => {
              const done = i <= currentStepIdx;
              const active = i === currentStepIdx;
              return (
                <div key={step.status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                      ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200" : done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {done && !active ? "✓" : i + 1}
                    </div>
                    <span className={`text-[10px] text-center ${active ? "text-blue-600 font-semibold" : done ? "text-emerald-600" : "text-slate-400"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 transition-colors ${i < currentStepIdx ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-700">Evidências</h4>
            {canEdit && (
              <button onClick={() => navigate("c-new-application", { appId: app.id, badgeId: app.badge_id })}
                className="text-xs text-blue-600 font-medium">Adicionar</button>
            )}
          </div>
          {app.evidences.length === 0 ? (
            <p className="text-xs text-slate-400">Sem evidências submetidas.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {app.evidences.map((ev) => (
                <EvidenceRow key={ev.id} evidence={ev} />
              ))}
            </div>
          )}
        </div>
      </div>

      {canEdit && (
        <div className="bg-white border-t border-slate-100 px-4 py-4">
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            {submitting ? "A submeter..." : app.status === "devolvido" ? "Reenviar Candidatura" : "Submeter Candidatura"}
          </button>
        </div>
      )}
    </div>
  );
}

function EvidenceRow({ evidence }: { evidence: ApiEvidence }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
        <FileText size={14} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{evidence.requirement_title}</p>
        <p className="text-xs text-slate-400">{evidence.file_name} · {formatDate(evidence.uploaded_at)}</p>
        {evidence.description && <p className="text-xs text-slate-500 mt-0.5">{evidence.description}</p>}
      </div>
    </div>
  );
}

// New Application — create + evidence upload + submit
export function NewApplicationScreen() {
  const { goBack, navigate, screenParams } = useApp();
  const badgeId = screenParams.badgeId as number;
  const existingAppId = screenParams.appId as number | undefined;

  const [step, setStep] = useState(1);
  const [submittedFinal, setSubmittedFinal] = useState(false);
  const [requirements, setRequirements] = useState<ApiBadgeRequirement[]>([]);
  const [badgeName, setBadgeName] = useState("");
  const [badgePoints, setBadgePoints] = useState(0);
  const [badgeLevelCode, setBadgeLevelCode] = useState("");
  const [appId, setAppId] = useState<number | null>(existingAppId ?? null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const detail = await getBadgeById(badgeId);
        setRequirements(detail.requirements);
        setBadgeName(detail.badge.name);
        setBadgePoints(detail.badge.points);
        setBadgeLevelCode(detail.badge.level_code);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [badgeId]);

  const handleFileSelect = (reqId: number, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [reqId]: file }));
  };

  const handleRemoveFile = (reqId: number) => {
    setUploadedFiles((prev) => { const next = { ...prev }; delete next[reqId]; return next; });
  };

  const handleNext = async () => {
    if (!appId) {
      try {
        const res = await createApplication(badgeId);
        setAppId(res.id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao criar candidatura.");
        return;
      }
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!appId) return;
    setUploading(true);
    setError("");
    try {
      for (const req of requirements) {
        const file = uploadedFiles[req.id];
        if (!file) continue;
        await addEvidence(appId, {
          requirementId: req.id,
          fileName: file.name,
          storageKey: `evidences/${appId}/${req.id}/${file.name}`,
          fileUrl: URL.createObjectURL(file),
          description: req.title,
        });
      }
      await submitApplication(appId);
      setSubmittedFinal(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao submeter candidatura.");
    } finally {
      setUploading(false);
    }
  };

  if (submittedFinal) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-slate-800 mb-2">Candidatura submetida!</h2>
          <p className="text-slate-500 text-sm">A sua candidatura para <strong>{badgeName}</strong> foi submetida com sucesso. Aguarde validação.</p>
        </div>
        <button onClick={() => navigate("c-applications")}
          className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Ver Candidaturas
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={step === 1 ? goBack : () => setStep(1)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h3 className="text-slate-800 text-sm">Nova Candidatura</h3>
          <div className="flex gap-1 mt-1">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 rounded-full flex-1 ${s <= step ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
              <span className="text-3xl">{getBadgeIcon("LowCode", badgeLevelCode)}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{badgeName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <LevelChip level={badgeLevelCode} size="sm" />
                  <span className="text-xs text-slate-500">{badgePoints} pts</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-slate-700 mb-3">Requisitos necessários</h4>
              <div className="flex flex-col gap-2">
                {requirements.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Upload size={14} className="text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">{req.title}</span>
                    </div>
                    <p className="text-xs text-slate-500">{req.description}</p>
                    {req.evidence_instructions && (
                      <p className="text-xs text-blue-600 mt-1">{req.evidence_instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-700">Fazer upload das evidências</h4>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-700">Formatos aceites: PDF, PNG, JPG, DOCX · Tamanho máximo: 10MB</p>
            </div>
            {requirements.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-2">{req.title}</p>
                {uploadedFiles[req.id] ? (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                    <FileText size={16} className="text-emerald-600" />
                    <span className="text-sm text-emerald-700 flex-1 truncate">{uploadedFiles[req.id].name}</span>
                    <button onClick={() => handleRemoveFile(req.id)}>
                      <X size={14} className="text-slate-400" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => fileRefs.current[req.id]?.click()}
                      className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <Paperclip size={16} />
                      <span className="text-xs">Ficheiro</span>
                    </button>
                    <button onClick={() => fileRefs.current[req.id]?.click()}
                      className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <Camera size={16} />
                      <span className="text-xs">Foto</span>
                    </button>
                    <input
                      ref={(el) => { fileRefs.current[req.id] = el; }}
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.docx"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(req.id, f); }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border-t border-slate-100 px-4 py-4 flex gap-2">
        {step === 1 ? (
          <button onClick={handleNext}
            className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Próximo
          </button>
        ) : (
          <>
            <button onClick={() => setStep(1)}
              className="py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm">
              Voltar
            </button>
            <button onClick={handleSubmit} disabled={uploading}
              className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              {uploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> A submeter...</> : "Submeter"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
