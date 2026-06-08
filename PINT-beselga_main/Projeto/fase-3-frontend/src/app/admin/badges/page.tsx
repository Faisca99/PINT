"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award, PlusCircle, RefreshCw, AlertCircle, X,
  Pencil, ToggleLeft, ToggleRight, Search, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PAGE_SIZE } from "@/lib/constants";
import { t } from "@/lib/i18n";

interface BadgeRow {
  id: number; code: string; name: string; description: string;
  badge_type: string; points: number; has_expiration: boolean;
  valid_days: number | null; is_active: boolean;
  level_code: string | null; level_name: string | null;
  area_name: string | null; service_line_name: string | null;
}
interface Level { id: number; code: string; name: string; area_name: string; }

const EMPTY_FORM ={ level_id: "", code: "", name: "", description: "", badge_type: "level", points: "0", has_expiration: false, valid_days: "" };

export default function AdminBadgesPage() {
  const [badges, setBadges]       = useState<BadgeRow[]>([]);
  const [levels, setLevels]       = useState<Level[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBadge, setEditBadge] = useState<BadgeRow | null>(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch]         = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [filterSL, setFilterSL]     = useState("all");
  const [page, setPage]             = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, lRes] = await Promise.all([api.get("/admin/badges"), api.get("/admin/levels")]);
      setBadges(bRes.data ?? []);
      setLevels(lRes.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Service lines únicas
  const servicelines = useMemo(() =>
    Array.from(new Set(badges.map((b) => b.service_line_name).filter(Boolean))), [badges]);

  // Badges filtrados
  const filtered = useMemo(() => {
    return badges.filter((b) => {
      const matchSearch = !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        (b.area_name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType  = filterType === "all" || b.badge_type === filterType;
      const matchState = filterState === "all" || (filterState === "active" ? b.is_active : !b.is_active);
      const matchSL    = filterSL === "all" || b.service_line_name === filterSL;
      return matchSearch && matchType && matchState && matchSL;
    });
  }, [badges, search, filterType, filterState, filterSL]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset página ao mudar filtros
  useEffect(() => { setPage(1); }, [search, filterType, filterState, filterSL]);

  const openCreate = () => { setEditBadge(null); setForm(EMPTY_FORM); setFormError(null); setShowModal(true); };
  const openEdit   = (b: BadgeRow) => {
    setEditBadge(b);
    setForm({ level_id: "", code: b.code, name: b.name, description: b.description ?? "",
      badge_type: b.badge_type, points: String(b.points), has_expiration: b.has_expiration,
      valid_days: b.valid_days ? String(b.valid_days) : "" });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) { setFormError(t("admin.badges.errNameCode")); return; }
    setSaving(true); setFormError(null);
    try {
      if (editBadge) {
        await api.patch(`/admin/badges/${editBadge.id}`, {
          name: form.name, description: form.description || undefined,
          points: Number(form.points), has_expiration: form.has_expiration,
          valid_days: form.has_expiration && form.valid_days ? Number(form.valid_days) : null,
        });
      } else {
        if (!form.level_id) { setFormError(t("admin.badges.errLevel")); setSaving(false); return; }
        await api.post("/admin/badges", {
          level_id: Number(form.level_id), code: form.code, name: form.name,
          description: form.description || undefined, badge_type: form.badge_type,
          points: Number(form.points), has_expiration: form.has_expiration,
          valid_days: form.has_expiration && form.valid_days ? Number(form.valid_days) : undefined,
        });
      }
      setShowModal(false); fetchData();
    } catch { setFormError(t("admin.badges.errSave")); }
    finally { setSaving(false); }
  };

  const handleToggle = async (b: BadgeRow) => {
    try {
      await api.patch(`/admin/badges/${b.id}`, { is_active: !b.is_active });
      setBadges((prev) => prev.map((x) => x.id === b.id ? { ...x, is_active: !b.is_active } : x));
    } catch { alert(t("admin.badges.errToggle")); }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="h-6 w-6 text-accent" /> {t("admin.badges.title")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {badges.length} {t("admin.badges.totalCount")} · {badges.filter((b) => b.is_active).length} {t("admin.badges.activeCount")}
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <PlusCircle className="h-4 w-4" /> {t("admin.badges.new")}
          </Button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">{editBadge ? t("admin.badges.edit") : t("admin.badges.new")}</h2>
                <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                {!editBadge && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("admin.badges.level")}</label>
                    <select value={form.level_id} onChange={(e) => setForm((p) => ({ ...p, level_id: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">{t("admin.badges.selectPlaceholder")}</option>
                      {levels.map((l) => <option key={l.id} value={l.id}>{l.code} — {l.area_name} ({l.name})</option>)}
                    </select>
                  </div>
                )}
                {[
                  { label: t("admin.badges.code"), key: "code", placeholder: "BDG-LC-A", disabled: !!editBadge },
                  { label: t("admin.badges.name"), key: "name", placeholder: "Bronze — LowCode" },
                  { label: t("admin.badges.description"), key: "description", placeholder: t("admin.badges.descPlaceholder") },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} disabled={f.disabled}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                {!editBadge && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("admin.badges.type")}</label>
                    <select value={form.badge_type} onChange={(e) => setForm((p) => ({ ...p, badge_type: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="level">{t("admin.badges.type.level")}</option>
                      <option value="special">{t("admin.badges.type.specialFull")}</option>
                      <option value="premium">{t("admin.badges.type.premium")}</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t("admin.badges.points")}</label>
                  <input type="number" min="0" value={form.points}
                    onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="exp" checked={form.has_expiration}
                    onChange={(e) => setForm((p) => ({ ...p, has_expiration: e.target.checked }))} className="h-4 w-4 rounded" />
                  <label htmlFor="exp" className="text-sm text-foreground">{t("admin.badges.hasExpiration")}</label>
                </div>
                {form.has_expiration && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">{t("admin.badges.validDays")}</label>
                    <input type="number" min="1" value={form.valid_days}
                      onChange={(e) => setForm((p) => ({ ...p, valid_days: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                )}
                {formError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? t("admin.common.saving") : t("admin.common.save")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>{t("admin.common.cancel")}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filtros */}
        <Card className="border border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />

              {/* Pesquisa */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input type="text" placeholder={t("admin.badges.searchPlaceholder")} value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Tipo */}
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">{t("admin.badges.allTypes")}</option>
                <option value="level">{t("admin.badges.type.level")}</option>
                <option value="special">{t("admin.badges.type.special")}</option>
                <option value="premium">{t("admin.badges.type.premium")}</option>
              </select>

              {/* Estado */}
              <select value={filterState} onChange={(e) => setFilterState(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">{t("admin.badges.allStates")}</option>
                <option value="active">{t("admin.badges.activePlural")}</option>
                <option value="inactive">{t("admin.badges.inactivePlural")}</option>
              </select>

              {/* Service Line */}
              {servicelines.length > 0 && (
                <select value={filterSL} onChange={(e) => setFilterSL(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">{t("admin.badges.allSL")}</option>
                  {servicelines.map((sl) => <option key={sl} value={sl!}>{sl}</option>)}
                </select>
              )}

              {/* Limpar filtros */}
              {(search || filterType !== "all" || filterState !== "all" || filterSL !== "all") && (
                <Button size="sm" variant="ghost" className="text-xs"
                  onClick={() => { setSearch(""); setFilterType("all"); setFilterState("all"); setFilterSL("all"); }}>
                  {t("admin.badges.clear")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {loading ? t("admin.common.loading") : (
                  <>
                    {filtered.length} badge{filtered.length !== 1 ? "s" : ""}
                    {filtered.length !== badges.length && (
                      <span className="text-muted-foreground font-normal"> ({t("admin.badges.ofTotal")} {badges.length})</span>
                    )}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></div>
              ) : paginated.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Award className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("admin.badges.empty")}</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {["Badge", t("admin.badges.col.levelArea"), t("admin.badges.col.type"), t("admin.badges.col.points"), t("admin.badges.col.expiration"), t("admin.badges.col.status"), t("admin.badges.col.actions")].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginated.map((b) => (
                          <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium text-foreground">{b.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{b.code}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              <div className="font-medium text-foreground/80">{b.level_code} — {b.level_name}</div>
                              <div>{b.area_name}</div>
                              {b.service_line_name && <div className="text-muted-foreground/60">{b.service_line_name}</div>}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {t(`admin.badges.type.${b.badge_type}`)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-yellow-600">{b.points} pts</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {b.has_expiration ? `${b.valid_days} ${t("admin.badges.days")}` : t("admin.badges.permanent")}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {b.is_active ? t("admin.badges.active") : t("admin.badges.inactive")}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost" onClick={() => openEdit(b)} className="h-8 w-8 p-0">
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleToggle(b)} className={`h-8 w-8 p-0 ${b.is_active ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                                  {b.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {t("admin.common.page")} {page} {t("admin.common.of")} {totalPages} · {filtered.length} {t("admin.common.results")}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                          disabled={page === 1} onClick={() => setPage(1)}>
                          «
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                          disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {/* Números de página */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                          .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                            if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                            acc.push(p);
                            return acc;
                          }, [])
                          .map((p, i) =>
                            p === "..." ? (
                              <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted-foreground">…</span>
                            ) : (
                              <Button key={p} size="sm" variant={page === p ? "default" : "outline"} className="h-8 w-8 p-0 text-xs"
                                onClick={() => setPage(p as number)}>
                                {p}
                              </Button>
                            )
                          )}
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                          disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0"
                          disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                          »
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
