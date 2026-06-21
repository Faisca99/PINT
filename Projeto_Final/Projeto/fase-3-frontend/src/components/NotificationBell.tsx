"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-context";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  application_approved: "text-green-600",
  application_rejected: "text-red-600",
  application_send_back: "text-amber-600",
  application_submitted: "text-blue-600",
  badge_awarded: "text-primary",
  badge_expiring: "text-orange-600",
};

export function NotificationBell() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/me/notifications");
      setNotifications(res.data ?? []);
    } catch {}
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      try {
        await api.post("/me/notifications/read");
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      } catch {}
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notificações</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <Bell className="h-6 w-6 mx-auto mb-2 opacity-30" />
                Sem notificações
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-muted/30 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
                >
                  <div className={`text-xs font-semibold mb-0.5 ${TYPE_COLORS[n.type] ?? "text-foreground"}`}>
                    {n.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{n.message}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(n.sent_at).toLocaleString("pt-PT")}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-border">
              <button
                onClick={async () => {
                  await api.post("/me/notifications/read");
                  setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
