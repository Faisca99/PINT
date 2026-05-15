/**
 * Constantes globais da aplicação.
 * Centraliza valores antes espalhados por vários ficheiros.
 */

export const PAGINATION = {
  DEFAULT_LIMIT: 100,
  MAX_LIMIT: 1000,
  LEADERBOARD_LIMIT: 50,
  DASHBOARD_PREVIEW_LIMIT: 6,
  OBJECTIVES_LIMIT: 10,
} as const;

export const BADGE_EXPIRY = {
  /** Dias antes da expiração para alerta */
  WARNING_DAYS: 30,
} as const;

export const SLA = {
  DEFAULT_LIMIT_HOURS: 48,
  DEFAULT_WARNING_PERCENT: 80,
} as const;

export const ROLES = {
  ADMIN: 'admin',
  CONSULTANT: 'consultant',
  TALENT_MANAGER: 'talent_manager',
  SERVICE_LINE_LEADER: 'service_line_leader',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const UPDATABLE_STRUCTURE_ENTITIES = [
  'learning_paths',
  'service_lines',
  'areas',
  'levels',
  'requirements',
] as const;

export type StructureEntity = typeof UPDATABLE_STRUCTURE_ENTITIES[number];
