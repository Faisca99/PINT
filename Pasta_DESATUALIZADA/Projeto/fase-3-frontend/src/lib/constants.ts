/**
 * Constantes globais do frontend.
 * Centraliza valores antes hardcoded em cada página.
 */

export const PAGE_SIZE = 10;

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  consultant:           "/",
  talent_manager:       "/dashboard-tm",
  service_line_leader:  "/dashboard-sl",
  admin:                "/admin/utilizadores",
};

export const LEVEL_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700 border-green-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  C: "bg-yellow-100 text-yellow-700 border-yellow-200",
  D: "bg-purple-100 text-purple-700 border-purple-200",
  E: "bg-red-100 text-red-700 border-red-200",
};

export const LEVEL_NAMES: Record<string, string> = {
  A: "Júnior",
  B: "Intermédio",
  C: "Sénior",
  D: "Especialista",
  E: "Líder de Conhecimento",
};

export const STATUS_LABELS: Record<string, string> = {
  open:          "Em Aberto",
  submitted:     "Submetida",
  in_validation: "Em Validação",
  closed:        "Fechada",
};

export const BADGE_TYPE_LABELS: Record<string, string> = {
  level:   "Nível",
  special: "Conquista",
  premium: "Premium",
};

export const EXPIRY_WARNING_DAYS = 30;
