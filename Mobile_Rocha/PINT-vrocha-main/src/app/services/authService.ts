import { api } from '../lib/api';
import { STORAGE_KEY } from '../lib/config';
import { getInitials } from '../lib/badgeUtils';

export interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  area: string | null;
  service_line: string | null;
  must_change_password: boolean;
  last_login_at: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  service_line_name: string;
}

export interface StoredAuth {
  id: number;
  name: string;
  email: string;
  role: string;
  area: string | null;
  serviceLine: string | null;
  avatar: string;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  loginAt: string;
  accessToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>('/auth/login', { email, password });
}

export async function register(data: {
  full_name: string;
  email: string;
  password: string;
  area_id?: number;
}): Promise<void> {
  return api.post('/auth/register', data);
}

export async function getAreas(): Promise<Area[]> {
  return api.get<Area[]>('/auth/areas');
}

export async function changePassword(password: string): Promise<void> {
  return api.post('/auth/change-password', { password });
}

export async function forgotPassword(email: string): Promise<{ reset_token: string }> {
  return api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  return api.post('/auth/reset-password', { token, password });
}

export function saveAuth(response: LoginResponse): void {
  const { user } = response;
  const stored: StoredAuth = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    area: user.area,
    serviceLine: user.service_line,
    avatar: getInitials(user.full_name),
    mustChangePassword: user.must_change_password,
    lastLoginAt: user.last_login_at,
    loginAt: new Date().toISOString(),
    accessToken: response.accessToken,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredAuth(): StoredAuth | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredAuth) : null;
  } catch {
    return null;
  }
}
