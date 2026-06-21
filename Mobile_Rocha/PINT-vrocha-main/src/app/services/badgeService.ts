import { api } from '../lib/api';

export interface ApiBadge {
  id: number;
  code: string;
  name: string;
  description: string;
  badge_type: string;
  points: number;
  level_code: string;
  level_name: string;
  area_name: string;
  service_line_name: string;
  learning_path_name: string;
}

export interface ApiBadgeRequirement {
  id: number;
  code: string;
  title: string;
  description: string;
  evidence_instructions: string;
  display_order: number;
}

export interface ApiBadgeDetail {
  badge: ApiBadge;
  requirements: ApiBadgeRequirement[];
}

export async function getBadges(): Promise<ApiBadge[]> {
  return api.get<ApiBadge[]>('/badges');
}

export async function getBadgeById(id: number): Promise<ApiBadgeDetail> {
  return api.get<ApiBadgeDetail>(`/badges/${id}`);
}
