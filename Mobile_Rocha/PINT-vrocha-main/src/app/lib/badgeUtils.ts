export const LEVEL_COLORS: Record<string, string> = {
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#8b5cf6',
  E: '#ef4444',
};

export const LEVEL_NAMES: Record<string, string> = {
  A: 'Júnior',
  B: 'Intermédio',
  C: 'Sénior',
  D: 'Especialista',
  E: 'Líder de Conhecimento',
};

const AREA_ICONS: Record<string, string[]> = {
  'LowCode': ['⚡', '🔷', '🏗️', '🎯', '🏆'],
  'DevSecOps & IT Automation': ['🔐', '🛡️', '⚙️', '🔑', '🏰'],
  'Talent Management': ['👥', '🌱', '📊', '🎓', '👑'],
};

export function getBadgeIcon(areaName: string, levelCode: string): string {
  const levels = ['A', 'B', 'C', 'D', 'E'];
  const idx = levels.indexOf(levelCode);
  const icons = AREA_ICONS[areaName];
  if (icons && idx >= 0) return icons[idx];
  return '🏅';
}

export function getBadgeColor(levelCode: string): string {
  return LEVEL_COLORS[levelCode] ?? '#1e4d8c';
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-PT');
  } catch {
    return iso;
  }
}

export function isExpiringSoon(expiresAt: string | null | undefined, days = 30): boolean {
  if (!expiresAt) return false;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < days * 24 * 60 * 60 * 1000;
}

export function isExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
