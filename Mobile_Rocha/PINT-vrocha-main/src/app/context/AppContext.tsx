import React, { createContext, useContext, useState, useCallback } from "react";
import { getStoredAuth, saveAuth, clearAuth, type LoginResponse } from "../services/authService";
import { login as apiLogin } from "../services/authService";
import { getInitials } from "../lib/badgeUtils";

export type Profile = "consultor";

export type Screen =
  | "splash" | "onboarding" | "login" | "register" | "confirm-email"
  | "first-login" | "recover-password"
  | "c-dashboard" | "c-badges" | "c-badge-detail" | "c-new-application"
  | "c-applications" | "c-application-detail" | "c-my-badges" | "c-certificate"
  | "c-public-gallery" | "c-badge-verify" | "c-timeline" | "c-achievements"
  | "c-leaderboard" | "c-notifications" | "c-email-signature" | "c-linkedin-share"
  | "c-settings" | "c-more" | "c-recommendations" | "c-edit-profile" | "c-change-password"
  | "c-reminders"
  | "public-badge" | "public-gallery" | "notices";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  profile: Profile;
  area: string;
  serviceLine: string;
  avatar: string;
  level: string;
  points: number;
  badgesCount: number;
  rankPosition: number;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  loginAt: string;
}

function storedToAppUser(stored: ReturnType<typeof getStoredAuth>): AppUser | null {
  if (!stored) return null;
  return {
    id: String(stored.id),
    name: stored.name,
    email: stored.email,
    profile: "consultor",
    area: stored.area ?? "",
    serviceLine: stored.serviceLine ?? "",
    avatar: stored.avatar || getInitials(stored.name),
    level: "",
    points: 0,
    badgesCount: 0,
    rankPosition: 0,
    mustChangePassword: stored.mustChangePassword,
    lastLoginAt: stored.lastLoginAt,
    loginAt: stored.loginAt,
  };
}

interface AppState {
  screen: Screen;
  screenParams: Record<string, unknown>;
  history: Screen[];
  user: AppUser | null;
  isAuthenticated: boolean;
  notifCount: number;
  lang: "pt" | "en" | "es";
}

interface LoginResult {
  mustChangePassword: boolean;
}

interface AppContextType extends AppState {
  navigate: (screen: Screen, params?: Record<string, unknown>) => void;
  goBack: () => void;
  setLang: (lang: "pt" | "en" | "es") => void;
  markNotifRead: () => void;
  setNotifCount: (n: number) => void;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  updateUserStats: (points: number, badgesCount: number, rankPosition: number, level?: string) => void;
}

const initialStored = getStoredAuth();
const initialUser = storedToAppUser(initialStored);

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    screen: "splash",
    screenParams: {},
    history: [],
    user: initialUser,
    isAuthenticated: !!initialUser,
    notifCount: 0,
    lang: "pt",
  });

  const navigate = useCallback((screen: Screen, params: Record<string, unknown> = {}) => {
    setState((prev) => ({
      ...prev,
      screen,
      screenParams: params,
      history: [...prev.history, prev.screen],
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      const newHistory = [...prev.history];
      const prevScreen = newHistory.pop() ?? "c-dashboard";
      return { ...prev, screen: prevScreen, screenParams: {}, history: newHistory };
    });
  }, []);

  const setLang = useCallback((lang: "pt" | "en" | "es") => {
    setState((prev) => ({ ...prev, lang }));
  }, []);

  const markNotifRead = useCallback(() => {
    setState((prev) => ({ ...prev, notifCount: 0 }));
  }, []);

  const setNotifCount = useCallback((n: number) => {
    setState((prev) => ({ ...prev, notifCount: n }));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const response: LoginResponse = await apiLogin(email, password);
    saveAuth(response);
    const user = storedToAppUser(getStoredAuth())!;
    setState((prev) => ({ ...prev, user, isAuthenticated: true }));
    return { mustChangePassword: response.user.must_change_password };
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({
      screen: "login",
      screenParams: {},
      history: [],
      user: null,
      isAuthenticated: false,
      notifCount: 0,
      lang: "pt",
    });
  }, []);

  const updateUserStats = useCallback((points: number, badgesCount: number, rankPosition: number, level = "") => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, points, badgesCount, rankPosition, level: level || prev.user.level } : prev.user,
    }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, navigate, goBack, setLang, markNotifRead, setNotifCount, login, logout, updateUserStats }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useRequireUser(): AppUser {
  const { user } = useApp();
  if (!user) throw new Error("User not authenticated");
  return user;
}
