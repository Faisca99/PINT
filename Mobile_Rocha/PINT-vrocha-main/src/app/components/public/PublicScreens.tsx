import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Shield, Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { LevelChip } from "../shared/StatusChip";
import { verifyBadgeToken, getNotices, getPublicGallery, type PublicBadgeVerification, type Notice, type MyBadge } from "../../services/meService";
import { getBadgeIcon, getBadgeColor, formatDate, getInitials, LEVEL_NAMES } from "../../lib/badgeUtils";

// ─── Public Badge Verification ────────────────────────────────────────────────

export function PublicBadgeVerification() {
  const { goBack, screenParams } = useApp();
  const token = (screenParams.token ?? screenParams.public_token) as string | undefined;
  const [verifying, setVerifying] = useState(true);
  const [result, setResult] = useState<PublicBadgeVerification | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) { setError(true); setVerifying(false); return; }
    verifyBadgeToken(token)
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setVerifying(false));
  }, [token]);

  if (verifying) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(160deg, #0f1f3d 0%, #1a3a6b 100%)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: "rgba(255,255,255,0.15)" }}>🏅</div>
        <p className="text-white font-semibold">A verificar badge...</p>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const isValid = result?.is_valid ?? false;
  const icon = result ? getBadgeIcon(result.area_name, result.level_code) : "🏅";
  const color = result ? getBadgeColor(result.level_code) : "#0066cc";

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-5 py-8 flex flex-col items-center gap-3"
        style={{ background: `linear-gradient(160deg, #0f1f3d, ${isValid ? "#059669" : "#dc2626"})` }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-xl"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          {icon}
        </div>
        <div className="flex items-center gap-2">
          {isValid
            ? <><CheckCircle size={18} className="text-emerald-300" /><span className="text-emerald-200 text-sm font-semibold">Badge Válido</span></>
            : <><XCircle size={18} className="text-red-300" /><span className="text-red-200 text-sm font-semibold">Badge Inválido ou Expirado</span></>
          }
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-6 flex flex-col gap-4">
        <div className={`rounded-2xl p-4 border ${isValid ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isValid ? "bg-emerald-100" : "bg-red-100"}`}>
              {isValid ? <Shield size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-red-600" />}
            </div>
            <div>
              <p className={`font-semibold text-sm ${isValid ? "text-emerald-800" : "text-red-800"}`}>
                {isValid ? "Badge verificado com sucesso" : error ? "Badge não encontrado" : "Badge inválido ou expirado"}
              </p>
              <p className={`text-xs ${isValid ? "text-emerald-600" : "text-red-600"}`}>
                {isValid ? "Esta certificação é autêntica e válida." : "Não foi possível verificar esta certificação."}
              </p>
            </div>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${color}22` }}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-slate-800 text-base">{result.badge_name}</h3>
                    <LevelChip level={result.level_code} />
                  </div>
                  <p className="text-xs text-slate-500">{result.area_name} · {LEVEL_NAMES[result.level_code] ?? result.level_code}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Certificado emitido para</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                  {getInitials(result.consultant_name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{result.consultant_name}</p>
                  <p className="text-xs text-slate-500">{result.area_name} · Softinsa</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Datas</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> Data de emissão
                  </span>
                  <span className="text-sm font-medium text-slate-800">{formatDate(result.awarded_at)}</span>
                </div>
                {result.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 flex items-center gap-2">
                      <Calendar size={14} className="text-amber-500" /> Validade
                    </span>
                    <span className="text-sm font-medium text-slate-800">{formatDate(result.expires_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl">🏅</div>
              <div>
                <p className="text-xs text-slate-500">Emitido por</p>
                <p className="font-semibold text-slate-800 text-sm">PINT 2025 — Softinsa · IBM</p>
                <p className="text-xs text-blue-600 flex items-center gap-1"><ExternalLink size={10} /> pint.softinsa.pt</p>
              </div>
            </div>
          </>
        )}

        <button onClick={goBack}
          className="w-full py-4 rounded-2xl text-white font-semibold"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Voltar
        </button>
      </div>
    </div>
  );
}

// ─── Notices Screen ───────────────────────────────────────────────────────────

export function NoticesScreen() {
  const { goBack } = useApp();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [read, setRead] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotices().then(setNotices).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const catColors: Record<string, string> = {
    Formação: "bg-blue-100 text-blue-700",
    Política: "bg-purple-100 text-purple-700",
    Sistema: "bg-slate-100 text-slate-600",
    Novidades: "bg-emerald-100 text-emerald-700",
    Geral: "bg-gray-100 text-gray-600",
  };

  const unreadCount = notices.filter((n) => !read.has(n.id)).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <span className="text-slate-600 text-lg">←</span>
        </button>
        <h3 className="text-slate-800">Avisos</h3>
        {unreadCount > 0 && (
          <span className="ml-auto text-xs text-blue-600 font-medium">{unreadCount} novos</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-4 flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">📢</span>
            <p className="text-slate-500 text-sm">Sem avisos de momento.</p>
          </div>
        ) : (
          notices.map((notice) => {
            const isRead = read.has(notice.id);
            const cat = notice.category ?? "Geral";
            const date = notice.published_at ?? notice.created_at ?? "";
            const content = notice.content ?? notice.message ?? "";
            return (
              <button key={notice.id}
                onClick={() => setRead((prev) => new Set([...prev, notice.id]))}
                className={`bg-white rounded-2xl p-4 shadow-sm border text-left transition-all ${isRead ? "border-slate-100" : "border-blue-200 bg-blue-50"}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catColors[cat] ?? catColors.Geral}`}>
                        {cat}
                      </span>
                      {!isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className={`text-sm font-semibold ${isRead ? "text-slate-700" : "text-blue-900"}`}>{notice.title}</p>
                  </div>
                  {date && <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDate(date)}</span>}
                </div>
                {content && <p className="text-xs text-slate-500 line-clamp-2">{content}</p>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Public Gallery ───────────────────────────────────────────────────────────

export function PublicGalleryScreen() {
  const { goBack, screenParams } = useApp();
  const userId = screenParams.userId as number | undefined;
  const userName = screenParams.userName as string | undefined;
  const [badges, setBadges] = useState<MyBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getPublicGallery(userId).then(setBadges).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  const displayName = userName ?? "Utilizador";
  const initials = getInitials(displayName);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={goBack} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <span className="text-slate-600">←</span>
        </button>
        <h3 className="text-slate-800">Galeria Pública</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "linear-gradient(135deg, #1e4d8c, #0bacda)" }}>{initials}</div>
          <div>
            <p className="font-bold text-slate-800">{displayName}</p>
            <p className="text-xs mt-0.5" style={{ color: "#0bacda" }}>
              {loading ? "..." : `${badges.length} badges públicos`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : badges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">🏅</span>
            <p className="text-slate-500 text-sm">Nenhum badge público.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div key={badge.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                <span className="text-3xl">{getBadgeIcon(badge.area_name, badge.level_code)}</span>
                <p className="text-xs font-semibold text-slate-800 text-center">{badge.badge_name}</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Verificado</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
