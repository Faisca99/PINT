-- ============================================================
-- SEED ESTRUTURA COMPLETA — Jornada Técnica
-- Corre este script na BD Neon para completar a estrutura do PDF
-- Constraints: levels UNIQUE(area_id,code) + UNIQUE(area_id,rank_order)
--              badges UNIQUE(code) + UNIQUE(level_id)
--              service_lines UNIQUE(code), areas UNIQUE(code)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. SERVICE LINE em falta: Sourcing & Talent Management
-- ============================================================
INSERT INTO service_lines (learning_path_id, code, name, description, is_active)
VALUES (7, 'STM', 'Sourcing & Talent Management', 'Recrutamento, Sourcing e Gestão de Talentos', TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 2. ÁREA em falta: Talent Management
-- ============================================================
INSERT INTO areas (service_line_id, code, name, is_active)
SELECT id, 'TM', 'Talent Management', TRUE
FROM service_lines WHERE code = 'STM'
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 3. NÍVEIS em falta
-- ============================================================

-- LowCode D
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'D', 'Especialista', 4, 'Liderança técnica e inovação em LowCode', TRUE
FROM areas WHERE code = 'LC'
ON CONFLICT (area_id, code) DO NOTHING;

-- LowCode E
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'E', 'Líder de Conhecimento', 5, 'Referência máxima e evangelismo LowCode', TRUE
FROM areas WHERE code = 'LC'
ON CONFLICT (area_id, code) DO NOTHING;

-- DevSecOps A
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'A', 'Júnior', 1, 'Fundamentos de DevOps e CI/CD', TRUE
FROM areas WHERE code = 'DSO'
ON CONFLICT (area_id, code) DO NOTHING;

-- DevSecOps C
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'C', 'Sénior', 3, 'Arquitetura DevSecOps e automação avançada', TRUE
FROM areas WHERE code = 'DSO'
ON CONFLICT (area_id, code) DO NOTHING;

-- DevSecOps D
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'D', 'Especialista', 4, 'Liderança de plataformas DevOps e segurança', TRUE
FROM areas WHERE code = 'DSO'
ON CONFLICT (area_id, code) DO NOTHING;

-- DevSecOps E
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT id, 'E', 'Líder de Conhecimento', 5, 'Referência máxima em DevSecOps', TRUE
FROM areas WHERE code = 'DSO'
ON CONFLICT (area_id, code) DO NOTHING;

-- Talent Management A-E
INSERT INTO levels (area_id, code, name, rank_order, description, is_active)
SELECT a.id, lv.lcode, lv.lname, lv.lrank, lv.ldesc, TRUE
FROM areas a,
  (VALUES
    ('A', 'Júnior',              1, 'Fundamentos de Talent Management'),
    ('B', 'Intermédio',          2, 'Gestão autónoma de processos de selecção'),
    ('C', 'Sénior',              3, 'Estratégia de atração de talento'),
    ('D', 'Especialista',        4, 'Liderança de equipas e talentos críticos'),
    ('E', 'Líder de Conhecimento', 5, 'Visão estratégica de People & Culture')
  ) AS lv(lcode, lname, lrank, ldesc)
WHERE a.code = 'TM'
ON CONFLICT (area_id, code) DO NOTHING;

-- ============================================================
-- 4. BADGES em falta
-- ============================================================

-- LowCode D
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-LC-D', 'Platina - LowCode', 'Especialização avançada e liderança em OutSystems', 'level', 400, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='LC' AND l.code='D'
ON CONFLICT (code) DO NOTHING;

-- LowCode E
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-LC-E', 'Diamante - LowCode', 'Referência máxima OutSystems na Softinsa', 'level', 600, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='LC' AND l.code='E'
ON CONFLICT (code) DO NOTHING;

-- DevSecOps A
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-DSO-A', 'Bronze - DevOps', 'Fundamentos de DevOps, Git e automação básica', 'level', 50, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='DSO' AND l.code='A'
ON CONFLICT (code) DO NOTHING;

-- DevSecOps C
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-DSO-C', 'Ouro - DevOps', 'Arquitetura de plataformas DevSecOps em produção', 'level', 250, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='DSO' AND l.code='C'
ON CONFLICT (code) DO NOTHING;

-- DevSecOps D
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-DSO-D', 'Platina - DevOps', 'Liderança técnica DevOps e segurança aplicacional', 'level', 400, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='DSO' AND l.code='D'
ON CONFLICT (code) DO NOTHING;

-- DevSecOps E
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, 'BDG-DSO-E', 'Diamante - DevOps', 'Referência máxima DevSecOps na Softinsa', 'level', 600, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id WHERE a.code='DSO' AND l.code='E'
ON CONFLICT (code) DO NOTHING;

-- Talent Management A-E
INSERT INTO badges (level_id, code, name, description, badge_type, points, is_active)
SELECT l.id, bv.bcode, bv.bname, bv.bdesc, 'level', bv.pts, TRUE
FROM levels l
JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('A','BDG-TM-A','Bronze - Talent Management','Fundamentos de recrutamento e selecção',50),
  ('B','BDG-TM-B','Prata - Talent Management','Gestão autónoma de processos de selecção',100),
  ('C','BDG-TM-C','Ouro - Talent Management','Estratégia de atração de talento sénior',250),
  ('D','BDG-TM-D','Platina - Talent Management','Liderança de People & Talent Strategy',400),
  ('E','BDG-TM-E','Diamante - Talent Management','Referência máxima em Talent & Culture',600)
) AS bv(lcode, bcode, bname, bdesc, pts) ON bv.lcode = l.code
WHERE a.code = 'TM'
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 5. REQUISITOS em falta (2 por nível, todos os novos)
-- ============================================================

-- LowCode D
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('D1','Certificado OutSystems Architecture','Certificação OutSystems Architecture Specialist.','Submeter certificado com número de registo e data.',1),
  ('D2','Projeto de Arquitetura Enterprise','Liderança de arquitetura de projeto OutSystems enterprise em produção.','Submeter diagrama de arquitetura e documento de decisões.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='LC' AND l.code='D';

-- LowCode E
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('E1','Formação Interna (mín. 2 sessões)','Realização de pelo menos 2 sessões de formação interna em OutSystems.','Submeter materiais, registo de participantes e feedback.',1),
  ('E2','Contribuição para Comunidade OutSystems','Publicação de artigo, plugin ou contribuição na Forge OutSystems.','Submeter link público da contribuição.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='LC' AND l.code='E';

-- DevSecOps A
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('A1','Domínio de Git','Contribuição activa em repositório Git com branches e merges.','Submeter link do repositório com histórico de contribuições.',1),
  ('A2','Pipeline CI/CD Básico','Criação de pipeline CI (build+test) num projeto real ou de estudo.','Submeter link do repo com o pipeline e screenshot de execução.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='DSO' AND l.code='A';

-- DevSecOps C
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('C1','Arquitetura DevSecOps em Produção','Design de arquitetura completa (CI/CD+security+monitoring) em produção.','Submeter diagrama de arquitetura e evidências de implementação.',1),
  ('C2','Certificação Kubernetes (CKA/CKAD) ou equivalente','Certificação cloud/container reconhecida internacionalmente.','Submeter certificado com número de verificação e data.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='DSO' AND l.code='C';

-- DevSecOps D
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('D1','Liderança de Plataforma DevOps','Responsabilidade técnica por plataforma CI/CD usada por múltiplas equipas.','Submeter descrição do âmbito, equipas envolvidas e métricas de adopção.',1),
  ('D2','Certificação de Segurança Aplicacional','Certificação em segurança (CSSLP, CEH ou equivalente cloud security).','Submeter certificado com número de registo.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='DSO' AND l.code='D';

-- DevSecOps E
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('E1','Framework DevSecOps Interno','Criação de framework de boas práticas DevSecOps adoptado em toda a empresa.','Submeter documento publicado internamente e evidências de adopção.',1),
  ('E2','Mentoria de Equipa DevOps','Mentoria formal de pelo menos 3 colaboradores que atingiram nível B ou superior.','Submeter registo de mentorias e avaliação dos mentorados.',2)
) AS rv(rcode,rtitle,rdesc,rev,rord) ON TRUE
WHERE a.code='DSO' AND l.code='E';

-- Talent Management A-E
INSERT INTO requirements (level_id, code, title, description, evidence_instructions, display_order, is_active)
SELECT l.id, rv.rcode, rv.rtitle, rv.rdesc, rv.rev, rv.rord, TRUE
FROM levels l JOIN areas a ON a.id = l.area_id
JOIN (VALUES
  ('A','A1','Participação em 3 Processos de Recrutamento','Participação activa em pelo menos 3 processos de recrutamento completos.','Submeter relatório com número de candidatos, etapas e resultado.',1),
  ('A','A2','Formação em Recrutamento e Selecção','Curso de formação em RH (mínimo 20h).','Submeter certificado com data e instituição.',2),
  ('B','B1','Gestão Autónoma de 5 Processos','Condução autónoma de pelo menos 5 processos de selecção.','Submeter relatório com métricas de qualidade (time-to-hire, retention).',1),
  ('B','B2','Contribuição para Employer Branding','Participação na criação de conteúdos de employer branding publicados.','Submeter links dos conteúdos e descrição do contributo.',2),
  ('C','C1','Estratégia de Atração de Talento','Desenvolvimento e implementação de estratégia para área específica.','Submeter documento de estratégia e resultados quantitativos.',1),
  ('C','C2','Certificação SHRM ou equivalente','Certificação internacional em Gestão de RH (SHRM-CP, PHR, ou equivalente).','Submeter certificado com número de registo e entidade emissora.',2),
  ('D','D1','Liderança de Equipa de Recrutamento','Liderança formal de equipa de recrutamento (mín. 3 meses, mín. 2 elementos).','Submeter descrição do papel, composição da equipa e resultados.',1),
  ('D','D2','People Analytics','Criação de dashboard de People Analytics com KPIs de talent management.','Submeter screenshot/export do dashboard e descrição das métricas.',2),
  ('E','E1','Estratégia People & Culture','Definição e implementação de estratégia aprovada pela direcção.','Submeter documento de estratégia e evidências de implementação.',1),
  ('E','E2','Publicação ou Apresentação Reconhecida','Artigo, palestra ou workshop em evento de RH (interno ou externo).','Submeter link/evidência e confirmação de participação.',2)
) AS rv(lcode, rcode, rtitle, rdesc, rev, rord) ON rv.lcode = l.code
WHERE a.code = 'TM';

COMMIT;

-- ============================================================
-- VERIFICAÇÃO FINAL
-- ============================================================
SELECT 'Service Lines' AS entidade, COUNT(*) AS total FROM service_lines WHERE is_active = TRUE
UNION ALL SELECT 'Áreas', COUNT(*) FROM areas WHERE is_active = TRUE
UNION ALL SELECT 'Níveis', COUNT(*) FROM levels WHERE is_active = TRUE
UNION ALL SELECT 'Badges', COUNT(*) FROM badges WHERE is_active = TRUE
UNION ALL SELECT 'Requisitos', COUNT(*) FROM requirements WHERE is_active = TRUE;
