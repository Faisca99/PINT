"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, RefreshCw, AlertCircle, Search, Award, Zap, Download, Clock } from "lucide-react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import * as XLSX from "xlsx";
import { exportTablePdf } from "@/lib/pdf";
import { t, formatDate } from "@/lib/i18n";

interface UserRow {
  id: number;
  full_name: string;
  email: string;
  role: string;
  area_name: string | null;
  service_line_name: string | null;
  badge_count: number;
  total_points: number;
  last_login_at: string | null;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function UtilizadoresPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((r) => setUsers(r.data ?? []))
      .catch(() => setError(t("page.utilizadores.error") || "Não foi possível carregar os utilizadores."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.area_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const exportExcel = () => {
    const data = filtered.map((u) => ({
      "Nome": u.full_name,
      [t("excel.email")]: u.email,
      [t("excel.profile")]: u.role,
      [t("excel.area")]: u.area_name ?? "",
      [t("excel.serviceLine")]: u.service_line_name ?? "",
      [t("excel.badgesCount")]: u.badge_count,
      [t("excel.points")]: u.total_points,
      [t("excel.lastAccess")]: u.last_login_at ? formatDate(u.last_login_at) : t("page.utilizadores.never"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consultores");
    XLSX.writeFile(wb, `consultores_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportPdf = () => {
    exportTablePdf({
      title: t("page.utilizadores.title"),
      summary: [{ label: t("page.utilizadores.title"), value: filtered.length }],
      head: ["Nome", t("excel.email"), t("excel.profile"), t("excel.area"), t("excel.serviceLine"), t("excel.badgesCount"), t("excel.points"), t("excel.lastAccess")],
      body: filtered.map((u) => [
        u.full_name, u.email, u.role, u.area_name ?? "", u.service_line_name ?? "",
        u.badge_count, u.total_points,
        u.last_login_at ? formatDate(u.last_login_at) : t("page.utilizadores.never"),
      ]),
      fileName: "consultores",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                {t("page.utilizadores.title")}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("page.utilizadores.sub")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={exportExcel} disabled={loading || users.length === 0} className="gap-2">
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button onClick={exportPdf} disabled={loading || users.length === 0} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Pesquisa */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("page.utilizadores.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </motion.div>

        {/* Tabela */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
          <Card className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {loading ? t("label.loading") : `${filtered.length} ${t("page.utilizadores.title").toLowerCase()}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  {t("label.loading")}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("page.utilizadores.empty")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("table.consultant")}</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">{t("table.area")}</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("table.badges")}</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("table.points")}</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">{t("page.utilizadores.lastAccess")}</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((user, i) => (
                        <motion.tr
                          key={user.id}
                          {...fadeIn}
                          transition={{ delay: 0.03 * i }}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-primary">
                                  {user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{user.full_name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="text-sm text-foreground">{user.area_name ?? "—"}</div>
                            {user.service_line_name && (
                              <div className="text-xs text-muted-foreground">{user.service_line_name}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                              <Award className="h-3.5 w-3.5 text-primary" />
                              {user.badge_count}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 font-medium text-yellow-600">
                              <Zap className="h-3.5 w-3.5" />
                              {user.total_points}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                            {user.last_login_at
                              ? formatDate(user.last_login_at)
                              : t("page.utilizadores.never")}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/timeline/${user.id}`}>
                              <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-muted-foreground hover:text-accent">
                                <Clock className="h-3.5 w-3.5" />
                                Timeline
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
