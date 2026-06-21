# Fase 2 - Runbook de Execucao no Neon

## Ordem de execucao

1. Executar schema base
- ficheiro: Projeto/fase-1/04-BD_FINAL.sql

2. Executar camada de negocio da Fase 2
- ficheiro: Projeto/fase-2/02-db-camada-negocio.sql

3. Validar views e funcoes
- ficheiro: Projeto/fase-2/06-validacao-fim-a-fim.sql

## Execucao via Neon SQL Editor

- Abrir SQL Editor da base Neon
- Colar e executar cada ficheiro pela ordem acima
- Confirmar ausencia de erros e transacoes com COMMIT

## Execucao via psql (opcional)

```powershell
$env:DATABASE_URL="<postgresql_url_neon>"
psql $env:DATABASE_URL -f "Projeto/fase-1/04-BD_FINAL.sql"
psql $env:DATABASE_URL -f "Projeto/fase-2/02-db-camada-negocio.sql"
psql $env:DATABASE_URL -f "Projeto/fase-2/06-validacao-fim-a-fim.sql"
```

## Resultado esperado

- views criadas: v_consultant_badge_progress, v_public_badges, v_sla_pending_applications
- funcoes criadas: fn_submit_application, fn_approve_application, fn_reject_application, fn_user_points_balance
- triggers de updated_at ativos nas tabelas com coluna updated_at
