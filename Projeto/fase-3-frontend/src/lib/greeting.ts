import { CurrentUser } from "./user-context";

/**
 * Regras do PDF:
 * - "Bem-vindo!" → 1º login (first_login_at === last_login_at, ou mustChangePassword era true)
 * - "Seja bem-vindo novamente" → ausência > 15 dias
 * - "Bom dia / Boa tarde / Boa noite" → hora do dia
 */
export function getGreeting(user: CurrentUser | null, lastLoginAt?: string | null): string {
  if (!user) return "Olá";

  const hour = new Date().getHours();

  // 1º login — sinalizamos via flag na sessão
  const isFirstLogin = typeof window !== "undefined" &&
    sessionStorage.getItem(`first_login_${user.id}`) === "true";

  if (isFirstLogin) {
    sessionStorage.removeItem(`first_login_${user.id}`);
    return "Bem-vindo";
  }

  // Ausência > 15 dias
  if (lastLoginAt) {
    const daysSince = (Date.now() - new Date(lastLoginAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 15) return "Seja bem-vindo novamente";
  }

  // Hora do dia
  if (hour >= 6 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 20) return "Boa tarde";
  return "Boa noite";
}

/** Marcar como 1º login para mostrar "Bem-vindo!" uma vez */
export function markFirstLogin(userId: number) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`first_login_${userId}`, "true");
  }
}
