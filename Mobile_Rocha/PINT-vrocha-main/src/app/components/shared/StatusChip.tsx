interface StatusChipProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: "Open", bg: "bg-amber-100", text: "text-amber-700" },
  submitted: { label: "Submitted", bg: "bg-blue-100", text: "text-blue-700" },
  "em-validacao": { label: "Em Validação", bg: "bg-purple-100", text: "text-purple-700" },
  "fechado-aprovado": { label: "Aprovado", bg: "bg-emerald-100", text: "text-emerald-700" },
  "fechado-rejeitado": { label: "Rejeitado", bg: "bg-red-100", text: "text-red-700" },
  devolvido: { label: "Devolvido", bg: "bg-orange-100", text: "text-orange-700" },
  available: { label: "Disponível", bg: "bg-slate-100", text: "text-slate-600" },
  obtained: { label: "Obtido", bg: "bg-emerald-100", text: "text-emerald-700" },
  "in-progress": { label: "Em Progresso", bg: "bg-blue-100", text: "text-blue-700" },
  expired: { label: "Expirado", bg: "bg-gray-100", text: "text-gray-500" },
};

export function StatusChip({ status, size = "md" }: StatusChipProps) {
  const cfg = statusConfig[status] ?? { label: status, bg: "bg-gray-100", text: "text-gray-600" };
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

interface LevelChipProps {
  level: string;
  size?: "sm" | "md";
}

const levelConfig: Record<string, { bg: string; text: string; border: string }> = {
  A: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  B: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-300" },
  C: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  D: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
  E: { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-300" },
};

export function LevelChip({ level, size = "md" }: LevelChipProps) {
  const cfg = levelConfig[level] ?? { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-300" };
  const sizing = size === "sm" ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs";
  return (
    <span className={`inline-flex items-center justify-center rounded-full border font-bold ${sizing} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {level}
    </span>
  );
}

interface SLAChipProps {
  deadline: string;
  risk?: boolean;
}

export function SLAChip({ deadline, risk }: SLAChipProps) {
  const date = new Date(deadline);
  const today = new Date();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = diffDays <= 2 || risk;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${isUrgent ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"}`}>
      <span>⏰</span>
      {isUrgent ? `SLA ${diffDays}d` : `${diffDays}d`}
    </span>
  );
}
