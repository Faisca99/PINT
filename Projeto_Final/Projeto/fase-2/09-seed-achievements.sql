-- Seed de Achievement Definitions
-- Corre este script na BD Neon para popular as conquistas

INSERT INTO achievement_definitions (code, name, description, points_bonus, rule_config, is_active)
VALUES
  ('FIRST_BADGE',     'Primeiro Badge',          'Obtiveste o teu primeiro badge na plataforma!',            50,  '{"min_badges": 1}'::jsonb,  TRUE),
  ('BADGES_3',        'Trio de Excelência',       'Obtiveste 3 badges. Estás no bom caminho!',               100, '{"min_badges": 3}'::jsonb,  TRUE),
  ('BADGES_5',        'Colecionador',             'Já tens 5 badges. Impressionante dedicação!',             200, '{"min_badges": 5}'::jsonb,  TRUE),
  ('BADGES_10',       'Mestre dos Badges',        'Chegaste aos 10 badges. És um verdadeiro especialista!',  500, '{"min_badges": 10}'::jsonb, TRUE),
  ('POINTS_100',      'Primeiros 100 Pontos',     'Atingiste os 100 pontos na plataforma.',                  0,   '{"min_points": 100}'::jsonb, TRUE),
  ('POINTS_500',      'Acumulador',               'Chegaste aos 500 pontos. Excelente evolução!',            50,  '{"min_points": 500}'::jsonb, TRUE),
  ('POINTS_1000',     'Elite da Softinsa',        'Atingiste 1000 pontos. Estás no topo!',                  150, '{"min_points": 1000}'::jsonb,TRUE)
ON CONFLICT (code) DO NOTHING;
