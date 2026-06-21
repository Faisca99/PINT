import { api } from '../lib/api';

export interface ApiApplicationSummary {
  id: number;
  badge_id: number;
  badge_name: string;
  level_code: string;
  level_name: string;
  area_name: string;
  status: string;
  final_result: string | null;
  created_at: string;
  submitted_at: string | null;
  closed_at: string | null;
}

export interface ApiEvidence {
  id: number;
  requirement_id: number;
  requirement_code: string;
  requirement_title: string;
  file_name: string;
  file_url: string;
  description: string | null;
  uploaded_at: string;
}

export interface ApiApplicationDetail {
  id: number;
  badge_id: number;
  badge_name: string;
  status: string;
  final_result: string | null;
  evidences: ApiEvidence[];
}

export async function createApplication(badgeId: number): Promise<{ id: number }> {
  return api.post<{ id: number }>('/applications', { badgeId });
}

export async function getMyApplications(): Promise<ApiApplicationSummary[]> {
  return api.get<ApiApplicationSummary[]>('/applications/mine');
}

export async function getApplicationById(id: number): Promise<ApiApplicationDetail> {
  return api.get<ApiApplicationDetail>(`/applications/${id}`);
}

export async function addEvidence(
  applicationId: number,
  data: { requirementId: number; fileName: string; storageKey: string; fileUrl: string; description?: string }
): Promise<void> {
  return api.post(`/applications/${applicationId}/evidences`, data);
}

export async function submitApplication(applicationId: number): Promise<void> {
  return api.post(`/applications/${applicationId}/submit`);
}
