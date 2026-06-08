-- ============================================================
-- PINT 2025 — Softinsa Badges Platform
-- Seed: Requirements + Users + Roles + Assignments + Preferences
-- Depende de: 07-seed-inicial.sql (learning_paths, service_lines,
--             areas, levels, badges já inseridos)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. REQUIREMENTS
-- ============================================================

-- Nível A — LowCode (Júnior)
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order)
VALUES
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'A' AND a.code = 'LC'),
    'A1',
    'Certificado OutSystems Associate',
    'Obtenção da certificação oficial OutSystems Associate Developer.',
    'Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.',
    1
),
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'A' AND a.code = 'LC'),
    'A2',
    'Projeto Entregue em Produção',
    'Participação comprovada num projeto LowCode entregue e em produção.',
    'Submeter print do deployment em produção e breve descrição do projeto (máx. 500 palavras) com o nome do cliente anonimizado.',
    2
);

-- Nível B — LowCode (Intermédio)
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order)
VALUES
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'B' AND a.code = 'LC'),
    'B1',
    'Certificado OutSystems Professional',
    'Obtenção da certificação oficial OutSystems Professional Developer.',
    'Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.',
    1
),
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'B' AND a.code = 'LC'),
    'B2',
    'Liderança de Módulo',
    'Liderança técnica de pelo menos um módulo ou componente num projeto em produção.',
    'Submeter documento de arquitetura do módulo ou registo de pull requests com descrição do papel desempenhado, validado pelo team lead.',
    2
);

-- Nível C — LowCode (Sénior)
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order)
VALUES
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'C' AND a.code = 'LC'),
    'C1',
    'Certificado OutSystems Expert',
    'Obtenção da certificação oficial OutSystems Expert (Distinguished Software Engineer ou equivalente atual).',
    'Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.',
    1
),
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'C' AND a.code = 'LC'),
    'C2',
    'Arquitetura de Sistema Complexo',
    'Conceção e documentação da arquitetura de um sistema complexo (multi-tenant, alta disponibilidade ou integrações críticas).',
    'Submeter diagrama de arquitetura (C4 ou equivalente) e documento de decisões arquiteturais (ADR) revisto pela Service Line.',
    2
);

-- Nível B — DevSecOps & IT Automation (Intermédio)
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order)
VALUES
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'B' AND a.code = 'DSO'),
    'B1',
    'Pipeline CI/CD Implementado',
    'Implementação de um pipeline de CI/CD completo (build, test, deploy) num projeto real ou interno.',
    'Submeter link do repositório (ou export do pipeline) com descrição das etapas implementadas e evidência de execução com sucesso (screenshot ou log).',
    1
),
(
    (SELECT l.id FROM levels l JOIN areas a ON a.id = l.area_id WHERE l.code = 'B' AND a.code = 'DSO'),
    'B2',
    'Certificado Docker/Kubernetes',
    'Obtenção de certificação oficial em containerização ou orquestração (ex: Docker Certified Associate, CKA, CKAD ou equivalente).',
    'Submeter o certificado emitido pela entidade certificadora com data de emissão e código de verificação.',
    2
);

-- ============================================================
-- 2. UTILIZADORES
-- ============================================================

INSERT INTO users (full_name, email, password_hash, account_status, email_verified, must_change_password)
VALUES
(
    'Administrador Softinsa',
    'admin@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
),
(
    'João Silva',
    'joao.silva@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
),
(
    'Maria Santos',
    'maria.santos@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
),
(
    'Pedro Costa',
    'pedro.costa@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
),
(
    'Ana Costa',
    'ana.costa@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
),
(
    'Carlos Mendes',
    'carlos.mendes@softinsa.pt',
    crypt('Softinsa2025!', gen_salt('bf', 10)),
    'active',
    TRUE,
    FALSE
);

-- Definir preferred_area_id para os consultores (após inserção dos users)
UPDATE users
SET preferred_area_id = (SELECT id FROM areas WHERE code = 'LC')
WHERE email IN ('joao.silva@softinsa.pt', 'maria.santos@softinsa.pt');

UPDATE users
SET preferred_area_id = (SELECT id FROM areas WHERE code = 'DSO')
WHERE email = 'pedro.costa@softinsa.pt';

-- ============================================================
-- 3. USER_ROLES
-- ============================================================

INSERT INTO user_roles (user_id, role_id)
VALUES
(
    (SELECT id FROM users WHERE email = 'admin@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'admin')
),
(
    (SELECT id FROM users WHERE email = 'joao.silva@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'consultant')
),
(
    (SELECT id FROM users WHERE email = 'maria.santos@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'consultant')
),
(
    (SELECT id FROM users WHERE email = 'pedro.costa@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'consultant')
),
(
    (SELECT id FROM users WHERE email = 'ana.costa@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'talent_manager')
),
(
    (SELECT id FROM users WHERE email = 'carlos.mendes@softinsa.pt'),
    (SELECT id FROM roles WHERE code = 'service_line_leader')
);

-- ============================================================
-- 4. SERVICE_LINE_ASSIGNMENTS
-- carlos.mendes é SLL da Hybrid Cloud
-- ============================================================

INSERT INTO service_line_assignments (user_id, service_line_id)
VALUES
(
    (SELECT id FROM users WHERE email = 'carlos.mendes@softinsa.pt'),
    (SELECT id FROM service_lines WHERE code = 'HC')
);

-- ============================================================
-- 5. USER_PREFERENCES (uma linha por utilizador)
-- ============================================================

INSERT INTO user_preferences (user_id)
SELECT id FROM users
WHERE email IN (
    'admin@softinsa.pt',
    'joao.silva@softinsa.pt',
    'maria.santos@softinsa.pt',
    'pedro.costa@softinsa.pt',
    'ana.costa@softinsa.pt',
    'carlos.mendes@softinsa.pt'
);

COMMIT;
