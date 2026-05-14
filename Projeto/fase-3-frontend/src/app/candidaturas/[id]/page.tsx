"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UploadCloud, CheckCircle2, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface Requirement {
  id: number;
  title: string;
  description: string;
  evidence_instructions: string;
}

interface ApplicationDetail {
  id: number;
  badge_id: number;
  badge_name: string;
  status: string;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ApplicationForm() {
  const params = useParams();

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evidences, setEvidences] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const appRes = await api.get(`/applications/${params.id}`);
        setApplication(appRes.data);

        if (appRes.data?.badge_id) {
          const badgeRes = await api.get(`/badges/${appRes.data.badge_id}`);
          setRequirements(badgeRes.data?.requirements ?? []);
        }
      } catch {
        setError("Não foi possível carregar a candidatura.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const handleSaveEvidence = async (reqId: number) => {
    const url = evidences[reqId]?.trim();
    if (!url) return;
    setSaving(reqId);
    try {
      await api.post(`/applications/${params.id}/evidences`, {
        requirementId: reqId,
        fileName: "evidencia.pdf",
        storageKey: `aplicacoes/${params.id}/${reqId}/evidencia`,
        fileUrl: url,
        description: "Evidência submetida pelo consultor",
      });
      setEvidences((prev) => ({ ...prev, [`saved_${reqId}`]: url }));
    } catch {
      alert("Erro ao guardar evidência. Tenta novamente.");
    } finally {
      setSaving(null);
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/applications/${params.id}/submit`, {});
      setSubmitted(true);
    } catch {
      alert("Erro ao submeter a candidatura. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          A carregar formulário...
        </div>
      </AppLayout>
    );
  }

  if (error || !application) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">{error ?? "Candidatura não encontrada."}</p>
          <Link href="/candidaturas">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (application.status !== "open") {
    const STATUS_LABELS: Record<string, { label: string; color: string }> = {
      submitted:     { label: "Submetida — a aguardar Talent Manager", color: "text-amber-600 bg-amber-50 border-amber-200" },
      in_validation: { label: "Em Validação — a aguardar Service Line Leader", color: "text-blue-600 bg-blue-50 border-blue-200" },
      closed:        { label: application.final_result === "approved" ? "Aprovada ✓" : "Rejeitada ✗",
                       color: application.final_result === "approved" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200" },
    };
    const statusCfg = STATUS_LABELS[application.status] ?? { label: application.status, color: "text-muted-foreground bg-muted border-border" };
    const evidences: any[] = (application as any).evidences ?? [];

    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-5 p-2">
          <Link href="/candidaturas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Minhas Candidaturas
          </Link>

          {/* Cabeçalho */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-foreground">{application.badge_name}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Candidatura #{application.id}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Evidências submetidas */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Evidências Submetidas ({evidences.length})</h2>
            {evidences.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Nenhuma evidência registada.</p>
            ) : (
              <div className="space-y-2">
                {evidences.map((ev: any, i: number) => (
                  <div key={ev.id ?? i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground">Requisito #{ev.requirement_id}</div>
                      {ev.description && <div className="text-xs text-muted-foreground truncate">{ev.description}</div>}
                    </div>
                    {ev.file_url && (
                      <a href={ev.file_url} target="_blank" rel="noopener noreferrer"
                        className="ml-3 text-xs text-accent hover:underline shrink-0 flex items-center gap-1">
                        <UploadCloud className="h-3 w-3" />
                        {ev.file_name ?? "Ver"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link href="/candidaturas">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Candidatura Submetida!</h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            O teu pedido para o badge <strong>{application.badge_name}</strong> foi enviado para
            revisão pelo Talent Manager.
          </p>
          <div className="flex gap-3">
            <Link href="/candidaturas">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Minhas Candidaturas
              </Button>
            </Link>
            <Link href="/">
              <Button>Ir ao Dashboard</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const savedCount = requirements.filter((r) => evidences[`saved_${r.id}`]).length;
  const allSaved = requirements.length > 0 && savedCount === requirements.length;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Voltar */}
        <motion.div {...fadeIn} transition={{ delay: 0.0 }}>
          <Link
            href={`/badges/${application.badge_id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Badge
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground">Submeter Evidências</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Estás a candidatar-te ao badge{" "}
            <strong className="text-foreground">{application.badge_name}</strong>. Preenche todas
            as evidências antes de submeter.
          </p>
        </motion.div>

        {/* Progresso */}
        {requirements.length > 0 && (
          <motion.div {...fadeIn} transition={{ delay: 0.08 }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{savedCount}</span> de{" "}
              <span className="font-medium text-foreground">{requirements.length}</span> evidências
              guardadas
              <div className="flex-1 h-1.5 rounded-full bg-muted ml-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(savedCount / requirements.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Requisitos */}
        <form onSubmit={handleSubmitFinal} className="space-y-4">
          {requirements.map((req, index) => {
            const isSaved = !!evidences[`saved_${req.id}`];
            const currentUrl = evidences[req.id] ?? "";

            return (
              <motion.div key={req.id} {...fadeIn} transition={{ delay: 0.05 * (index + 1) }}>
                <Card
                  className={`border shadow-sm transition-colors ${
                    isSaved ? "border-green-200 bg-green-50/30" : "border-border"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {isSaved ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground shrink-0">
                          {index + 1}
                        </span>
                      )}
                      {req.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                    {req.evidence_instructions && (
                      <p className="text-xs text-accent/80 bg-accent/5 border border-accent/10 rounded-md p-2">
                        {req.evidence_instructions}
                      </p>
                    )}

                    {isSaved ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span className="truncate text-xs">{evidences[`saved_${req.id}`]}</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Link para a evidência (GitHub, certificado, etc.)"
                          value={currentUrl}
                          onChange={(e) =>
                            setEvidences((prev) => ({ ...prev, [req.id]: e.target.value }))
                          }
                          className="flex-1 bg-background border border-border text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!currentUrl.trim() || saving === req.id}
                          onClick={() => handleSaveEvidence(req.id)}
                          className="gap-1.5 shrink-0"
                        >
                          {saving === req.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <UploadCloud className="h-3.5 w-3.5" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Botão de submissão final */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!allSaved || submitting}
              className="gap-2 min-w-[180px]"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  A submeter...
                </>
              ) : (
                "Submeter para Avaliação"
              )}
            </Button>
          </motion.div>

          {requirements.length > 0 && !allSaved && (
            <p className="text-xs text-muted-foreground text-right">
              Preenche todas as evidências antes de submeter ({savedCount}/{requirements.length})
            </p>
          )}
        </form>
      </div>
    </AppLayout>
  );
}
