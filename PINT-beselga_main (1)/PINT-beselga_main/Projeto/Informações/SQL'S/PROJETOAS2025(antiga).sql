/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2017                    */
/* Created on:     03/01/2026 13:08:07                          */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('AREA') and o.name = 'FK_AREA_LINHASERV_LINHASER')
alter table AREA
   drop constraint FK_AREA_LINHASERV_LINHASER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('AVISOINFORMACAO') and o.name = 'FK_AVISOINF_UTILIZADO_UTILIZAD')
alter table AVISOINFORMACAO
   drop constraint FK_AVISOINF_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BADGE') and o.name = 'FK_BADGE_NIVEL_BAD_NIVEL')
alter table BADGE
   drop constraint FK_BADGE_NIVEL_BAD_NIVEL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BADGEUTILIZADOR') and o.name = 'FK_BADGEUTI_BADGE_BAD_BADGE')
alter table BADGEUTILIZADOR
   drop constraint FK_BADGEUTI_BADGE_BAD_BADGE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BADGEUTILIZADOR') and o.name = 'FK_BADGEUTI_CANDIDATU_CANDIDAT')
alter table BADGEUTILIZADOR
   drop constraint FK_BADGEUTI_CANDIDATU_CANDIDAT
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('BADGEUTILIZADOR') and o.name = 'FK_BADGEUTI_UTILIZADO_UTILIZAD')
alter table BADGEUTILIZADOR
   drop constraint FK_BADGEUTI_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CANDIDATURABADGE') and o.name = 'FK_CANDIDAT_BADGE_CAN_BADGE')
alter table CANDIDATURABADGE
   drop constraint FK_CANDIDAT_BADGE_CAN_BADGE
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CANDIDATURABADGE') and o.name = 'FK_CANDIDAT_UTILIZADO_UTILIZAD')
alter table CANDIDATURABADGE
   drop constraint FK_CANDIDAT_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CONFIGURACAOSLA') and o.name = 'FK_CONFIGUR_UTILIZADO_UTILIZAD')
alter table CONFIGURACAOSLA
   drop constraint FK_CONFIGUR_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('EVIDENCIACANDIDATURA') and o.name = 'FK_EVIDENCI_CANDIDATU_CANDIDAT')
alter table EVIDENCIACANDIDATURA
   drop constraint FK_EVIDENCI_CANDIDATU_CANDIDAT
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('EVIDENCIACANDIDATURA') and o.name = 'FK_EVIDENCI_REQUISITO_REQUISIT')
alter table EVIDENCIACANDIDATURA
   drop constraint FK_EVIDENCI_REQUISITO_REQUISIT
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('HISTORICOCANDIDATURA') and o.name = 'FK_HISTORIC_CANDIDATU_CANDIDAT')
alter table HISTORICOCANDIDATURA
   drop constraint FK_HISTORIC_CANDIDATU_CANDIDAT
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('HISTORICOCANDIDATURA') and o.name = 'FK_HISTORIC_UTILIZADO_UTILIZAD')
alter table HISTORICOCANDIDATURA
   drop constraint FK_HISTORIC_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('LEMBRETE') and o.name = 'FK_LEMBRETE_UTILIZADO_UTILIZAD')
alter table LEMBRETE
   drop constraint FK_LEMBRETE_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('LINHASERVICO') and o.name = 'FK_LINHASER_CAMINHOAP_CAMINHOA')
alter table LINHASERVICO
   drop constraint FK_LINHASER_CAMINHOAP_CAMINHOA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('NIVEL') and o.name = 'FK_NIVEL_AREA_NIVE_AREA')
alter table NIVEL
   drop constraint FK_NIVEL_AREA_NIVE_AREA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('NOTIFICACAO') and o.name = 'FK_NOTIFICA_UTILIZADO_UTILIZAD')
alter table NOTIFICACAO
   drop constraint FK_NOTIFICA_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('REQUISITO') and o.name = 'FK_REQUISIT_NIVEL_REQ_NIVEL')
alter table REQUISITO
   drop constraint FK_REQUISIT_NIVEL_REQ_NIVEL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('RESPONSABILIDADELINHASERVICO') and o.name = 'FK_RESPONSA_LINHASERV_LINHASER')
alter table RESPONSABILIDADELINHASERVICO
   drop constraint FK_RESPONSA_LINHASERV_LINHASER
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('RESPONSABILIDADELINHASERVICO') and o.name = 'FK_RESPONSA_UTILIZADO_UTILIZAD')
alter table RESPONSABILIDADELINHASERVICO
   drop constraint FK_RESPONSA_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('REVISAOCANDIDATURA') and o.name = 'FK_REVISAOC_CANDIDATU_CANDIDAT')
alter table REVISAOCANDIDATURA
   drop constraint FK_REVISAOC_CANDIDATU_CANDIDAT
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('REVISAOCANDIDATURA') and o.name = 'FK_REVISAOC_UTILIZADO_UTILIZAD')
alter table REVISAOCANDIDATURA
   drop constraint FK_REVISAOC_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TOKENRECUPERACAOPASS') and o.name = 'FK_TOKENREC_UTILIZADO_UTILIZAD')
alter table TOKENRECUPERACAOPASS
   drop constraint FK_TOKENREC_UTILIZADO_UTILIZAD
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TRADUCAOENTIDADE') and o.name = 'FK_TRADUCAO_IDIOMA_TR_IDIOMA')
alter table TRADUCAOENTIDADE
   drop constraint FK_TRADUCAO_IDIOMA_TR_IDIOMA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('UTILIZADOR') and o.name = 'FK_UTILIZAD_IDIOMA_UT_IDIOMA')
alter table UTILIZADOR
   drop constraint FK_UTILIZAD_IDIOMA_UT_IDIOMA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('UTILIZADOR') and o.name = 'FK_UTILIZAD_UTILIZADO_AREA')
alter table UTILIZADOR
   drop constraint FK_UTILIZAD_UTILIZADO_AREA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('UTILIZADORPERFIL') and o.name = 'FK_UTILIZAD_PERFIL_UT_PERFIL')
alter table UTILIZADORPERFIL
   drop constraint FK_UTILIZAD_PERFIL_UT_PERFIL
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('UTILIZADORPERFIL') and o.name = 'FK_UTILIZAD_UTILIZADO_UTILIZAD')
alter table UTILIZADORPERFIL
   drop constraint FK_UTILIZAD_UTILIZADO_UTILIZAD
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('AREA')
            and   name  = 'LINHASERVICO_AREA_FK'
            and   indid > 0
            and   indid < 255)
   drop index AREA.LINHASERVICO_AREA_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('AREA')
            and   type = 'U')
   drop table AREA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('AVISOINFORMACAO')
            and   name  = 'UTILIZADOR_AVISOINFORMACAO_FK'
            and   indid > 0
            and   indid < 255)
   drop index AVISOINFORMACAO.UTILIZADOR_AVISOINFORMACAO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('AVISOINFORMACAO')
            and   type = 'U')
   drop table AVISOINFORMACAO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BADGE')
            and   name  = 'UQ_BADGE_IDNIVEL'
            and   indid > 0
            and   indid < 255)
   drop index BADGE.UQ_BADGE_IDNIVEL
go

if exists (select 1
            from  sysobjects
           where  id = object_id('BADGE')
            and   type = 'U')
   drop table BADGE
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BADGEUTILIZADOR')
            and   name  = 'UQ_BADGEUTILIZADOR_IDCANDIDATURA'
            and   indid > 0
            and   indid < 255)
   drop index BADGEUTILIZADOR.UQ_BADGEUTILIZADOR_IDCANDIDATURA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BADGEUTILIZADOR')
            and   name  = 'UQ_BADGEUTILIZADOR_TOKENVERIFICACAO'
            and   indid > 0
            and   indid < 255)
   drop index BADGEUTILIZADOR.UQ_BADGEUTILIZADOR_TOKENVERIFICACAO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BADGEUTILIZADOR')
            and   name  = 'BADGE_BADGEUTILIZADOR_FK'
            and   indid > 0
            and   indid < 255)
   drop index BADGEUTILIZADOR.BADGE_BADGEUTILIZADOR_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('BADGEUTILIZADOR')
            and   name  = 'UTILIZADOR_BADGEUTILIZADOR_FK'
            and   indid > 0
            and   indid < 255)
   drop index BADGEUTILIZADOR.UTILIZADOR_BADGEUTILIZADOR_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('BADGEUTILIZADOR')
            and   type = 'U')
   drop table BADGEUTILIZADOR
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CAMINHOAPRENDIZAGEM')
            and   type = 'U')
   drop table CAMINHOAPRENDIZAGEM
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CANDIDATURABADGE')
            and   name  = 'CANDIDATURABADGE_BADGEUTILIZADOR_FK'
            and   indid > 0
            and   indid < 255)
   drop index CANDIDATURABADGE.CANDIDATURABADGE_BADGEUTILIZADOR_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CANDIDATURABADGE')
            and   name  = 'BADGE_CANDIDATURABADGE_FK'
            and   indid > 0
            and   indid < 255)
   drop index CANDIDATURABADGE.BADGE_CANDIDATURABADGE_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CANDIDATURABADGE')
            and   name  = 'UTILIZADOR_CANDIDATURABADGE_FK'
            and   indid > 0
            and   indid < 255)
   drop index CANDIDATURABADGE.UTILIZADOR_CANDIDATURABADGE_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CANDIDATURABADGE')
            and   type = 'U')
   drop table CANDIDATURABADGE
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CONFIGURACAOSLA')
            and   name  = 'UTILIZADOR_CONFIGURACAO_FK'
            and   indid > 0
            and   indid < 255)
   drop index CONFIGURACAOSLA.UTILIZADOR_CONFIGURACAO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CONFIGURACAOSLA')
            and   type = 'U')
   drop table CONFIGURACAOSLA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('EVIDENCIACANDIDATURA')
            and   name  = 'REQUISITO_EVIDENCIACANDIDATURA_FK'
            and   indid > 0
            and   indid < 255)
   drop index EVIDENCIACANDIDATURA.REQUISITO_EVIDENCIACANDIDATURA_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('EVIDENCIACANDIDATURA')
            and   name  = 'CANDIDATURA_EVIDENCIA_FK'
            and   indid > 0
            and   indid < 255)
   drop index EVIDENCIACANDIDATURA.CANDIDATURA_EVIDENCIA_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('EVIDENCIACANDIDATURA')
            and   type = 'U')
   drop table EVIDENCIACANDIDATURA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('HISTORICOCANDIDATURA')
            and   name  = 'UTILIZADOR_HISTORICOESTADOC_FK'
            and   indid > 0
            and   indid < 255)
   drop index HISTORICOCANDIDATURA.UTILIZADOR_HISTORICOESTADOC_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('HISTORICOCANDIDATURA')
            and   name  = 'CANDIDATURA_HISTORICO_FK'
            and   indid > 0
            and   indid < 255)
   drop index HISTORICOCANDIDATURA.CANDIDATURA_HISTORICO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('HISTORICOCANDIDATURA')
            and   type = 'U')
   drop table HISTORICOCANDIDATURA
go

if exists (select 1
            from  sysobjects
           where  id = object_id('IDIOMA')
            and   type = 'U')
   drop table IDIOMA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('LEMBRETE')
            and   name  = 'UTILIZADOR_LEMBRETE_FK'
            and   indid > 0
            and   indid < 255)
   drop index LEMBRETE.UTILIZADOR_LEMBRETE_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('LEMBRETE')
            and   type = 'U')
   drop table LEMBRETE
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('LINHASERVICO')
            and   name  = 'CAMINHOAPRENDIZAGEM_LINHASERVICO_FK'
            and   indid > 0
            and   indid < 255)
   drop index LINHASERVICO.CAMINHOAPRENDIZAGEM_LINHASERVICO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('LINHASERVICO')
            and   type = 'U')
   drop table LINHASERVICO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('NIVEL')
            and   name  = 'NIVEL_BADGE_FK'
            and   indid > 0
            and   indid < 255)
   drop index NIVEL.NIVEL_BADGE_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('NIVEL')
            and   name  = 'AREA_NIVEL_FK'
            and   indid > 0
            and   indid < 255)
   drop index NIVEL.AREA_NIVEL_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('NIVEL')
            and   type = 'U')
   drop table NIVEL
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('NOTIFICACAO')
            and   name  = 'UTILIZADOR_NOTIFICACAO_FK'
            and   indid > 0
            and   indid < 255)
   drop index NOTIFICACAO.UTILIZADOR_NOTIFICACAO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('NOTIFICACAO')
            and   type = 'U')
   drop table NOTIFICACAO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PERFIL')
            and   type = 'U')
   drop table PERFIL
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('REQUISITO')
            and   name  = 'NIVEL_REQUISITO_FK'
            and   indid > 0
            and   indid < 255)
   drop index REQUISITO.NIVEL_REQUISITO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('REQUISITO')
            and   type = 'U')
   drop table REQUISITO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('RESPONSABILIDADELINHASERVICO')
            and   name  = 'LINHASERVICO_RESPONSABILIDADESERVICO_FK'
            and   indid > 0
            and   indid < 255)
   drop index RESPONSABILIDADELINHASERVICO.LINHASERVICO_RESPONSABILIDADESERVICO_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('RESPONSABILIDADELINHASERVICO')
            and   name  = 'UTILIZADOR_RESPONSAIBILIDADE_FK'
            and   indid > 0
            and   indid < 255)
   drop index RESPONSABILIDADELINHASERVICO.UTILIZADOR_RESPONSAIBILIDADE_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('RESPONSABILIDADELINHASERVICO')
            and   type = 'U')
   drop table RESPONSABILIDADELINHASERVICO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('REVISAOCANDIDATURA')
            and   name  = 'UTILIZADOR_REVISAOCANDIDATURA_FK'
            and   indid > 0
            and   indid < 255)
   drop index REVISAOCANDIDATURA.UTILIZADOR_REVISAOCANDIDATURA_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('REVISAOCANDIDATURA')
            and   name  = 'CANDIDATURABADGE_REVISAOCANDIDATURA_FK'
            and   indid > 0
            and   indid < 255)
   drop index REVISAOCANDIDATURA.CANDIDATURABADGE_REVISAOCANDIDATURA_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('REVISAOCANDIDATURA')
            and   type = 'U')
   drop table REVISAOCANDIDATURA
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('TOKENRECUPERACAOPASS')
            and   name  = 'UQ_TOKENRECUPERACAOPASSWORD_TOKEN'
            and   indid > 0
            and   indid < 255)
   drop index TOKENRECUPERACAOPASS.UQ_TOKENRECUPERACAOPASSWORD_TOKEN
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('TOKENRECUPERACAOPASS')
            and   name  = 'UTILIZADOR_TOKEN_FK'
            and   indid > 0
            and   indid < 255)
   drop index TOKENRECUPERACAOPASS.UTILIZADOR_TOKEN_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TOKENRECUPERACAOPASS')
            and   type = 'U')
   drop table TOKENRECUPERACAOPASS
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('TRADUCAOENTIDADE')
            and   name  = 'IDIOMA_TRADUCAOENTIDADE_FK'
            and   indid > 0
            and   indid < 255)
   drop index TRADUCAOENTIDADE.IDIOMA_TRADUCAOENTIDADE_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TRADUCAOENTIDADE')
            and   type = 'U')
   drop table TRADUCAOENTIDADE
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('UTILIZADOR')
            and   name  = 'UQ_UTILIZADOR_EMAIL'
            and   indid > 0
            and   indid < 255)
   drop index UTILIZADOR.UQ_UTILIZADOR_EMAIL
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('UTILIZADOR')
            and   name  = 'UTILIZADOR_AREA_FK'
            and   indid > 0
            and   indid < 255)
   drop index UTILIZADOR.UTILIZADOR_AREA_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('UTILIZADOR')
            and   name  = 'IDIOMA_UTILIZADOR_FK'
            and   indid > 0
            and   indid < 255)
   drop index UTILIZADOR.IDIOMA_UTILIZADOR_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('UTILIZADOR')
            and   type = 'U')
   drop table UTILIZADOR
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('UTILIZADORPERFIL')
            and   name  = 'PERFIL_UTILIZADORP_FK'
            and   indid > 0
            and   indid < 255)
   drop index UTILIZADORPERFIL.PERFIL_UTILIZADORP_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('UTILIZADORPERFIL')
            and   name  = 'UTILIZADOR_UTILIZADORPERFIL_FK'
            and   indid > 0
            and   indid < 255)
   drop index UTILIZADORPERFIL.UTILIZADOR_UTILIZADORPERFIL_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('UTILIZADORPERFIL')
            and   type = 'U')
   drop table UTILIZADORPERFIL
go

if exists(select 1 from systypes where name='D_BOOL')
   drop type D_BOOL
go

if exists(select 1 from systypes where name='D_CODIGO_10')
   drop type D_CODIGO_10
go

if exists(select 1 from systypes where name='D_CODIGO_2')
   drop type D_CODIGO_2
go

if exists(select 1 from systypes where name='D_DATA')
   drop type D_DATA
go

if exists(select 1 from systypes where name='D_DATAHORA')
   drop type D_DATAHORA
go

if exists(select 1 from systypes where name='D_DESC_MAX')
   drop type D_DESC_MAX
go

if exists(select 1 from systypes where name='D_EMAIL')
   drop type D_EMAIL
go

if exists(select 1 from systypes where name='D_ESTADO')
   drop type D_ESTADO
go

if exists(select 1 from systypes where name='D_GUID')
   drop type D_GUID
go

if exists(select 1 from systypes where name='D_HASH_256')
   drop type D_HASH_256
go

if exists(select 1 from systypes where name='D_ID')
   drop type D_ID
go

if exists(select 1 from systypes where name='D_ID_FK')
   drop type D_ID_FK
go

if exists(select 1 from systypes where name='D_INT')
   drop type D_INT
go

if exists(select 1 from systypes where name='D_MIME_100')
   drop type D_MIME_100
go

if exists(select 1 from systypes where name='D_NOME_150')
   drop type D_NOME_150
go

if exists(select 1 from systypes where name='D_SMALLINT')
   drop type D_SMALLINT
go

if exists(select 1 from systypes where name='D_TAMANHO_FICHEIRO')
   drop type D_TAMANHO_FICHEIRO
go

if exists(select 1 from systypes where name='D_TINYINT')
   drop type D_TINYINT
go

if exists(select 1 from systypes where name='D_TITULO_200')
   drop type D_TITULO_200
go

if exists(select 1 from systypes where name='D_TOKEN_128')
   drop type D_TOKEN_128
go

if exists(select 1 from systypes where name='D_URL_500')
   drop type D_URL_500
go

/*==============================================================*/
/* Table: AREA                                                  */
/*==============================================================*/
create table AREA (
   ID_AREA              int                  identity,
   ID_LINHA_SERVICO     int                  not null,
   NOME                 varchar(30)          not null,
   DESCRICAO            text                 null,
   ATIVO                bit                  not null,
   constraint PK_AREA primary key (ID_AREA)
)
go

/*==============================================================*/
/* Index: LINHASERVICO_AREA_FK                                  */
/*==============================================================*/




create nonclustered index LINHASERVICO_AREA_FK on AREA (ID_LINHA_SERVICO ASC)
go

/*==============================================================*/
/* Table: AVISOINFORMACAO                                       */
/*==============================================================*/
create table AVISOINFORMACAO (
   ID_AVISO             int                  identity,
   ID_UTILIZADOR        int                  not null,
   TITULO               varchar(200)         not null,
   CONTEUDO             text                 not null,
   ATIVO                bit                  not null,
   DATA_INICIO          datetime             not null,
   DATA_FIM             datetime             null,
   constraint PK_AVISOINFORMACAO primary key (ID_AVISO)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_AVISOINFORMACAO_FK                         */
/*==============================================================*/




create nonclustered index UTILIZADOR_AVISOINFORMACAO_FK on AVISOINFORMACAO (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: BADGE                                                 */
/*==============================================================*/
create table BADGE (
   ID_BADGE             int                  identity,
   ID_NIVEL             int                  null,
   TIPO_BADGE           varchar(30)          not null,
   NOME                 varchar(30)          not null,
   DESCRICAO            text                 null,
   IMAGEM               varchar(500)         null,
   PONTOS               int                  null,
   TEM_EXPIRACAO        bit                  not null,
   VALIDADE_DIAS        smallint             null,
   TEM_PRAZO_OBTENCAO   bit                  not null,
   DIAS_PARA_OBTER      smallint             null,
   ATIVO                bit                  not null,
   DATA_CRIACAO         datetime             not null,
   constraint PK_BADGE primary key (ID_BADGE)
)
go

/*==============================================================*/
/* Index: UQ_BADGE_IDNIVEL                                      */
/*==============================================================*/




create unique nonclustered index UQ_BADGE_IDNIVEL on BADGE (ID_NIVEL ASC)
go

/*==============================================================*/
/* Table: BADGEUTILIZADOR                                       */
/*==============================================================*/
create table BADGEUTILIZADOR (
   ID_BADGE_UTILIZADOR  int                  identity,
   ID_UTILIZADOR        int                  not null,
   ID_BADGE             int                  not null,
   ID_CANDIDATURA       int                  null,
   DATA_ATRIBUICAO      datetime             not null,
   DATA_EXPIRACAO       datetime             null,
   PUBLICADO            bit                  not null,
   RGPD_ACEITE          bit                  not null,
   DATA_RGPD            datetime             null,
   DATA_ATRIBUICAO_PONTOS datetime             not null,
   TOKEN_VERIFICACAO    varchar(128)         not null,
   constraint PK_BADGEUTILIZADOR primary key (ID_BADGE_UTILIZADOR)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_BADGEUTILIZADOR_FK                         */
/*==============================================================*/




create nonclustered index UTILIZADOR_BADGEUTILIZADOR_FK on BADGEUTILIZADOR (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Index: BADGE_BADGEUTILIZADOR_FK                              */
/*==============================================================*/




create nonclustered index BADGE_BADGEUTILIZADOR_FK on BADGEUTILIZADOR (ID_BADGE ASC)
go

/*==============================================================*/
/* Index: UQ_BADGEUTILIZADOR_TOKENVERIFICACAO                   */
/*==============================================================*/




create unique nonclustered index UQ_BADGEUTILIZADOR_TOKENVERIFICACAO on BADGEUTILIZADOR (TOKEN_VERIFICACAO ASC)
go

/*==============================================================*/
/* Index: UQ_BADGEUTILIZADOR_IDCANDIDATURA                      */
/*==============================================================*/




create unique nonclustered index UQ_BADGEUTILIZADOR_IDCANDIDATURA on BADGEUTILIZADOR (ID_CANDIDATURA ASC)
go

/*==============================================================*/
/* Table: CAMINHOAPRENDIZAGEM                                   */
/*==============================================================*/
create table CAMINHOAPRENDIZAGEM (
   ID_CAMINHO           int                  identity,
   NOME                 varchar(30)          not null,
   DESCRICAO            text                 null,
   ATIVO                bit                  not null,
   constraint PK_CAMINHOAPRENDIZAGEM primary key (ID_CAMINHO)
)
go

/*==============================================================*/
/* Table: CANDIDATURABADGE                                      */
/*==============================================================*/
create table CANDIDATURABADGE (
   ID_CANDIDATURA       int                  not null,
   ID_UTILIZADOR        int                  not null,
   ID_BADGE             int                  not null,
   ESTADO               varchar(30)          not null,
   DATA_CRIACAO         datetime             not null,
   DATA_SUBMISSAO       datetime             null,
   PRAZO_CONCLUSAO      datetime             null,
   RESULTADO_FINAL      varchar(30)          null,
   COMENTARIO_FINAL     text                 null,
   constraint PK_CANDIDATURABADGE primary key (ID_CANDIDATURA)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_CANDIDATURABADGE_FK                        */
/*==============================================================*/




create nonclustered index UTILIZADOR_CANDIDATURABADGE_FK on CANDIDATURABADGE (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Index: BADGE_CANDIDATURABADGE_FK                             */
/*==============================================================*/




create nonclustered index BADGE_CANDIDATURABADGE_FK on CANDIDATURABADGE (ID_BADGE ASC)
go

/*==============================================================*/
/* Index: CANDIDATURABADGE_BADGEUTILIZADOR_FK                   */
/*==============================================================*/




create nonclustered index CANDIDATURABADGE_BADGEUTILIZADOR_FK on CANDIDATURABADGE (ID_CANDIDATURA ASC)
go

/*==============================================================*/
/* Table: CONFIGURACAOSLA                                       */
/*==============================================================*/
create table CONFIGURACAOSLA (
   ID_SLA               int                  identity,
   ID_UTILIZADOR        int                  not null,
   TIPO_EQUIPA          varchar(30)          not null,
   HORAS_LIMITE         smallint             not null,
   ATIVO                bit                  not null,
   constraint PK_CONFIGURACAOSLA primary key (ID_SLA)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_CONFIGURACAO_FK                            */
/*==============================================================*/




create nonclustered index UTILIZADOR_CONFIGURACAO_FK on CONFIGURACAOSLA (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: EVIDENCIACANDIDATURA                                  */
/*==============================================================*/
create table EVIDENCIACANDIDATURA (
   ID_EVIDENCIA         int                  identity,
   ID_CANDIDATURA       int                  not null,
   ID_REQUISITO         int                  not null,
   NOME_FICHEIRO        varchar(200)         not null,
   CAMINHO_URL          varchar(500)         not null,
   TIPO_MIME            varchar(100)         null,
   TAMANHO_BYES         bigint               null,
   DATA_UPLOAD          datetime             not null,
   DESCRICAO            text                 null,
   constraint PK_EVIDENCIACANDIDATURA primary key (ID_EVIDENCIA)
)
go

/*==============================================================*/
/* Index: CANDIDATURA_EVIDENCIA_FK                              */
/*==============================================================*/




create nonclustered index CANDIDATURA_EVIDENCIA_FK on EVIDENCIACANDIDATURA (ID_CANDIDATURA ASC)
go

/*==============================================================*/
/* Index: REQUISITO_EVIDENCIACANDIDATURA_FK                     */
/*==============================================================*/




create nonclustered index REQUISITO_EVIDENCIACANDIDATURA_FK on EVIDENCIACANDIDATURA (ID_REQUISITO ASC)
go

/*==============================================================*/
/* Table: HISTORICOCANDIDATURA                                  */
/*==============================================================*/
create table HISTORICOCANDIDATURA (
   ID_HISTORICO         int                  identity,
   ID_CANDIDATURA       int                  not null,
   ID_UTILIZADOR        int                  not null,
   ESTADO_ORIGEM        varchar(30)          not null,
   ESTADO_DESTINO       varchar(30)          not null,
   COMENTARIO           text                 null,
   DATA_EVENTO          datetime             not null,
   constraint PK_HISTORICOCANDIDATURA primary key (ID_HISTORICO)
)
go

/*==============================================================*/
/* Index: CANDIDATURA_HISTORICO_FK                              */
/*==============================================================*/




create nonclustered index CANDIDATURA_HISTORICO_FK on HISTORICOCANDIDATURA (ID_CANDIDATURA ASC)
go

/*==============================================================*/
/* Index: UTILIZADOR_HISTORICOESTADOC_FK                        */
/*==============================================================*/




create nonclustered index UTILIZADOR_HISTORICOESTADOC_FK on HISTORICOCANDIDATURA (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: IDIOMA                                                */
/*==============================================================*/
create table IDIOMA (
   ID_IDIOMA            int                  identity,
   CODIGO               char(2)              not null,
   NOME                 varchar(30)          not null,
   constraint PK_IDIOMA primary key (ID_IDIOMA)
)
go

/*==============================================================*/
/* Table: LEMBRETE                                              */
/*==============================================================*/
create table LEMBRETE (
   ID_LEMBRETE          int                  identity,
   ID_UTILIZADOR        int                  not null,
   MENSAGEM             text                 not null,
   DATA_AGENDADA        datetime             not null,
   ENVIADO              bit                  not null,
   constraint PK_LEMBRETE primary key (ID_LEMBRETE)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_LEMBRETE_FK                                */
/*==============================================================*/




create nonclustered index UTILIZADOR_LEMBRETE_FK on LEMBRETE (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: LINHASERVICO                                          */
/*==============================================================*/
create table LINHASERVICO (
   ID_LINHA_SERVICO     int                  identity,
   ID_CAMINHO           int                  not null,
   NOME                 varchar(30)          not null,
   DESCRICAO            text                 null,
   ATIVO                bit                  not null,
   constraint PK_LINHASERVICO primary key (ID_LINHA_SERVICO)
)
go

/*==============================================================*/
/* Index: CAMINHOAPRENDIZAGEM_LINHASERVICO_FK                   */
/*==============================================================*/




create nonclustered index CAMINHOAPRENDIZAGEM_LINHASERVICO_FK on LINHASERVICO (ID_CAMINHO ASC)
go

/*==============================================================*/
/* Table: NIVEL                                                 */
/*==============================================================*/
create table NIVEL (
   ID_NIVEL             int                  identity,
   ID_AREA              int                  not null,
   CODIGO               char(2)              not null,
   NOME                 varchar(30)          not null,
   ORDEM                tinyint              not null,
   DESCRICAO            text                 null,
   ATIVO                bit                  not null,
   constraint PK_NIVEL primary key (ID_NIVEL)
)
go

/*==============================================================*/
/* Index: AREA_NIVEL_FK                                         */
/*==============================================================*/




create nonclustered index AREA_NIVEL_FK on NIVEL (ID_AREA ASC)
go

/*==============================================================*/
/* Index: NIVEL_BADGE_FK                                        */
/*==============================================================*/




create nonclustered index NIVEL_BADGE_FK on NIVEL (ID_NIVEL ASC)
go

/*==============================================================*/
/* Table: NOTIFICACAO                                           */
/*==============================================================*/
create table NOTIFICACAO (
   ID_NOTIFICACAO       int                  not null,
   ID_UTILIZADOR        int                  not null,
   TIPO                 varchar(30)          not null,
   TITULO               varchar(200)         not null,
   MENSAGEM             text                 not null,
   ENVIADA_EM           datetime             not null,
   LIDA                 bit                  not null,
   LIDA_EM              datetime             null,
   constraint PK_NOTIFICACAO primary key (ID_NOTIFICACAO)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_NOTIFICACAO_FK                             */
/*==============================================================*/




create nonclustered index UTILIZADOR_NOTIFICACAO_FK on NOTIFICACAO (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: PERFIL                                                */
/*==============================================================*/
create table PERFIL (
   ID_PERFIL            int                  identity,
   NOME_PERFIL          varchar(30)          not null,
   constraint PK_PERFIL primary key (ID_PERFIL)
)
go

/*==============================================================*/
/* Table: REQUISITO                                             */
/*==============================================================*/
create table REQUISITO (
   ID_REQUISITO         int                  identity,
   ID_NIVEL             int                  not null,
   CODIGO               char(2)              not null,
   TITULO               varchar(200)         not null,
   DESCRICAO            text                 null,
   IMAGEM               varchar(500)         null,
   ORDEM                tinyint              not null,
   ATIVO                bit                  not null,
   constraint PK_REQUISITO primary key (ID_REQUISITO)
)
go

/*==============================================================*/
/* Index: NIVEL_REQUISITO_FK                                    */
/*==============================================================*/




create nonclustered index NIVEL_REQUISITO_FK on REQUISITO (ID_NIVEL ASC)
go

/*==============================================================*/
/* Table: RESPONSABILIDADELINHASERVICO                          */
/*==============================================================*/
create table RESPONSABILIDADELINHASERVICO (
   ID_RESP              int                  identity,
   ID_UTILIZADOR        int                  not null,
   ID_LINHA_SERVICO     int                  not null,
   constraint PK_RESPONSABILIDADELINHASERVIC primary key (ID_RESP)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_RESPONSAIBILIDADE_FK                       */
/*==============================================================*/




create nonclustered index UTILIZADOR_RESPONSAIBILIDADE_FK on RESPONSABILIDADELINHASERVICO (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Index: LINHASERVICO_RESPONSABILIDADESERVICO_FK               */
/*==============================================================*/




create nonclustered index LINHASERVICO_RESPONSABILIDADESERVICO_FK on RESPONSABILIDADELINHASERVICO (ID_LINHA_SERVICO ASC)
go

/*==============================================================*/
/* Table: REVISAOCANDIDATURA                                    */
/*==============================================================*/
create table REVISAOCANDIDATURA (
   ID_REVISAO           int                  identity,
   ID_CANDIDATURA       int                  not null,
   ID_UTILIZADOR        int                  not null,
   ID_REVISOR           int                  not null,
   TIPO_REVISOR         varchar(30)          not null,
   DECISAO              varchar(30)          not null,
   COMENTARIO           text                 null,
   DATA_DECISAO         datetime             not null,
   constraint PK_REVISAOCANDIDATURA primary key (ID_REVISAO)
)
go

/*==============================================================*/
/* Index: CANDIDATURABADGE_REVISAOCANDIDATURA_FK                */
/*==============================================================*/




create nonclustered index CANDIDATURABADGE_REVISAOCANDIDATURA_FK on REVISAOCANDIDATURA (ID_CANDIDATURA ASC)
go

/*==============================================================*/
/* Index: UTILIZADOR_REVISAOCANDIDATURA_FK                      */
/*==============================================================*/




create nonclustered index UTILIZADOR_REVISAOCANDIDATURA_FK on REVISAOCANDIDATURA (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Table: TOKENRECUPERACAOPASS                                  */
/*==============================================================*/
create table TOKENRECUPERACAOPASS (
   ID_TOKEN             int                  identity,
   ID_UTILIZADOR        int                  not null,
   TOKEN                varchar(128)         not null,
   CRIADO_EM            datetime             not null,
   EXPIRA_EM            datetime             not null,
   USADO                bit                  not null,
   constraint PK_TOKENRECUPERACAOPASS primary key (ID_TOKEN)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_TOKEN_FK                                   */
/*==============================================================*/




create nonclustered index UTILIZADOR_TOKEN_FK on TOKENRECUPERACAOPASS (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Index: UQ_TOKENRECUPERACAOPASSWORD_TOKEN                     */
/*==============================================================*/




create unique nonclustered index UQ_TOKENRECUPERACAOPASSWORD_TOKEN on TOKENRECUPERACAOPASS (TOKEN ASC)
go

/*==============================================================*/
/* Table: TRADUCAOENTIDADE                                      */
/*==============================================================*/
create table TRADUCAOENTIDADE (
   ID_TRADUCAO          int                  identity,
   ID_IDIOMA            int                  not null,
   ENTIDADE             varchar(30)          not null,
   TITULO               varchar(200)         null,
   DESCRICAO_CONTEUDO   text                 null,
   constraint PK_TRADUCAOENTIDADE primary key (ID_TRADUCAO)
)
go

/*==============================================================*/
/* Index: IDIOMA_TRADUCAOENTIDADE_FK                            */
/*==============================================================*/




create nonclustered index IDIOMA_TRADUCAOENTIDADE_FK on TRADUCAOENTIDADE (ID_IDIOMA ASC)
go

/*==============================================================*/
/* Table: UTILIZADOR                                            */
/*==============================================================*/
create table UTILIZADOR (
   ID_UTILIZADOR        int                  identity,
   ID_IDIOMA            int                  null,
   ID_AREA              int                  not null,
   NOME                 varchar(30)          not null,
   EMAIL                varchar(254)         not null,
   HASH_PASSWORD        varbinary(256)       not null,
   ESTADO_CONTA         varchar(30)          not null,
   DATA_REGISTO         datetime             not null,
   ULTIMO_LOGIN         datetime             null,
   PRIMEIRA_ALTERAR_PASSWORD bit                  not null,
   constraint PK_UTILIZADOR primary key (ID_UTILIZADOR)
)
go

/*==============================================================*/
/* Index: IDIOMA_UTILIZADOR_FK                                  */
/*==============================================================*/




create nonclustered index IDIOMA_UTILIZADOR_FK on UTILIZADOR (ID_IDIOMA ASC)
go

/*==============================================================*/
/* Index: UTILIZADOR_AREA_FK                                    */
/*==============================================================*/




create nonclustered index UTILIZADOR_AREA_FK on UTILIZADOR (ID_AREA ASC)
go

/*==============================================================*/
/* Index: UQ_UTILIZADOR_EMAIL                                   */
/*==============================================================*/




create unique nonclustered index UQ_UTILIZADOR_EMAIL on UTILIZADOR (EMAIL ASC)
go

/*==============================================================*/
/* Table: UTILIZADORPERFIL                                      */
/*==============================================================*/
create table UTILIZADORPERFIL (
   ID_UTILIZADOR_PERFIL int                  identity,
   ID_UTILIZADOR        int                  not null,
   ID_PERFIL            int                  not null,
   ATIVO                bit                  not null,
   DATA_ATRIBUICAO      datetime             not null,
   constraint PK_UTILIZADORPERFIL primary key (ID_UTILIZADOR_PERFIL)
)
go

/*==============================================================*/
/* Index: UTILIZADOR_UTILIZADORPERFIL_FK                        */
/*==============================================================*/




create nonclustered index UTILIZADOR_UTILIZADORPERFIL_FK on UTILIZADORPERFIL (ID_UTILIZADOR ASC)
go

/*==============================================================*/
/* Index: PERFIL_UTILIZADORP_FK                                 */
/*==============================================================*/




create nonclustered index PERFIL_UTILIZADORP_FK on UTILIZADORPERFIL (ID_PERFIL ASC)
go

alter table AREA
   add constraint FK_AREA_LINHASERV_LINHASER foreign key (ID_LINHA_SERVICO)
      references LINHASERVICO (ID_LINHA_SERVICO)
go

alter table AVISOINFORMACAO
   add constraint FK_AVISOINF_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table BADGE
   add constraint FK_BADGE_NIVEL_BAD_NIVEL foreign key (ID_NIVEL)
      references NIVEL (ID_NIVEL)
go

alter table BADGEUTILIZADOR
   add constraint FK_BADGEUTI_BADGE_BAD_BADGE foreign key (ID_BADGE)
      references BADGE (ID_BADGE)
go

alter table BADGEUTILIZADOR
   add constraint FK_BADGEUTI_CANDIDATU_CANDIDAT foreign key (ID_CANDIDATURA)
      references CANDIDATURABADGE (ID_CANDIDATURA)
go

alter table BADGEUTILIZADOR
   add constraint FK_BADGEUTI_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table CANDIDATURABADGE
   add constraint FK_CANDIDAT_BADGE_CAN_BADGE foreign key (ID_BADGE)
      references BADGE (ID_BADGE)
go

alter table CANDIDATURABADGE
   add constraint FK_CANDIDAT_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table CONFIGURACAOSLA
   add constraint FK_CONFIGUR_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table EVIDENCIACANDIDATURA
   add constraint FK_EVIDENCI_CANDIDATU_CANDIDAT foreign key (ID_CANDIDATURA)
      references CANDIDATURABADGE (ID_CANDIDATURA)
go

alter table EVIDENCIACANDIDATURA
   add constraint FK_EVIDENCI_REQUISITO_REQUISIT foreign key (ID_REQUISITO)
      references REQUISITO (ID_REQUISITO)
go

alter table HISTORICOCANDIDATURA
   add constraint FK_HISTORIC_CANDIDATU_CANDIDAT foreign key (ID_CANDIDATURA)
      references CANDIDATURABADGE (ID_CANDIDATURA)
go

alter table HISTORICOCANDIDATURA
   add constraint FK_HISTORIC_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table LEMBRETE
   add constraint FK_LEMBRETE_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table LINHASERVICO
   add constraint FK_LINHASER_CAMINHOAP_CAMINHOA foreign key (ID_CAMINHO)
      references CAMINHOAPRENDIZAGEM (ID_CAMINHO)
go

alter table NIVEL
   add constraint FK_NIVEL_AREA_NIVE_AREA foreign key (ID_AREA)
      references AREA (ID_AREA)
go

alter table NOTIFICACAO
   add constraint FK_NOTIFICA_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table REQUISITO
   add constraint FK_REQUISIT_NIVEL_REQ_NIVEL foreign key (ID_NIVEL)
      references NIVEL (ID_NIVEL)
go

alter table RESPONSABILIDADELINHASERVICO
   add constraint FK_RESPONSA_LINHASERV_LINHASER foreign key (ID_LINHA_SERVICO)
      references LINHASERVICO (ID_LINHA_SERVICO)
go

alter table RESPONSABILIDADELINHASERVICO
   add constraint FK_RESPONSA_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table REVISAOCANDIDATURA
   add constraint FK_REVISAOC_CANDIDATU_CANDIDAT foreign key (ID_CANDIDATURA)
      references CANDIDATURABADGE (ID_CANDIDATURA)
go

alter table REVISAOCANDIDATURA
   add constraint FK_REVISAOC_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table TOKENRECUPERACAOPASS
   add constraint FK_TOKENREC_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

alter table TRADUCAOENTIDADE
   add constraint FK_TRADUCAO_IDIOMA_TR_IDIOMA foreign key (ID_IDIOMA)
      references IDIOMA (ID_IDIOMA)
go

alter table UTILIZADOR
   add constraint FK_UTILIZAD_IDIOMA_UT_IDIOMA foreign key (ID_IDIOMA)
      references IDIOMA (ID_IDIOMA)
go

alter table UTILIZADOR
   add constraint FK_UTILIZAD_UTILIZADO_AREA foreign key (ID_AREA)
      references AREA (ID_AREA)
go

alter table UTILIZADORPERFIL
   add constraint FK_UTILIZAD_PERFIL_UT_PERFIL foreign key (ID_PERFIL)
      references PERFIL (ID_PERFIL)
go

alter table UTILIZADORPERFIL
   add constraint FK_UTILIZAD_UTILIZADO_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADOR (ID_UTILIZADOR)
go

