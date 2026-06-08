"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, RefreshCw, ChevronDown, ChevronRight, PlusCircle, X, AlertCircle, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { t } from "@/lib/i18n";

interface Structure {
  learning_paths: any[];
  service_lines: any[];
  areas: any[];
  levels: any[];
  requirements: any[];
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const EMPTY_REQ = { level_id: "", code: "", title: "", description: "", evidence_instructions: "", display_order: "1" };
type CreateType = "lp" | "sl" | "area" | "level" | "req" | null;

export default function AdminEstruturaPage() {
  const [structure, setStructure] = useState<Structure | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLp, setExpandedLp] = useState<Record<number, boolean>>({});
  const [expandedSl, setExpandedSl] = useState<Record<number, boolean>>({});
  const [expandedArea, setExpandedArea] = useState<Record<number, boolean>>({});
  const [expandedLevel, setExpandedLevel] = useState<Record<number, boolean>>({});
  const [showReqModal, setShowReqModal] = useState(false);
  const [createType, setCreateType] = useState<CreateType>(null);
  const [genericForm, setGenericForm] = useState<Record<string, string>>({});
  const [reqForm, setReqForm] = useState(EMPTY_REQ);
  const [saving, setSaving] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);

  const fetchStructure = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/structure");
      setStructure(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStructure(); }, []);

  const handleCreateGeneric = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setReqError(null);
    try {
      const f = genericForm;
      if (createType === "lp") {
        await api.post("/admin/learning-paths", { code: f.code, name: f.name, description: f.description });
      } else if (createType === "sl") {
        await api.post("/admin/service-lines", { learning_path_id: Number(f.learning_path_id), code: f.code, name: f.name });
      } else if (createType === "area") {
        await api.post("/admin/areas", { service_line_id: Number(f.service_line_id), code: f.code, name: f.name });
      } else if (createType === "level") {
        await api.post("/admin/levels", { area_id: Number(f.area_id), code: f.code, name: f.name, rank_order: Number(f.rank_order) });
      }
      setCreateType(null);
      setGenericForm({});
      fetchStructure();
    } catch { setReqError(t("admin.struct.errCreate")); }
    finally { setSaving(false); }
  };

  const handleCreateReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.level_id || !reqForm.code || !reqForm.title) {
      setReqError(t("admin.struct.errReqRequired")); return;
    }
    setSaving(true);
    setReqError(null);
    try {
      await api.post("/admin/requirements", {
        level_id: Number(reqForm.level_id),
        code: reqForm.code,
        title: reqForm.title,
        description: reqForm.description || undefined,
        evidence_instructions: reqForm.evidence_instructions || undefined,
        display_order: Number(reqForm.display_order),
      });
      setShowReqModal(false);
      setReqForm(EMPTY_REQ);
      fetchStructure();
    } catch { setReqError(t("admin.struct.errReqCreate")); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          {t("admin.struct.loading")}
        </div>
      </AppLayout>
    );
  }

  const toggle = (setter: any, id: number) =>
    setter((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const reqsForLevel = (levelId: number) =>
    structure?.requirements.filter((r) => r.level_id === levelId) ?? [];

  const handleToggle = async (entity: string, id: number, currentActive: boolean) => {
    try {
      await api.patch(`/admin/structure/${entity}/${id}/status`, { active: !currentActive });
      fetchStructure();
    } catch { alert(t("admin.struct.errToggle")); }
  };

  const levelsForArea = (areaId: number) =>
    structure?.levels.filter((l) => l.area_id === areaId) ?? [];

  const areasForSl = (slId: number) =>
    structure?.areas.filter((a) => a.service_line_id === slId) ?? [];

  const slsForLp = (lpId: number) =>
    structure?.service_lines.filter((sl) => sl.learning_path_id === lpId) ?? [];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Layers className="h-6 w-6 text-accent" />
                {t("admin.struct.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("admin.struct.sub")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                { type: "lp" as CreateType, label: "Learning Path" },
                { type: "sl" as CreateType, label: "Service Line" },
                { type: "area" as CreateType, label: t("admin.struct.area") },
                { type: "level" as CreateType, label: t("admin.struct.level") },
                { type: "req" as CreateType, label: t("admin.struct.requirement") },
              ]).map((item) => (
                <Button key={item.type} size="sm" variant="outline" className="gap-1.5"
                  onClick={() => {
                    if (item.type === "req") { setReqForm(EMPTY_REQ); setReqError(null); setShowReqModal(true); }
                    else { setCreateType(item.type); setGenericForm({}); setReqError(null); }
                  }}>
                  <Plus className="h-3.5 w-3.5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Modal genérico: LP / SL / Área / Nível */}
        {createType && createType !== "req" && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">
                  {t("admin.struct.newPrefix")} {{ lp: "Learning Path", sl: "Service Line", area: t("admin.struct.area"), level: t("admin.struct.level") }[createType]}
                </h2>
                <button onClick={() => setCreateType(null)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreateGeneric} className="space-y-3">
                {/* Selects de parent */}
                {createType === "sl" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Learning Path</label>
                    <select value={genericForm.learning_path_id ?? ""} onChange={(e) => setGenericForm((p) => ({ ...p, learning_path_id: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                      <option value="">{t("admin.struct.select")}</option>
                      {structure?.learning_paths.map((lp: any) => <option key={lp.id} value={lp.id}>{lp.name}</option>)}
                    </select>
                  </div>
                )}
                {createType === "area" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Service Line</label>
                    <select value={genericForm.service_line_id ?? ""} onChange={(e) => setGenericForm((p) => ({ ...p, service_line_id: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                      <option value="">{t("admin.struct.select")}</option>
                      {structure?.service_lines.map((sl: any) => <option key={sl.id} value={sl.id}>{sl.name}</option>)}
                    </select>
                  </div>
                )}
                {createType === "level" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">{t("admin.struct.area")}</label>
                      <select value={genericForm.area_id ?? ""} onChange={(e) => setGenericForm((p) => ({ ...p, area_id: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required>
                        <option value="">{t("admin.struct.select")}</option>
                        {structure?.areas.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">{t("admin.struct.rankOrder")}</label>
                      <input type="number" min="1" max="26" value={genericForm.rank_order ?? ""}
                        onChange={(e) => setGenericForm((p) => ({ ...p, rank_order: e.target.value }))}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                    </div>
                  </>
                )}
                {/* Campos comuns */}
                {[
                  { key: "code", label: t("admin.struct.code"), placeholder: createType === "lp" ? "JT" : createType === "sl" ? "HC" : createType === "area" ? "LC" : "A" },
                  { key: "name", label: t("admin.struct.name"), placeholder: t("admin.struct.namePlaceholder") },
                  { key: "description", label: t("admin.struct.descriptionOpt"), placeholder: "..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input type="text" value={genericForm[f.key] ?? ""}
                      onChange={(e) => setGenericForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} required={f.key !== "description"}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                {reqError && <p className="text-xs text-destructive">{reqError}</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? t("admin.struct.creating") : t("admin.struct.createBtn")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCreateType(null)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal novo requisito */}
        {showReqModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{t("admin.struct.newReq")}</h2>
                <button onClick={() => setShowReqModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleCreateReq} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.struct.level")}</label>
                  <select value={reqForm.level_id} onChange={(e) => setReqForm((p) => ({ ...p, level_id: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">{t("admin.struct.select")}</option>
                    {structure?.levels.map((l) => (
                      <option key={l.id} value={l.id}>{l.area_name} — {l.code} ({l.name})</option>
                    ))}
                  </select>
                </div>
                {[
                  { label: t("admin.struct.code"), key: "code", placeholder: "A1" },
                  { label: t("admin.struct.reqTitle"), key: "title", placeholder: "Certificado OutSystems..." },
                  { label: t("admin.struct.description"), key: "description", placeholder: t("admin.struct.reqDescPlaceholder") },
                  { label: t("admin.struct.evidenceInstr"), key: "evidence_instructions", placeholder: t("admin.struct.evidencePlaceholder") },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input type="text" value={(reqForm as any)[f.key]}
                      onChange={(e) => setReqForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.struct.displayOrder")}</label>
                  <input type="number" min="1" value={reqForm.display_order}
                    onChange={(e) => setReqForm((p) => ({ ...p, display_order: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                {reqError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />{reqError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? t("admin.struct.creating") : t("admin.struct.createReq")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowReqModal(false)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Árvore da estrutura */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="space-y-3">
            {structure?.learning_paths.map((lp) => (
              <Card key={lp.id} className="border border-border shadow-sm">
                <button
                  onClick={() => toggle(setExpandedLp, lp.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/20 transition-colors rounded-xl"
                >
                  {expandedLp[lp.id] ? <ChevronDown className="h-4 w-4 text-accent shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  <span className="font-semibold text-foreground">📚 {lp.name}</span>
                  <span className="text-xs text-muted-foreground">{slsForLp(lp.id).length} {t("admin.struct.serviceLines")}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggle('learning_paths', lp.id, lp.is_active); }}
                    className={`ml-auto shrink-0 p-1 rounded transition-colors ${lp.is_active ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                    title={lp.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}
                  >
                    {lp.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </button>
                </button>

                {expandedLp[lp.id] && (
                  <CardContent className="pt-0 pb-3 pl-12 space-y-2">
                    {slsForLp(lp.id).map((sl: any) => (
                      <div key={sl.id} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggle(setExpandedSl, sl.id)}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                        >
                          {expandedSl[sl.id] ? <ChevronDown className="h-3.5 w-3.5 text-accent" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span className="text-sm font-medium text-foreground">🏢 {sl.name}</span>
                          <span className="text-xs text-muted-foreground">{areasForSl(sl.id).length} {t("admin.struct.areas")}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleToggle('service_lines', sl.id, sl.is_active); }}
                            className={`ml-auto shrink-0 p-1 rounded transition-colors ${sl.is_active ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                            title={sl.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}>
                            {sl.is_active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                          </button>
                        </button>

                        {expandedSl[sl.id] && (
                          <div className="pl-8 pb-3 space-y-2">
                            {areasForSl(sl.id).map((area: any) => (
                              <div key={area.id} className="border border-border/60 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggle(setExpandedArea, area.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-muted/20 transition-colors"
                                >
                                  {expandedArea[area.id] ? <ChevronDown className="h-3 w-3 text-accent" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                                  <span className="text-sm text-foreground">📁 {area.name}</span>
                                  <span className="text-xs text-muted-foreground">{levelsForArea(area.id).length} {t("admin.struct.levels")}</span>
                                  <button onClick={(e) => { e.stopPropagation(); handleToggle('areas', area.id, area.is_active); }}
                                    className={`ml-auto shrink-0 p-1 rounded transition-colors ${area.is_active ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                                    title={area.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}>
                                    {area.is_active ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                                  </button>
                                </button>

                                {expandedArea[area.id] && (
                                  <div className="pl-8 pb-2 space-y-1.5">
                                    {levelsForArea(area.id).map((level: any) => (
                                      <div key={level.id} className="border border-border/40 rounded-lg overflow-hidden">
                                        <button
                                          onClick={() => toggle(setExpandedLevel, level.id)}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
                                        >
                                          {expandedLevel[level.id] ? <ChevronDown className="h-3 w-3 text-accent" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                                          <span className="text-xs font-medium text-foreground">
                                            🏅 {t("admin.struct.level")} {level.code} — {level.name}
                                          </span>
                                          <span className="text-xs text-muted-foreground">{reqsForLevel(level.id).length} {t("admin.struct.requirements")}</span>
                                          <button onClick={(e) => { e.stopPropagation(); handleToggle('levels', level.id, level.is_active); }}
                                            className={`ml-auto shrink-0 p-1 rounded transition-colors ${level.is_active ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                                            title={level.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}>
                                            {level.is_active ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                                          </button>
                                        </button>

                                        {expandedLevel[level.id] && (
                                          <div className="pl-6 pb-2 space-y-1">
                                            {reqsForLevel(level.id).map((req: any) => (
                                              <div key={req.id} className="flex items-start gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                                                <span className="text-accent font-bold shrink-0">{req.code}</span>
                                                <div className="flex-1 min-w-0">
                                                  <div className="font-medium text-foreground">{req.title}</div>
                                                  {req.evidence_instructions && (
                                                    <div className="text-muted-foreground/70 mt-0.5 italic">{req.evidence_instructions}</div>
                                                  )}
                                                </div>
                                                <button onClick={() => handleToggle('requirements', req.id, req.is_active)}
                                                  className={`shrink-0 p-0.5 rounded transition-colors ${req.is_active ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                                                  title={req.is_active ? t("admin.struct.deactivate") : t("admin.struct.activate")}>
                                                  {req.is_active ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                                                </button>
                                              </div>
                                            ))}
                                            {reqsForLevel(level.id).length === 0 && (
                                              <p className="px-3 py-1 text-xs text-muted-foreground italic">{t("admin.struct.noReqs")}</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
