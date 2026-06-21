import { api } from '../lib/api';

export interface DashboardData {
  points: number;
  objectives: number;
  badge_count: number;
}

export interface MyBadge {
  id: number;
  badge_id: number;
  badge_name: string;
  description: string;
  badge_type: string;
  points: number;
  level_code: string;
  level_name: string;
  area_name: string;
  awarded_at: string;
  expires_at: string | null;
  is_published: boolean;
  public_token: string | null;
  points_awarded: number;
}

export interface Recommendation {
  id: number;
  badge_name: string;
  description: string;
  points: number;
  level_code: string;
  level_name: string;
  area_name: string;
}

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  points_bonus: number;
  awarded_at: string | null;
  celebrated: boolean;
}

export interface LeaderboardEntry {
  id: number;
  full_name: string;
  total_points: number;
  badge_count: number;
}

export interface TimelineEvent {
  event_type: string;
  id: number;
  status: string | null;
  final_result: string | null;
  occurred_at: string;
  badge_name: string;
  level_code: string;
}

export interface ApiNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

export interface Reminder {
  id: number;
  title: string;
  message: string;
  scheduled_for: string;
  is_dismissed: boolean;
}

export interface Notice {
  id: number;
  title: string;
  content?: string;
  message?: string;
  category?: string;
  created_at?: string;
  published_at?: string;
  active?: boolean;
}

export interface PublicBadgeVerification {
  consultant_name: string;
  badge_name: string;
  level_code: string;
  level_name: string;
  area_name: string;
  awarded_at: string;
  expires_at: string | null;
  is_valid: boolean;
}

export async function getDashboard(): Promise<DashboardData> {
  return api.get<DashboardData>('/me/dashboard');
}

export async function getMyBadges(): Promise<MyBadge[]> {
  return api.get<MyBadge[]>('/me/badges');
}

export async function getRecommendations(): Promise<Recommendation[]> {
  return api.get<Recommendation[]>('/me/recommendations');
}

export async function getAchievements(): Promise<Achievement[]> {
  return api.get<Achievement[]>('/me/achievements');
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return api.get<LeaderboardEntry[]>('/me/leaderboard');
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  return api.get<TimelineEvent[]>('/me/timeline');
}

export async function getNotifications(): Promise<ApiNotification[]> {
  return api.get<ApiNotification[]>('/me/notifications');
}

export async function markAllNotificationsRead(): Promise<void> {
  return api.post('/me/notifications/read');
}

export async function getReminders(): Promise<Reminder[]> {
  return api.get<Reminder[]>('/me/reminders');
}

export async function createReminder(data: { title: string; message: string; scheduled_for: string }): Promise<void> {
  return api.post('/me/reminders', data);
}

export async function dismissReminder(id: number): Promise<void> {
  return api.post(`/me/reminders/${id}/dismiss`);
}

export async function publishBadge(id: number): Promise<void> {
  return api.post(`/me/badges/${id}/publish`);
}

export async function verifyBadgeToken(token: string): Promise<PublicBadgeVerification> {
  return api.get<PublicBadgeVerification>(`/me/verify/${token}`);
}

export async function getPublicGallery(userId: number): Promise<MyBadge[]> {
  return api.get<MyBadge[]>(`/me/gallery/${userId}`);
}

export async function getNotices(): Promise<Notice[]> {
  return api.get<Notice[]>('/admin/notices/active?role=consultant');
}
