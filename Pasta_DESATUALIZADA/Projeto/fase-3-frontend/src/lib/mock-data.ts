// Mock data for UI development

export type BadgeStatus = "open" | "submitted" | "in_validation" | "closed";
export type BadgeResult = "pending" | "approved" | "rejected";
export type BadgeTier = "junior" | "intermediate" | "senior" | "specialist" | "knowledge_leader";
export type UserRole = "admin" | "consultant" | "talent_manager" | "service_line_leader";

export interface Badge {
  id: string;
  title: string;
  description: string;
  tier: BadgeTier;
  tierCode: string;
  area: string;
  serviceLine: string;
  points: number;
  isPremium: boolean;
  imageUrl?: string;
}

export interface Submission {
  id: string;
  badge: Badge;
  status: BadgeStatus;
  result: BadgeResult;
  submittedAt: string;
  comment?: string;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  earnedAt: string;
  verificationCode: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const TIER_CONFIG: Record<BadgeTier, { label: string; color: string; level: number }> = {
  junior: { label: "Júnior", color: "bg-success/10 text-success", level: 1 },
  intermediate: { label: "Intermédio", color: "bg-info/10 text-info", level: 2 },
  senior: { label: "Sénior", color: "bg-warning/10 text-warning", level: 3 },
  specialist: { label: "Especialista", color: "bg-primary/10 text-primary", level: 4 },
  knowledge_leader: { label: "Líder de Conhecimento", color: "bg-destructive/10 text-destructive", level: 5 },
};

export const SERVICE_LINES = [
  "Hybrid Cloud",
  "Application Operations",
  "Sourcing & Talent Management",
  "Data & AI",
  "Security",
];

export const AREAS: Record<string, string[]> = {
  "Hybrid Cloud": ["LowCode (OutSystems)", "Cloud Native", "Integration"],
  "Application Operations": ["DevSecOps & IT Automation – DevOps", "Monitoring", "ITSM"],
  "Sourcing & Talent Management": ["Talent Management", "Recruitment", "Workforce Planning"],
  "Data & AI": ["Data Engineering", "Machine Learning", "Analytics"],
  "Security": ["Identity & Access", "Compliance", "Threat Management"],
};

export const mockBadges: Badge[] = [
  { id: "1", title: "OutSystems Reactive Developer", description: "Domínio do desenvolvimento de aplicações reativas com OutSystems, incluindo UI patterns e lógica client-side.", tier: "junior", tierCode: "A1", area: "LowCode (OutSystems)", serviceLine: "Hybrid Cloud", points: 50, isPremium: false },
  { id: "2", title: "OutSystems Traditional Developer", description: "Competências em desenvolvimento Traditional Web com OutSystems.", tier: "junior", tierCode: "A2", area: "LowCode (OutSystems)", serviceLine: "Hybrid Cloud", points: 50, isPremium: false },
  { id: "3", title: "OutSystems Architecture Specialist", description: "Capacidade de desenhar arquiteturas escaláveis em OutSystems.", tier: "intermediate", tierCode: "B1", area: "LowCode (OutSystems)", serviceLine: "Hybrid Cloud", points: 100, isPremium: false },
  { id: "4", title: "DevOps Foundation", description: "Fundamentos de DevOps: CI/CD, automação e cultura colaborativa.", tier: "junior", tierCode: "A1", area: "DevSecOps & IT Automation – DevOps", serviceLine: "Application Operations", points: 50, isPremium: false },
  { id: "5", title: "Kubernetes Administrator", description: "Administração avançada de clusters Kubernetes em ambientes de produção.", tier: "senior", tierCode: "C1", area: "DevSecOps & IT Automation – DevOps", serviceLine: "Application Operations", points: 200, isPremium: true },
  { id: "6", title: "Talent Acquisition Specialist", description: "Especialização em processos de recrutamento e seleção.", tier: "intermediate", tierCode: "B1", area: "Talent Management", serviceLine: "Sourcing & Talent Management", points: 100, isPremium: false },
  { id: "7", title: "Data Pipeline Engineer", description: "Construção e manutenção de pipelines de dados escaláveis.", tier: "senior", tierCode: "C1", area: "Data Engineering", serviceLine: "Data & AI", points: 200, isPremium: false },
  { id: "8", title: "ML Model Deployment", description: "Deploy e monitorização de modelos de Machine Learning em produção.", tier: "specialist", tierCode: "D1", area: "Machine Learning", serviceLine: "Data & AI", points: 300, isPremium: true },
  { id: "9", title: "Cloud Security Fundamentals", description: "Fundamentos de segurança em ambientes cloud.", tier: "junior", tierCode: "A1", area: "Identity & Access", serviceLine: "Security", points: 50, isPremium: false },
  { id: "10", title: "Zero Trust Architecture", description: "Implementação de arquiteturas Zero Trust.", tier: "knowledge_leader", tierCode: "E1", area: "Identity & Access", serviceLine: "Security", points: 500, isPremium: true },
];

export const mockSubmissions: Submission[] = [
  { id: "s1", badge: mockBadges[0], status: "submitted", result: "pending", submittedAt: "2025-02-15" },
  { id: "s2", badge: mockBadges[2], status: "in_validation", result: "pending", submittedAt: "2025-02-10" },
  { id: "s3", badge: mockBadges[3], status: "closed", result: "approved", submittedAt: "2025-01-20" },
  { id: "s4", badge: mockBadges[4], status: "closed", result: "rejected", submittedAt: "2025-01-15", comment: "Evidências insuficientes. Por favor submeta o certificado oficial." },
];

export const mockUserBadges: UserBadge[] = [
  { id: "ub1", badge: mockBadges[3], earnedAt: "2025-01-25", verificationCode: "VRF-2025-001-ABC" },
  { id: "ub2", badge: mockBadges[8], earnedAt: "2024-12-10", verificationCode: "VRF-2024-042-XYZ" },
];

export const mockAchievements: Achievement[] = [
  { id: "a1", name: "Primeiro Badge", description: "Obteve o primeiro badge na plataforma", icon: "🏆", unlockedAt: "2024-12-10" },
  { id: "a2", name: "Velocista", description: "Obteve 3 badges em menos de 3 meses", icon: "⚡", unlockedAt: "2025-01-25" },
  { id: "a3", name: "Multi-área", description: "Badges em 3 áreas diferentes", icon: "🌐" },
  { id: "a4", name: "Especialista Premium", description: "Obteve um badge premium", icon: "💎" },
];

export const mockUser = {
  id: "u1",
  name: "João Silva",
  email: "joao.silva@softinsa.com",
  role: "consultant" as UserRole,
  area: "LowCode (OutSystems)",
  serviceLine: "Hybrid Cloud",
  totalPoints: 100,
  avatarUrl: "",
};
