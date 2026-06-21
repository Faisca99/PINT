-- Script para Popular Dados Temporários (Seed)

-- 0. Evitar colisões caso a seed corra duas vezes
DELETE FROM learning_paths WHERE code = 'JT';

-- 1. Inserir Learning Path
INSERT INTO learning_paths (code, name, description) VALUES ('JT', 'Jornada Técnica', 'Jornada técnica principal');

-- 2. Inserir Service Lines
INSERT INTO service_lines (learning_path_id, code, name, description) VALUES 
((SELECT id FROM learning_paths WHERE code = 'JT'), 'HC', 'Hybrid Cloud', 'Soluções de Cloud Híbrida e LowCode'),
((SELECT id FROM learning_paths WHERE code = 'JT'), 'AO', 'Application Operations', 'Operações de Aplicações e DevOps');

-- 3. Inserir Áreas
INSERT INTO areas (service_line_id, code, name) VALUES 
((SELECT id FROM service_lines WHERE code = 'HC'), 'LC', 'LowCode'),
((SELECT id FROM service_lines WHERE code = 'AO'), 'DSO', 'DevSecOps & IT Automation');

-- 4. Inserir Níveis (Atenção: níveis são agregados por área nesta DB)
-- Níveis LowCode
INSERT INTO levels (area_id, code, name, rank_order, description) VALUES 
((SELECT id FROM areas WHERE code = 'LC'), 'A', 'Júnior', 1, 'Aprendizagem inicial em contexto de trabalho'),
((SELECT id FROM areas WHERE code = 'LC'), 'B', 'Intermédio', 2, 'Execução autónoma de tarefas'),
((SELECT id FROM areas WHERE code = 'LC'), 'C', 'Sénior', 3, 'Domínio avançado e mentoria');

-- Níveis DevSecOps
INSERT INTO levels (area_id, code, name, rank_order, description) VALUES 
((SELECT id FROM areas WHERE code = 'DSO'), 'B', 'Intermédio', 2, 'Execução autónoma em pipelines');

-- 5. Inserir Badges
INSERT INTO badges (level_id, code, name, description, points) VALUES 
-- Badges de LowCode
((SELECT id FROM levels WHERE code = 'A' AND area_id = (SELECT id FROM areas WHERE code = 'LC')), 'BDG-LC-A', 'Bronze - LowCode', 'Certificação base nas ferramentas LowCode da Softinsa', 50),
((SELECT id FROM levels WHERE code = 'B' AND area_id = (SELECT id FROM areas WHERE code = 'LC')), 'BDG-LC-B', 'Prata - LowCode', 'Desenvolvimento autónomo e independência de documentação básica', 100),
((SELECT id FROM levels WHERE code = 'C' AND area_id = (SELECT id FROM areas WHERE code = 'LC')), 'BDG-LC-C', 'Ouro - LowCode', 'Arquitetura e desenvolvimento Master', 250),

-- Badges de DevSecOps
((SELECT id FROM levels WHERE code = 'B' AND area_id = (SELECT id FROM areas WHERE code = 'DSO')), 'BDG-DSO-B', 'Prata - DevOps', 'Implementação de pipelines de CI/CD', 100);

