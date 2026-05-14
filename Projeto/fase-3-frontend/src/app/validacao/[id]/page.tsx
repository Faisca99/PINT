"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  User,
  Award,
  FileText,
  Clock,
  AlertCircle,
  MessageSquare,
  RotateCcw,
  Download,
} from "lucide-react";
import { downloadCertificate } from "@/lib/certificate";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useUser, ROLE_LABELS } from "@/lib/user-context";

interface Evidence {
  id: number;
  requirement_id: number;
  file_name: string;
  file_url: string;
  description: string;
  uploaded_at: string;
}

interface HistoryEntry {
  id: number;
  from_status: string | null;
  to_status: string;
  event_type: string;
  comment: string | null;
  occurred_at: string;
  actor_name: string;
  actor_role: string;
}

interface ApplicationDetail {
  id: number;
  applicant_user_id: number;
  applicant_name: string;
  badge_id: number;
  badge_name: string;
  status: string;
  final_result: string | null;
  created_at: string;
  submitted_at: string | null;
  closed_at: string | null;
  evidences: Evidence[];
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ValidacaoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showSendBackForm, setShowSendBackForm] = useState(false);
  const [actionDone, setActionDone] = useState<"approved" | "rejected" | "sent_back" | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [appRes, histRes] = await Promise.all([
          api.get(`/applications/${params.id}`),
          api.get(`/applications/${params.id}/history`),
        ]);
        setApplication(appRes.data);
        setHistory(histRes.data ?? []);
      } catch {
        setError("Não foi possível carregar os detalhes desta candidatura.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (!user) return null;

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(
        `/applications/${params.id}/approve`,
        { comment: comment || undefined }
      );
      setActionDone("approved");
    } catch {
      alert("Erro ao aprovar a candidatura. Tenta novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert("É obrigatório indicar o motivo da rejeição.");
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/applications/${params.id}/reject`, { comment });
      setActionDone("rejected");
    } catch {
      alert("Erro ao rejeitar a candidatura. Tenta novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendBack = async () => {
    if (!comment.trim()) {
      alert("É obrigatório indicar o motivo da devolução.");
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/applications/${params.id}/send-back`, { comment });
      setActionDone("sent_back");
    } catch {
      alert("Erro ao devolver a candidatura. Tenta novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  // Feedback após ação
  if (actionDone) {
    const configs = {
      approved: {
        bg: "bg-green-100", icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
        title: user.role === "talent_manager" ? "Candidatura Validada!" : "Badge Atribuído!",
        msg: user.role === "talent_manager"
          ? "A candidatura foi encaminhada para o Service Line Leader para validação final."
          : "O badge foi atribuído ao consultor com sucesso.",
      },
      rejected: {
        bg: "bg-red-100", icon: <XCircle className="h-10 w-10 text-red-600" />,
        title: "Candidatura Rejeitada",
        msg: "O consultor foi notificado com o motivo da rejeição.",
      },
      sent_back: {
        bg: "bg-amber-100", icon: <ArrowLeft className="h-10 w-10 text-amber-600" />,
        title: "Candidatura Devolvida",
        msg: "A candidatura foi devolvida ao consultor com o teu comentário. O consultor pode corrigir e resubmeter.",
      },
    };
    const cfg = configs[actionDone];
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className={`h-20 w-20 rounded-full ${cfg.bg} flex items-center justify-center mb-6`}>
            {cfg.icon}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{cfg.title}</h2>
          <p className="text-muted-foreground text-center mb-8">{cfg.msg}</p>
          <Link href="/validacao">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar à Caixa de Entrada
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">A carregar candidatura...</div>
      </AppLayout>
    );
  }

  if (error || !application) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error ?? "Candidatura não encontrada."}</p>
          <Link href="/validacao">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const alreadyClosed = application.status === "closed";
  const canDecide =
    (user.role === "talent_manager" && application.status === "submitted") ||
    (user.role === "service_line_leader" && application.status === "in_validation");

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Voltar */}
        <motion.div {...fadeIn} transition={{ delay: 0.0 }}>
          <Link href="/validacao" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Caixa de Entrada
          </Link>
        </motion.div>

        {/* Header da candidatura */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <Card className="border border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-foreground">Revisão de Candidatura #{application.id}</h1>
                    {application.status === "closed" && application.final_result === "approved" && (
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs"
                        onClick={() => downloadCertificate({
                          consultantName: application.applicant_name,
                          badgeName: application.badge_name,
                          levelCode: null, levelName: null, areaName: null, serviceLineName: null,
                          awardedAt: application.closed_at ?? new Date().toISOString(),
                        })}>
                        <Download className="h-3.5 w-3.5" />
                        Baixar Certificado
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {application.applicant_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      {application.badge_name}
                    </span>
                    {application.submitted_at && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Submetida em {new Date(application.submitted_at).toLocaleDateString("pt-PT")}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    application.status === "submitted"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : application.status === "in_validation"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : application.final_result === "approved"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {application.status === "submitted"
                    ? "Submetida"
                    : application.status === "in_validation"
                    ? "Em Validação"
                    : application.final_result === "approved"
                    ? "Aprovada"
                    : "Rejeitada"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Evidências */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                Evidências Submetidas ({application.evidences?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!application.evidences || application.evidences.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Nenhuma evidência submetida.</p>
              ) : (
                <div className="space-y-3">
                  {application.evidences.map((ev, i) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          Requisito #{ev.requirement_id} — Evidência {i + 1}
                        </div>
                        {ev.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">{ev.description}</div>
                        )}
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(ev.uploaded_at).toLocaleDateString("pt-PT")}
                        </div>
                      </div>
                      <a
                        href={ev.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-foreground hover:bg-accent/10 transition-colors shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {ev.file_name ?? "Ver Evidência"}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Histórico da candidatura */}
        {history.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  Histórico da Candidatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-5 space-y-4">
                  {/* linha vertical */}
                  <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                  {history.map((h) => {
                    const eventColors: Record<string, string> = {
                      submitted: "bg-blue-500",
                      approved: "bg-green-500",
                      rejected: "bg-red-500",
                      send_back: "bg-amber-500",
                    };
                    const dot = eventColors[h.event_type] ?? "bg-gray-400";
                    const eventLabels: Record<string, string> = {
                      submitted: "Submetida",
                      approved: "Aprovada",
                      rejected: "Rejeitada",
                      send_back: "Devolvida",
                    };
                    return (
                      <div key={h.id} className="relative flex gap-3">
                        <div className={`absolute -left-3 mt-1 h-3 w-3 rounded-full border-2 border-background ${dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">
                              {eventLabels[h.event_type] ?? h.event_type}
                            </span>
                            <span className="text-xs text-muted-foreground">por {h.actor_name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(h.occurred_at).toLocaleString("pt-PT")}
                            </span>
                          </div>
                          {h.comment && (
                            <p className="text-xs text-muted-foreground mt-0.5 italic">"{h.comment}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Área de decisão */}
        {alreadyClosed ? (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border border-border shadow-card">
              <CardContent className="p-6 text-center text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Esta candidatura já foi <strong>{application.final_result === "approved" ? "aprovada" : "rejeitada"}</strong>.</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : canDecide ? (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border border-border shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  Decisão — {ROLE_LABELS[user.role]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comentário */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Comentário{" "}
                    <span className="text-muted-foreground font-normal">
                      {showRejectForm ? "(obrigatório para rejeição)" : "(opcional)"}
                    </span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adiciona um comentário sobre esta candidatura..."
                    className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-border bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Botões */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading || showRejectForm || showSendBackForm}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {user.role === "talent_manager"
                      ? "Validar e Enviar para SLL"
                      : "Aprovar e Atribuir Badge"}
                  </Button>

                  <Button
                    onClick={() => { setShowSendBackForm(true); setShowRejectForm(false); }}
                    disabled={actionLoading || showRejectForm}
                    variant="outline"
                    className="gap-2 border-amber-400 text-amber-700 hover:bg-amber-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {user.role === "talent_manager" ? "Devolver (Incorreto)" : "Devolver ao Consultor"}
                  </Button>

                  {/* Rejeitar só aparece para o SLL — TM não pode rejeitar */}
                  {user.role === "service_line_leader" && (
                    <Button
                      onClick={() => { setShowRejectForm(true); setShowSendBackForm(false); }}
                      disabled={actionLoading || showSendBackForm}
                      variant="destructive"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  )}
                </div>

                {/* Form Send Back */}
                {showSendBackForm && (
                  <div className="space-y-3 p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                    <p className="text-xs font-medium text-amber-700">
                      ⚠️ Indica o motivo da devolução (obrigatório). O consultor poderá corrigir e resubmeter.
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Descreve o que precisa de ser corrigido..."
                      className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-border bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSendBack} disabled={actionLoading} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                        <RotateCcw className="h-4 w-4" />
                        Confirmar Devolução
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowSendBackForm(false); setComment(""); }} disabled={actionLoading}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Form Rejeição */}
                {showRejectForm && (
                  <div className="space-y-3 p-3 rounded-lg border border-red-200 bg-red-50/50">
                    <p className="text-xs font-medium text-red-700">
                      ⚠️ Confirma a rejeição? O consultor será notificado. Esta ação fecha a candidatura definitivamente.
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Motivo da rejeição (obrigatório)..."
                      className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-border bg-background text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-destructive/30"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleReject} disabled={actionLoading} variant="destructive" className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Confirmar Rejeição
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowRejectForm(false); setComment(""); }} disabled={actionLoading}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <Card className="border border-amber-200 bg-amber-50/50 shadow-sm">
              <CardContent className="p-4 text-sm text-amber-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Não tens permissão para tomar uma decisão nesta candidatura com o teu perfil atual ({ROLE_LABELS[user.role]}).
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
