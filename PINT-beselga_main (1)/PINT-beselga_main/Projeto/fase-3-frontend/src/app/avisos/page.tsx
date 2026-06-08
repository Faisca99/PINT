"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, RefreshCw, Calendar, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useUser, ROLE_LABELS } from "@/lib/user-context";
import { t, formatDate } from "@/lib/i18n";

interface Notice {
  id: number;
  title: string;
  content: string;
  target_roles: string[] | null;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function AvisosPage() {
  const { user } = useUser();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(`/admin/notices/active?role=${user.role}`)
      .then((r) => setNotices(r.data ?? []))
      .finally(() => setLoading(false));
  }, [user?.role]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-accent" />
            {t("page.avisos.title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("page.avisos.sub")}
          </p>
        </motion.div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            {t("page.avisos.loading")}
          </div>
        ) : notices.length === 0 ? (
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">{t("page.avisos.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <motion.div key={notice.id} {...fadeIn} transition={{ delay: 0.05 * i }}>
                <Card className="border border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary shrink-0" />
                        {notice.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.starts_at)}
                          {notice.ends_at && ` → ${formatDate(notice.ends_at)}`}
                        </span>
                      </div>
                    </div>
                    {notice.target_roles && notice.target_roles.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {t("page.avisos.for")} {notice.target_roles.map((r) => (ROLE_LABELS as any)[r] ?? r).join(", ")}
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{notice.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
