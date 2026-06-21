export type BadgeStatus = "available" | "obtained" | "in-progress" | "expired";
export type ApplicationStatus = "open" | "submitted" | "em-validacao" | "fechado-aprovado" | "fechado-rejeitado" | "devolvido";
export type BadgeLevel = "A" | "B" | "C" | "D" | "E";

export interface Badge {
  id: string;
  title: string;
  description: string;
  level: BadgeLevel;
  points: number;
  area: string;
  serviceLine: string;
  learningPath: string;
  status: BadgeStatus;
  icon: string;
  color: string;
  skills: string[];
  requirements: Requirement[];
  holders: number;
  expiration?: string;
  obtainedDate?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "document" | "link" | "image" | "certification";
  mandatory: boolean;
}

export interface Application {
  id: string;
  badgeId: string;
  badgeTitle: string;
  badgeLevel: BadgeLevel;
  consultorName: string;
  consultorArea: string;
  status: ApplicationStatus;
  submittedDate: string;
  lastUpdate: string;
  lastComment?: string;
  evidences: Evidence[];
  timeline: TimelineEvent[];
  slaDeadline?: string;
  slaRisk?: boolean;
}

export interface Evidence {
  id: string;
  requirementTitle: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface TimelineEvent {
  id: string;
  date: string;
  action: string;
  actor: string;
  comment?: string;
  status: ApplicationStatus;
}

export interface Notification {
  id: string;
  type: "approval" | "rejection" | "sendback" | "notice" | "sla" | "expiration" | "reminder";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "consultor";
  area: string;
  serviceLine: string;
  avatar: string;
  status: "active" | "inactive";
  badges: number;
  points: number;
  joinDate: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  category: string;
  date: string;
  active: boolean;
  read: boolean;
}

// Mock Badges — aligned with PINT 2025 spec
export const mockBadges: Badge[] = [
  {
    id: "b1",
    title: "LowCode Júnior",
    description: "Fundamentos de desenvolvimento LowCode com plataformas OutSystems e Power Apps.",
    level: "A",
    points: 50,
    area: "LowCode",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    status: "obtained",
    icon: "⚡",
    color: "#0bacda",
    skills: ["OutSystems", "Power Apps", "Lógica de Negócio", "Interfaces LowCode"],
    requirements: [
      { id: "r1", title: "Certificação LowCode Foundation", description: "Upload do certificado oficial LowCode", type: "certification", mandatory: true },
      { id: "r2", title: "Projeto demonstrativo", description: "Descrição de uma aplicação desenvolvida", type: "document", mandatory: true },
    ],
    holders: 41,
    obtainedDate: "2024-10-12",
  },
  {
    id: "b2",
    title: "LowCode Intermédio",
    description: "Desenvolvimento avançado em plataformas LowCode, integrações e boas práticas.",
    level: "B",
    points: 100,
    area: "LowCode",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    status: "obtained",
    icon: "🔷",
    color: "#1e4d8c",
    skills: ["OutSystems Reactive", "Integrações REST", "Performance", "UX Patterns"],
    requirements: [
      { id: "r3", title: "Certificação Associate Developer", description: "Upload do certificado Associate ou equivalente", type: "certification", mandatory: true },
      { id: "r4", title: "Caso de uso real", description: "Documento descritivo de caso real implementado", type: "document", mandatory: true },
    ],
    holders: 27,
    obtainedDate: "2025-01-20",
  },
  {
    id: "b3",
    title: "LowCode Sénior",
    description: "Arquitetura e liderança técnica em projetos LowCode de grande escala.",
    level: "C",
    points: 250,
    area: "LowCode",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    status: "in-progress",
    icon: "🏗️",
    color: "#2d9d6e",
    skills: ["Arquitetura OutSystems", "CI/CD", "Segurança", "Performance Tuning"],
    requirements: [
      { id: "r5", title: "Certificação Professional Developer", description: "Upload do certificado Professional", type: "certification", mandatory: true },
      { id: "r6", title: "Projeto de arquitetura", description: "Documento de arquitetura de sistema real", type: "document", mandatory: true },
      { id: "r7", title: "Link do perfil OutSystems", description: "Perfil com badges OutSystems obtidos", type: "link", mandatory: false },
    ],
    holders: 14,
    expiration: "2027-01-20",
  },
  {
    id: "b4",
    title: "LowCode Especialista",
    description: "Excelência técnica, mentoria e contribuição para a prática LowCode da Softinsa.",
    level: "D",
    points: 400,
    area: "LowCode",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    status: "available",
    icon: "🎯",
    color: "#8b5cf6",
    skills: ["Mentoring", "Arquitetura Enterprise", "Liderança Técnica", "Inovação"],
    requirements: [
      { id: "r8", title: "Certificação Expert", description: "Certificação Expert OutSystems ou equivalente", type: "certification", mandatory: true },
      { id: "r9", title: "Sessão de conhecimento", description: "Registo de sessão/webinar interno realizado", type: "document", mandatory: true },
    ],
    holders: 5,
  },
  {
    id: "b5",
    title: "DevSecOps Júnior",
    description: "Fundamentos de segurança integrada no ciclo de desenvolvimento de software.",
    level: "A",
    points: 50,
    area: "DevSecOps & IT Automation",
    serviceLine: "Application Operations",
    learningPath: "Jornada Técnica",
    status: "obtained",
    icon: "🔐",
    color: "#ef4444",
    skills: ["SAST/DAST", "Pipeline Seguro", "OWASP Top 10", "Gestão de Vulnerabilidades"],
    requirements: [
      { id: "r10", title: "Formação DevSecOps Foundation", description: "Upload do certificado de formação", type: "certification", mandatory: true },
      { id: "r11", title: "Relatório de análise", description: "Relatório de análise de segurança de um projeto", type: "document", mandatory: true },
    ],
    holders: 22,
    obtainedDate: "2025-02-05",
  },
  {
    id: "b6",
    title: "Talent Management Júnior",
    description: "Fundamentos de gestão de talentos, onboarding e desenvolvimento de pessoas.",
    level: "A",
    points: 50,
    area: "Talent Management",
    serviceLine: "Sourcing & Talent Management",
    learningPath: "Power Skills",
    status: "available",
    icon: "👥",
    color: "#f59e0b",
    skills: ["Recrutamento", "Onboarding", "Avaliação de Desempenho", "People Analytics"],
    requirements: [
      { id: "r12", title: "Formação HR Fundamentals", description: "Upload do certificado de formação", type: "certification", mandatory: true },
      { id: "r13", title: "Caso prático de onboarding", description: "Documento descritivo de processo de onboarding", type: "document", mandatory: false },
    ],
    holders: 18,
  },
  {
    id: "b7",
    title: "LowCode Líder de Conhecimento",
    description: "Referência de conhecimento LowCode na Softinsa. Contribuição para a estratégia técnica.",
    level: "E",
    points: 600,
    area: "LowCode",
    serviceLine: "Hybrid Cloud",
    learningPath: "Jornada Técnica",
    status: "available",
    icon: "🏆",
    color: "#1e4d8c",
    skills: ["Estratégia Técnica", "Comunidade Prática", "Publicações", "Inovação"],
    requirements: [
      { id: "r14", title: "Portfólio de contribuições", description: "Portfólio com contribuições para a prática LowCode", type: "document", mandatory: true },
      { id: "r15", title: "Recomendação de líder", description: "Carta de recomendação de líder de service line", type: "document", mandatory: true },
    ],
    holders: 2,
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: "app1",
    badgeId: "b3",
    badgeTitle: "LowCode Sénior",
    badgeLevel: "C",
    consultorName: "Francisco Abreu",
    consultorArea: "LowCode",
    status: "em-validacao",
    submittedDate: "2025-05-02",
    lastUpdate: "2025-05-10",
    lastComment: "Evidências verificadas. A aguardar aprovação do Service Line Leader.",
    evidences: [
      { id: "e1", requirementTitle: "Certificação Professional Developer", fileName: "outsystems_professional.pdf", fileType: "pdf", uploadDate: "2025-05-02", status: "approved" },
      { id: "e2", requirementTitle: "Projeto de arquitetura", fileName: "projeto_arquitetura.docx", fileType: "docx", uploadDate: "2025-05-02", status: "approved" },
    ],
    timeline: [
      { id: "t1", date: "2025-05-01", action: "Candidatura criada", actor: "Francisco Abreu", status: "open" },
      { id: "t2", date: "2025-05-02", action: "Candidatura submetida", actor: "Francisco Abreu", status: "submitted" },
      { id: "t3", date: "2025-05-05", action: "Em validação pelo Talent Manager", actor: "Carlos Mendes", status: "em-validacao" },
      { id: "t4", date: "2025-05-10", action: "Enviada para Service Line Leader", actor: "Carlos Mendes", comment: "Evidências verificadas. A aguardar aprovação.", status: "em-validacao" },
    ],
    slaDeadline: "2025-05-22",
  },
  {
    id: "app2",
    badgeId: "b1",
    badgeTitle: "LowCode Júnior",
    badgeLevel: "A",
    consultorName: "Francisco Abreu",
    consultorArea: "LowCode",
    status: "fechado-aprovado",
    submittedDate: "2024-10-01",
    lastUpdate: "2024-10-12",
    lastComment: "Excelente trabalho! Badge aprovado.",
    evidences: [
      { id: "e3", requirementTitle: "Certificação LowCode Foundation", fileName: "lowcode_foundation.pdf", fileType: "pdf", uploadDate: "2024-10-01", status: "approved" },
      { id: "e4", requirementTitle: "Projeto demonstrativo", fileName: "app_demo.pdf", fileType: "pdf", uploadDate: "2024-10-01", status: "approved" },
    ],
    timeline: [
      { id: "t5", date: "2024-10-01", action: "Candidatura criada", actor: "Francisco Abreu", status: "open" },
      { id: "t6", date: "2024-10-01", action: "Candidatura submetida", actor: "Francisco Abreu", status: "submitted" },
      { id: "t7", date: "2024-10-08", action: "Em validação", actor: "Carlos Mendes", status: "em-validacao" },
      { id: "t8", date: "2024-10-12", action: "Badge aprovado", actor: "Sofia Costa", comment: "Excelente trabalho! Badge aprovado.", status: "fechado-aprovado" },
    ],
  },
  {
    id: "app3",
    badgeId: "b5",
    badgeTitle: "DevSecOps Júnior",
    badgeLevel: "A",
    consultorName: "Francisco Abreu",
    consultorArea: "LowCode",
    status: "devolvido",
    submittedDate: "2025-04-20",
    lastUpdate: "2025-04-28",
    lastComment: "Por favor faça upload do relatório de análise de segurança completo.",
    evidences: [
      { id: "e5", requirementTitle: "Relatório de análise", fileName: "relatorio_incompleto.pdf", fileType: "pdf", uploadDate: "2025-04-20", status: "rejected" },
    ],
    timeline: [
      { id: "t9", date: "2025-04-20", action: "Candidatura submetida", actor: "Francisco Abreu", status: "submitted" },
      { id: "t10", date: "2025-04-28", action: "Devolvida ao consultor", actor: "Carlos Mendes", comment: "Por favor faça upload do relatório de análise completo.", status: "devolvido" },
    ],
  },
  {
    id: "app4",
    badgeId: "b2",
    badgeTitle: "LowCode Intermédio",
    badgeLevel: "B",
    consultorName: "Francisco Abreu",
    consultorArea: "LowCode",
    status: "fechado-aprovado",
    submittedDate: "2025-01-10",
    lastUpdate: "2025-01-20",
    lastComment: "Badge aprovado com distinção.",
    evidences: [
      { id: "e6", requirementTitle: "Certificação Associate Developer", fileName: "outsystems_associate.pdf", fileType: "pdf", uploadDate: "2025-01-10", status: "approved" },
    ],
    timeline: [
      { id: "t11", date: "2025-01-10", action: "Candidatura submetida", actor: "Francisco Abreu", status: "submitted" },
      { id: "t12", date: "2025-01-15", action: "Em validação", actor: "Carlos Mendes", status: "em-validacao" },
      { id: "t13", date: "2025-01-20", action: "Badge aprovado", actor: "Sofia Costa", comment: "Badge aprovado com distinção.", status: "fechado-aprovado" },
    ],
  },
];

// Mock Users (consultores only)
export const mockUsers: User[] = [
  { id: "u1", name: "Francisco Abreu", email: "francisco.abreu@softinsa.pt", role: "consultor", area: "LowCode", serviceLine: "Hybrid Cloud", avatar: "FA", status: "active", badges: 3, points: 350, joinDate: "2023-06-01" },
  { id: "u2", name: "Pedro Santos", email: "pedro.santos@softinsa.pt", role: "consultor", area: "DevSecOps & IT Automation", serviceLine: "Application Operations", avatar: "PS", status: "active", badges: 4, points: 520, joinDate: "2023-07-01" },
  { id: "u3", name: "Maria Oliveira", email: "maria.oliveira@softinsa.pt", role: "consultor", area: "LowCode", serviceLine: "Hybrid Cloud", avatar: "MO", status: "active", badges: 5, points: 650, joinDate: "2022-11-20" },
  { id: "u4", name: "João Rodrigues", email: "joao.rodrigues@softinsa.pt", role: "consultor", area: "DevSecOps & IT Automation", serviceLine: "Application Operations", avatar: "JR", status: "active", badges: 7, points: 900, joinDate: "2022-05-10" },
  { id: "u5", name: "Inês Carvalho", email: "ines.carvalho@softinsa.pt", role: "consultor", area: "Talent Management", serviceLine: "Sourcing & Talent Management", avatar: "IC", status: "active", badges: 2, points: 200, joinDate: "2024-01-15" },
  { id: "u6", name: "Rui Pinheiro", email: "rui.pinheiro@softinsa.pt", role: "consultor", area: "LowCode", serviceLine: "Hybrid Cloud", avatar: "RP", status: "active", badges: 6, points: 800, joinDate: "2022-09-01" },
  { id: "u7", name: "Catarina Silva", email: "catarina.silva@softinsa.pt", role: "consultor", area: "Talent Management", serviceLine: "Sourcing & Talent Management", avatar: "CS", status: "active", badges: 3, points: 300, joinDate: "2023-03-15" },
  { id: "u8", name: "Luís Ferreira", email: "luis.ferreira@softinsa.pt", role: "consultor", area: "DevSecOps & IT Automation", serviceLine: "Application Operations", avatar: "LF", status: "active", badges: 4, points: 480, joinDate: "2023-01-10" },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: "n1", type: "approval", title: "Badge Aprovado! 🎉", message: "O seu badge LowCode Intermédio foi aprovado. Parabéns!", date: "2025-01-20", read: false },
  { id: "n2", type: "sendback", title: "Candidatura Devolvida", message: "A sua candidatura para DevSecOps Júnior foi devolvida. Por favor verifique os comentários.", date: "2025-04-28", read: false },
  { id: "n3", type: "reminder", title: "Candidatura em validação", message: "A sua candidatura LowCode Sénior está em validação há 8 dias.", date: "2025-05-10", read: true },
  { id: "n4", type: "notice", title: "Novo Learning Path: Power Skills", message: "Foi adicionado o Learning Path Power Skills com novos badges disponíveis.", date: "2025-05-01", read: false },
  { id: "n5", type: "sla", title: "Alerta de Prazo", message: "A candidatura LowCode Sénior está próxima do prazo SLA (22 Maio).", date: "2025-05-15", read: false },
];

// Mock Notices
export const mockNotices: Notice[] = [
  { id: "av1", title: "Novo Learning Path: Power Skills", message: "Estão disponíveis novos badges no Learning Path Power Skills. Explore o catálogo e candidate-se!", category: "Novidades", date: "2025-05-01", active: true, read: false },
  { id: "av2", title: "Atualização da Política de Badges", message: "A política de expiração de badges foi atualizada. Badges de nível C e D passam a ter validade de 2 anos.", category: "Política", date: "2025-04-20", active: true, read: true },
  { id: "av3", title: "Manutenção Programada", message: "A plataforma PINT estará em manutenção no dia 22 de Maio, entre as 22h e as 00h.", category: "Sistema", date: "2025-04-15", active: true, read: true },
  { id: "av4", title: "Campanha de Certificações OutSystems", message: "A Softinsa vai financiar certificações OutSystems Professional até Setembro 2025. Fale com o seu Talent Manager.", category: "Formação", date: "2025-03-01", active: true, read: false },
];

// Leaderboard data
export const mockLeaderboard = [
  { rank: 1, name: "João Rodrigues", area: "DevSecOps & IT Automation", avatar: "JR", points: 900, badges: 7 },
  { rank: 2, name: "Rui Pinheiro", area: "LowCode", avatar: "RP", points: 800, badges: 6 },
  { rank: 3, name: "Maria Oliveira", area: "LowCode", avatar: "MO", points: 650, badges: 5 },
  { rank: 4, name: "Pedro Santos", area: "DevSecOps & IT Automation", avatar: "PS", points: 520, badges: 4 },
  { rank: 5, name: "Luís Ferreira", area: "DevSecOps & IT Automation", avatar: "LF", points: 480, badges: 4 },
  { rank: 6, name: "Francisco Abreu", area: "LowCode", avatar: "FA", points: 350, badges: 3 },
  { rank: 7, name: "Catarina Silva", area: "Talent Management", avatar: "CS", points: 300, badges: 3 },
  { rank: 8, name: "Inês Carvalho", area: "Talent Management", avatar: "IC", points: 200, badges: 2 },
];

// Monthly chart data
export const monthlyBadgesData = [
  { month: "Jan", badges: 2 },
  { month: "Fev", badges: 1 },
  { month: "Mar", badges: 0 },
  { month: "Abr", badges: 1 },
  { month: "Mai", badges: 1 },
];

export const badgesByArea = [
  { area: "LowCode", count: 22 },
  { area: "DevSecOps", count: 14 },
  { area: "Talent Mgmt", count: 9 },
];

export const badgesByLevel = [
  { level: "A", count: 18, color: "#2d9d6e" },
  { level: "B", count: 12, color: "#1e4d8c" },
  { level: "C", count: 8, color: "#f59e0b" },
  { level: "D", count: 4, color: "#8b5cf6" },
  { level: "E", count: 1, color: "#dc2626" },
];
