--
-- PostgreSQL database cluster dump
--

-- Started on 2026-05-14 15:46:04

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE cloud_admin;
ALTER ROLE cloud_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE neon_service;
ALTER ROLE neon_service WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE neon_superuser;
ALTER ROLE neon_superuser WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION BYPASSRLS;
CREATE ROLE neondb_owner;
ALTER ROLE neondb_owner WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--


--
-- Role memberships
--

GRANT neon_superuser TO neon_service WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT neon_superuser TO neondb_owner WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_create_subscription TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_monitor TO neon_superuser WITH ADMIN OPTION, INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_read_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_signal_backend TO neon_superuser WITH ADMIN OPTION, INHERIT TRUE GRANTED BY cloud_admin;
GRANT pg_write_all_data TO neon_superuser WITH INHERIT TRUE GRANTED BY cloud_admin;






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.8 (9c8634e)
-- Dumped by pg_dump version 17.5

-- Started on 2026-05-14 15:46:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2026-05-14 15:46:08

--
-- PostgreSQL database dump complete
--

--
-- Database "neondb" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.8 (9c8634e)
-- Dumped by pg_dump version 17.5

-- Started on 2026-05-14 15:46:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4140 (class 1262 OID 16391)
-- Name: neondb; Type: DATABASE; Schema: -; Owner: neondb_owner
--

CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = builtin LOCALE = 'C.UTF-8' BUILTIN_LOCALE = 'C.UTF-8';


ALTER DATABASE neondb OWNER TO neondb_owner;

\connect neondb

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 24620)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4142 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 24657)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4143 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 999 (class 1247 OID 25769)
-- Name: account_status_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.account_status_t AS ENUM (
    'pending_confirmation',
    'active',
    'inactive',
    'suspended'
);


ALTER TYPE public.account_status_t OWNER TO neondb_owner;

--
-- TOC entry 1008 (class 1247 OID 25796)
-- Name: application_result_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.application_result_t AS ENUM (
    'approved',
    'rejected'
);


ALTER TYPE public.application_result_t OWNER TO neondb_owner;

--
-- TOC entry 1005 (class 1247 OID 25786)
-- Name: application_status_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.application_status_t AS ENUM (
    'open',
    'submitted',
    'in_validation',
    'closed'
);


ALTER TYPE public.application_status_t OWNER TO neondb_owner;

--
-- TOC entry 1002 (class 1247 OID 25778)
-- Name: badge_type_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.badge_type_t AS ENUM (
    'level',
    'special',
    'premium'
);


ALTER TYPE public.badge_type_t OWNER TO neondb_owner;

--
-- TOC entry 1029 (class 1247 OID 25870)
-- Name: integration_provider_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.integration_provider_t AS ENUM (
    'teams',
    'slack',
    'webhook'
);


ALTER TYPE public.integration_provider_t OWNER TO neondb_owner;

--
-- TOC entry 1017 (class 1247 OID 25818)
-- Name: notification_type_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.notification_type_t AS ENUM (
    'application_submitted',
    'application_forwarded',
    'application_approved',
    'application_rejected',
    'application_send_back',
    'badge_awarded',
    'badge_expiring',
    'badge_expired',
    'sla_warning',
    'sla_breach',
    'reminder',
    'announcement',
    'system'
);


ALTER TYPE public.notification_type_t OWNER TO neondb_owner;

--
-- TOC entry 1020 (class 1247 OID 25846)
-- Name: points_tx_type_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.points_tx_type_t AS ENUM (
    'badge_award',
    'achievement_bonus',
    'manual_credit',
    'manual_debit'
);


ALTER TYPE public.points_tx_type_t OWNER TO neondb_owner;

--
-- TOC entry 1014 (class 1247 OID 25808)
-- Name: review_decision_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.review_decision_t AS ENUM (
    'forward',
    'send_back',
    'approve',
    'reject'
);


ALTER TYPE public.review_decision_t OWNER TO neondb_owner;

--
-- TOC entry 1011 (class 1247 OID 25802)
-- Name: reviewer_type_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.reviewer_type_t AS ENUM (
    'talent_manager',
    'service_line_leader'
);


ALTER TYPE public.reviewer_type_t OWNER TO neondb_owner;

--
-- TOC entry 1026 (class 1247 OID 25862)
-- Name: share_platform_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.share_platform_t AS ENUM (
    'linkedin',
    'email_signature',
    'other'
);


ALTER TYPE public.share_platform_t OWNER TO neondb_owner;

--
-- TOC entry 1023 (class 1247 OID 25856)
-- Name: sla_team_t; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.sla_team_t AS ENUM (
    'talent_manager',
    'service_line_leader'
);


ALTER TYPE public.sla_team_t OWNER TO neondb_owner;

--
-- TOC entry 356 (class 1255 OID 41023)
-- Name: fn_approve_application(bigint, bigint, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_approve_application(p_application_id bigint, p_reviewer_user_id bigint, p_comment text DEFAULT NULL::text) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_applicant_id BIGINT;
  v_badge_id BIGINT;
  v_status application_status_t;
  v_points INTEGER;
  v_user_badge_id BIGINT;
  v_current_balance INTEGER;
BEGIN
  SELECT applicant_user_id, badge_id, status
    INTO v_applicant_id, v_badge_id, v_status
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_status NOT IN ('submitted', 'in_validation') THEN
    RAISE EXCEPTION 'Estado invalido para aprovacao: %', v_status;
  END IF;

  SELECT points INTO v_points
  FROM badges
  WHERE id = v_badge_id;

  v_points := COALESCE(v_points, 0);

  INSERT INTO application_reviews(
    application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    'service_line_leader',
    'approve',
    p_comment,
    NOW()
  );

  UPDATE badge_applications
     SET status = 'closed',
         final_result = 'approved',
         final_comment = p_comment,
         approved_at = NOW(),
         closed_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    v_status,
    'closed',
    'approved',
    p_comment,
    NOW()
  );

  INSERT INTO user_badges(
    user_id, badge_id, source_application_id, awarded_at, points_awarded
  )
  VALUES (
    v_applicant_id, v_badge_id, p_application_id, NOW(), v_points
  )
  RETURNING id INTO v_user_badge_id;

  SELECT COALESCE(SUM(points_delta), 0)
    INTO v_current_balance
  FROM point_transactions
  WHERE user_id = v_applicant_id;

  INSERT INTO point_transactions(
    user_id,
    badge_id,
    user_badge_id,
    transaction_type,
    points_delta,
    balance_after,
    note,
    occurred_at,
    created_by
  )
  VALUES (
    v_applicant_id,
    v_badge_id,
    v_user_badge_id,
    'badge_award',
    v_points,
    v_current_balance + v_points,
    'Aprovacao da candidatura ' || p_application_id,
    NOW(),
    p_reviewer_user_id
  );

  INSERT INTO notifications(user_id, type, title, message, payload, sent_at)
  VALUES (
    v_applicant_id,
    'application_approved',
    'Badge aprovado',
    'A tua candidatura foi aprovada e o badge foi atribuido.',
    jsonb_build_object('application_id', p_application_id, 'user_badge_id', v_user_badge_id),
    NOW()
  );

  RETURN v_user_badge_id;
END;
$$;


ALTER FUNCTION public.fn_approve_application(p_application_id bigint, p_reviewer_user_id bigint, p_comment text) OWNER TO neondb_owner;

--
-- TOC entry 357 (class 1255 OID 41024)
-- Name: fn_reject_application(bigint, bigint, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_reject_application(p_application_id bigint, p_reviewer_user_id bigint, p_comment text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_status application_status_t;
  v_applicant_id BIGINT;
BEGIN
  SELECT status, applicant_user_id
    INTO v_status, v_applicant_id
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_status NOT IN ('submitted', 'in_validation') THEN
    RAISE EXCEPTION 'Estado invalido para rejeicao: %', v_status;
  END IF;

  INSERT INTO application_reviews(
    application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    CASE WHEN v_status = 'submitted' THEN 'talent_manager'::reviewer_type_t ELSE 'service_line_leader'::reviewer_type_t END,
    'reject',
    p_comment,
    NOW()
  );

  UPDATE badge_applications
     SET status = 'closed',
         final_result = 'rejected',
         final_comment = p_comment,
         closed_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at
  )
  VALUES (
    p_application_id,
    p_reviewer_user_id,
    v_status,
    'closed',
    'rejected',
    p_comment,
    NOW()
  );

  INSERT INTO notifications(user_id, type, title, message, payload, sent_at)
  VALUES (
    v_applicant_id,
    'application_rejected',
    'Candidatura rejeitada',
    COALESCE('A tua candidatura foi rejeitada. Motivo: ' || p_comment, 'A tua candidatura foi rejeitada.'),
    jsonb_build_object('application_id', p_application_id),
    NOW()
  );
END;
$$;


ALTER FUNCTION public.fn_reject_application(p_application_id bigint, p_reviewer_user_id bigint, p_comment text) OWNER TO neondb_owner;

--
-- TOC entry 355 (class 1255 OID 41022)
-- Name: fn_submit_application(bigint, bigint); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_submit_application(p_application_id bigint, p_actor_user_id bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_owner BIGINT;
  v_status application_status_t;
BEGIN
  SELECT applicant_user_id, status
    INTO v_owner, v_status
  FROM badge_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Candidatura nao encontrada: %', p_application_id;
  END IF;

  IF v_owner <> p_actor_user_id THEN
    RAISE EXCEPTION 'Apenas o dono pode submeter a candidatura';
  END IF;

  IF v_status <> 'open' THEN
    RAISE EXCEPTION 'A candidatura deve estar em estado open para submissao';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM application_evidences
    WHERE application_id = p_application_id
  ) THEN
    RAISE EXCEPTION 'A candidatura deve ter pelo menos uma evidencia antes da submissao';
  END IF;

  UPDATE badge_applications
     SET status = 'submitted',
         submitted_at = NOW()
   WHERE id = p_application_id;

  INSERT INTO application_history(
    application_id, actor_user_id, from_status, to_status, event_type, occurred_at
  )
  VALUES (
    p_application_id, p_actor_user_id, 'open', 'submitted', 'submitted', NOW()
  );
END;
$$;


ALTER FUNCTION public.fn_submit_application(p_application_id bigint, p_actor_user_id bigint) OWNER TO neondb_owner;

--
-- TOC entry 303 (class 1255 OID 41021)
-- Name: fn_user_points_balance(bigint); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.fn_user_points_balance(p_user_id bigint) RETURNS integer
    LANGUAGE sql STABLE
    AS $$
  SELECT COALESCE(SUM(points_delta), 0)
  FROM point_transactions
  WHERE user_id = p_user_id;
$$;


ALTER FUNCTION public.fn_user_points_balance(p_user_id bigint) OWNER TO neondb_owner;

--
-- TOC entry 302 (class 1255 OID 40960)
-- Name: trg_set_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.trg_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trg_set_updated_at() OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 238 (class 1259 OID 25906)
-- Name: achievement_definitions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.achievement_definitions (
    id bigint NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    image_url text,
    badge_id bigint,
    points_bonus integer DEFAULT 0 NOT NULL,
    rule_config jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT achievement_definitions_points_bonus_check CHECK ((points_bonus >= 0))
);


ALTER TABLE public.achievement_definitions OWNER TO neondb_owner;

--
-- TOC entry 237 (class 1259 OID 25905)
-- Name: achievement_definitions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.achievement_definitions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.achievement_definitions_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4144 (class 0 OID 0)
-- Dependencies: 237
-- Name: achievement_definitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.achievement_definitions_id_seq OWNED BY public.achievement_definitions.id;


--
-- TOC entry 260 (class 1259 OID 26136)
-- Name: application_evidences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.application_evidences (
    id bigint NOT NULL,
    application_id bigint NOT NULL,
    requirement_id bigint NOT NULL,
    uploaded_by_user_id bigint NOT NULL,
    file_name character varying(255) NOT NULL,
    storage_key text NOT NULL,
    file_url text NOT NULL,
    mime_type character varying(120),
    size_bytes bigint,
    description text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT application_evidences_size_bytes_check CHECK (((size_bytes IS NULL) OR (size_bytes >= 0)))
);


ALTER TABLE public.application_evidences OWNER TO neondb_owner;

--
-- TOC entry 259 (class 1259 OID 26135)
-- Name: application_evidences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.application_evidences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_evidences_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4145 (class 0 OID 0)
-- Dependencies: 259
-- Name: application_evidences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.application_evidences_id_seq OWNED BY public.application_evidences.id;


--
-- TOC entry 264 (class 1259 OID 26182)
-- Name: application_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.application_history (
    id bigint NOT NULL,
    application_id bigint NOT NULL,
    actor_user_id bigint NOT NULL,
    from_status public.application_status_t,
    to_status public.application_status_t NOT NULL,
    event_type character varying(80) NOT NULL,
    comment text,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.application_history OWNER TO neondb_owner;

--
-- TOC entry 263 (class 1259 OID 26181)
-- Name: application_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.application_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_history_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4146 (class 0 OID 0)
-- Dependencies: 263
-- Name: application_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.application_history_id_seq OWNED BY public.application_history.id;


--
-- TOC entry 262 (class 1259 OID 26162)
-- Name: application_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.application_reviews (
    id bigint NOT NULL,
    application_id bigint NOT NULL,
    reviewer_user_id bigint NOT NULL,
    reviewer_type public.reviewer_type_t NOT NULL,
    decision public.review_decision_t NOT NULL,
    comment text,
    reviewed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.application_reviews OWNER TO neondb_owner;

--
-- TOC entry 261 (class 1259 OID 26161)
-- Name: application_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.application_reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_reviews_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4147 (class 0 OID 0)
-- Dependencies: 261
-- Name: application_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.application_reviews_id_seq OWNED BY public.application_reviews.id;


--
-- TOC entry 230 (class 1259 OID 25706)
-- Name: areas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.areas (
    id bigint NOT NULL,
    service_line_id bigint NOT NULL,
    code character varying(80) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.areas OWNER TO neondb_owner;

--
-- TOC entry 229 (class 1259 OID 25705)
-- Name: areas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.areas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.areas_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4148 (class 0 OID 0)
-- Dependencies: 229
-- Name: areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.areas_id_seq OWNED BY public.areas.id;


--
-- TOC entry 298 (class 1259 OID 26554)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_log (
    id bigint NOT NULL,
    actor_id bigint,
    action character varying(100) NOT NULL,
    entity_type character varying(60) NOT NULL,
    entity_id bigint,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_log OWNER TO neondb_owner;

--
-- TOC entry 297 (class 1259 OID 26553)
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.audit_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_log_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4149 (class 0 OID 0)
-- Dependencies: 297
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- TOC entry 258 (class 1259 OID 26114)
-- Name: badge_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.badge_applications (
    id bigint NOT NULL,
    applicant_user_id bigint NOT NULL,
    badge_id bigint NOT NULL,
    status public.application_status_t DEFAULT 'open'::public.application_status_t NOT NULL,
    final_result public.application_result_t,
    final_comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    submitted_at timestamp with time zone,
    deadline_at timestamp with time zone,
    approved_at timestamp with time zone,
    closed_at timestamp with time zone,
    CONSTRAINT chk_app_result CHECK ((((status = 'closed'::public.application_status_t) AND (final_result IS NOT NULL)) OR ((status <> 'closed'::public.application_status_t) AND (final_result IS NULL))))
);


ALTER TABLE public.badge_applications OWNER TO neondb_owner;

--
-- TOC entry 257 (class 1259 OID 26113)
-- Name: badge_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.badge_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badge_applications_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4150 (class 0 OID 0)
-- Dependencies: 257
-- Name: badge_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.badge_applications_id_seq OWNED BY public.badge_applications.id;


--
-- TOC entry 294 (class 1259 OID 26522)
-- Name: badge_shares; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.badge_shares (
    id bigint NOT NULL,
    user_badge_id bigint NOT NULL,
    platform public.share_platform_t NOT NULL,
    share_url text,
    shared_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.badge_shares OWNER TO neondb_owner;

--
-- TOC entry 293 (class 1259 OID 26521)
-- Name: badge_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.badge_shares_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badge_shares_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4151 (class 0 OID 0)
-- Dependencies: 293
-- Name: badge_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.badge_shares_id_seq OWNED BY public.badge_shares.id;


--
-- TOC entry 236 (class 1259 OID 25878)
-- Name: badges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.badges (
    id bigint NOT NULL,
    level_id bigint,
    code character varying(100) NOT NULL,
    badge_type public.badge_type_t DEFAULT 'level'::public.badge_type_t NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    image_url text,
    points integer DEFAULT 0 NOT NULL,
    has_expiration boolean DEFAULT false NOT NULL,
    valid_days integer,
    has_completion_deadline boolean DEFAULT false NOT NULL,
    completion_days integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT badges_completion_days_check CHECK (((completion_days IS NULL) OR (completion_days > 0))),
    CONSTRAINT badges_points_check CHECK ((points >= 0)),
    CONSTRAINT badges_valid_days_check CHECK (((valid_days IS NULL) OR (valid_days > 0)))
);


ALTER TABLE public.badges OWNER TO neondb_owner;

--
-- TOC entry 235 (class 1259 OID 25877)
-- Name: badges_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.badges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.badges_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4152 (class 0 OID 0)
-- Dependencies: 235
-- Name: badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.badges_id_seq OWNED BY public.badges.id;


--
-- TOC entry 240 (class 1259 OID 25926)
-- Name: certificate_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.certificate_templates (
    id bigint NOT NULL,
    badge_type public.badge_type_t NOT NULL,
    name character varying(200) NOT NULL,
    template_url text NOT NULL,
    config jsonb,
    is_active boolean DEFAULT true NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.certificate_templates OWNER TO neondb_owner;

--
-- TOC entry 239 (class 1259 OID 25925)
-- Name: certificate_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.certificate_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_templates_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4153 (class 0 OID 0)
-- Dependencies: 239
-- Name: certificate_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.certificate_templates_id_seq OWNED BY public.certificate_templates.id;


--
-- TOC entry 288 (class 1259 OID 26458)
-- Name: consultant_objectives; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.consultant_objectives (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_by bigint,
    title character varying(255) NOT NULL,
    description text,
    target_badge_id bigint,
    target_date date NOT NULL,
    completed_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.consultant_objectives OWNER TO neondb_owner;

--
-- TOC entry 287 (class 1259 OID 26457)
-- Name: consultant_objectives_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.consultant_objectives_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultant_objectives_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4154 (class 0 OID 0)
-- Dependencies: 287
-- Name: consultant_objectives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.consultant_objectives_id_seq OWNED BY public.consultant_objectives.id;


--
-- TOC entry 286 (class 1259 OID 26432)
-- Name: consultant_timeline_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.consultant_timeline_events (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    event_type character varying(60) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    related_badge_id bigint,
    related_user_badge_id bigint,
    event_date date NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.consultant_timeline_events OWNER TO neondb_owner;

--
-- TOC entry 285 (class 1259 OID 26431)
-- Name: consultant_timeline_events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.consultant_timeline_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultant_timeline_events_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4155 (class 0 OID 0)
-- Dependencies: 285
-- Name: consultant_timeline_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.consultant_timeline_events_id_seq OWNED BY public.consultant_timeline_events.id;


--
-- TOC entry 278 (class 1259 OID 26348)
-- Name: email_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_templates (
    id bigint NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    subject character varying(255) NOT NULL,
    body_html text NOT NULL,
    body_text text,
    variables jsonb,
    language_id bigint,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.email_templates OWNER TO neondb_owner;

--
-- TOC entry 277 (class 1259 OID 26347)
-- Name: email_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.email_templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_templates_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4156 (class 0 OID 0)
-- Dependencies: 277
-- Name: email_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;


--
-- TOC entry 252 (class 1259 OID 26060)
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_verification_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone
);


ALTER TABLE public.email_verification_tokens OWNER TO neondb_owner;

--
-- TOC entry 251 (class 1259 OID 26059)
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.email_verification_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verification_tokens_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4157 (class 0 OID 0)
-- Dependencies: 251
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.email_verification_tokens_id_seq OWNED BY public.email_verification_tokens.id;


--
-- TOC entry 276 (class 1259 OID 26331)
-- Name: info_notices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.info_notices (
    id bigint NOT NULL,
    created_by_user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    target_roles text[],
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.info_notices OWNER TO neondb_owner;

--
-- TOC entry 275 (class 1259 OID 26330)
-- Name: info_notices_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.info_notices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.info_notices_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4158 (class 0 OID 0)
-- Dependencies: 275
-- Name: info_notices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.info_notices_id_seq OWNED BY public.info_notices.id;


--
-- TOC entry 292 (class 1259 OID 26503)
-- Name: integration_configs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.integration_configs (
    id bigint NOT NULL,
    provider public.integration_provider_t NOT NULL,
    config jsonb NOT NULL,
    event_types text[],
    is_active boolean DEFAULT false NOT NULL,
    created_by bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.integration_configs OWNER TO neondb_owner;

--
-- TOC entry 291 (class 1259 OID 26502)
-- Name: integration_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.integration_configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.integration_configs_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4159 (class 0 OID 0)
-- Dependencies: 291
-- Name: integration_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.integration_configs_id_seq OWNED BY public.integration_configs.id;


--
-- TOC entry 220 (class 1259 OID 25637)
-- Name: languages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.languages (
    id bigint NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(80) NOT NULL,
    native_name character varying(80),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.languages OWNER TO neondb_owner;

--
-- TOC entry 219 (class 1259 OID 25636)
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.languages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.languages_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4160 (class 0 OID 0)
-- Dependencies: 219
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- TOC entry 226 (class 1259 OID 25673)
-- Name: learning_paths; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.learning_paths (
    id bigint NOT NULL,
    code character varying(80) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.learning_paths OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 25672)
-- Name: learning_paths_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.learning_paths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.learning_paths_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4161 (class 0 OID 0)
-- Dependencies: 225
-- Name: learning_paths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.learning_paths_id_seq OWNED BY public.learning_paths.id;


--
-- TOC entry 232 (class 1259 OID 25725)
-- Name: levels; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.levels (
    id bigint NOT NULL,
    area_id bigint NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(120) NOT NULL,
    rank_order smallint NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT levels_rank_order_check CHECK (((rank_order >= 1) AND (rank_order <= 26)))
);


ALTER TABLE public.levels OWNER TO neondb_owner;

--
-- TOC entry 231 (class 1259 OID 25724)
-- Name: levels_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.levels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.levels_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4162 (class 0 OID 0)
-- Dependencies: 231
-- Name: levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.levels_id_seq OWNED BY public.levels.id;


--
-- TOC entry 272 (class 1259 OID 26296)
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    type public.notification_type_t NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    payload jsonb,
    is_read boolean DEFAULT false NOT NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- TOC entry 271 (class 1259 OID 26295)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4163 (class 0 OID 0)
-- Dependencies: 271
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 254 (class 1259 OID 26077)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- TOC entry 253 (class 1259 OID 26076)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4164 (class 0 OID 0)
-- Dependencies: 253
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 296 (class 1259 OID 26537)
-- Name: platform_config; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.platform_config (
    id bigint NOT NULL,
    config_key character varying(120) NOT NULL,
    config_value text,
    description text,
    updated_by_user_id bigint,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.platform_config OWNER TO neondb_owner;

--
-- TOC entry 295 (class 1259 OID 26536)
-- Name: platform_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.platform_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platform_config_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4165 (class 0 OID 0)
-- Dependencies: 295
-- Name: platform_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.platform_config_id_seq OWNED BY public.platform_config.id;


--
-- TOC entry 268 (class 1259 OID 26237)
-- Name: point_transactions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.point_transactions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    badge_id bigint,
    user_badge_id bigint,
    achievement_id bigint,
    transaction_type public.points_tx_type_t NOT NULL,
    points_delta integer NOT NULL,
    balance_after integer NOT NULL,
    note text,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by bigint
);


ALTER TABLE public.point_transactions OWNER TO neondb_owner;

--
-- TOC entry 267 (class 1259 OID 26236)
-- Name: point_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.point_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.point_transactions_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4166 (class 0 OID 0)
-- Dependencies: 267
-- Name: point_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.point_transactions_id_seq OWNED BY public.point_transactions.id;


--
-- TOC entry 256 (class 1259 OID 26094)
-- Name: push_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.push_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    device_token text NOT NULL,
    platform character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    registered_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT push_tokens_platform_check CHECK (((platform)::text = ANY ((ARRAY['ios'::character varying, 'android'::character varying])::text[])))
);


ALTER TABLE public.push_tokens OWNER TO neondb_owner;

--
-- TOC entry 255 (class 1259 OID 26093)
-- Name: push_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.push_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_tokens_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4167 (class 0 OID 0)
-- Dependencies: 255
-- Name: push_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.push_tokens_id_seq OWNED BY public.push_tokens.id;


--
-- TOC entry 274 (class 1259 OID 26312)
-- Name: reminders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reminders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_by bigint,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    related_entity character varying(60),
    related_id bigint,
    scheduled_for timestamp with time zone NOT NULL,
    sent_at timestamp with time zone,
    dismissed_at timestamp with time zone
);


ALTER TABLE public.reminders OWNER TO neondb_owner;

--
-- TOC entry 273 (class 1259 OID 26311)
-- Name: reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reminders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reminders_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4168 (class 0 OID 0)
-- Dependencies: 273
-- Name: reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reminders_id_seq OWNED BY public.reminders.id;


--
-- TOC entry 234 (class 1259 OID 25747)
-- Name: requirements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.requirements (
    id bigint NOT NULL,
    level_id bigint NOT NULL,
    code character varying(20) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    evidence_instructions text,
    image_url text,
    display_order smallint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT requirements_display_order_check CHECK ((display_order > 0))
);


ALTER TABLE public.requirements OWNER TO neondb_owner;

--
-- TOC entry 233 (class 1259 OID 25746)
-- Name: requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.requirements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requirements_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4169 (class 0 OID 0)
-- Dependencies: 233
-- Name: requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.requirements_id_seq OWNED BY public.requirements.id;


--
-- TOC entry 224 (class 1259 OID 25660)
-- Name: rgpd_policies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rgpd_policies (
    id bigint NOT NULL,
    version character varying(20) NOT NULL,
    content text NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    effective_from date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rgpd_policies OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 25659)
-- Name: rgpd_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rgpd_policies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rgpd_policies_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4170 (class 0 OID 0)
-- Dependencies: 223
-- Name: rgpd_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rgpd_policies_id_seq OWNED BY public.rgpd_policies.id;


--
-- TOC entry 222 (class 1259 OID 25648)
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    code character varying(60) NOT NULL,
    name character varying(120) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- TOC entry 221 (class 1259 OID 25647)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4171 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 246 (class 1259 OID 25995)
-- Name: service_line_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_line_assignments (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    service_line_id bigint NOT NULL,
    assigned_by bigint,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.service_line_assignments OWNER TO neondb_owner;

--
-- TOC entry 245 (class 1259 OID 25994)
-- Name: service_line_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_line_assignments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_line_assignments_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4172 (class 0 OID 0)
-- Dependencies: 245
-- Name: service_line_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_line_assignments_id_seq OWNED BY public.service_line_assignments.id;


--
-- TOC entry 228 (class 1259 OID 25687)
-- Name: service_lines; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_lines (
    id bigint NOT NULL,
    learning_path_id bigint NOT NULL,
    code character varying(80) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.service_lines OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 25686)
-- Name: service_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.service_lines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_lines_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4173 (class 0 OID 0)
-- Dependencies: 227
-- Name: service_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.service_lines_id_seq OWNED BY public.service_lines.id;


--
-- TOC entry 284 (class 1259 OID 26408)
-- Name: sla_breach_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sla_breach_logs (
    id bigint NOT NULL,
    application_id bigint NOT NULL,
    sla_policy_id bigint NOT NULL,
    responsible_user_id bigint,
    breach_type character varying(20) NOT NULL,
    hours_elapsed numeric(8,2) NOT NULL,
    notified_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sla_breach_logs_breach_type_check CHECK (((breach_type)::text = ANY ((ARRAY['warning'::character varying, 'breach'::character varying])::text[])))
);


ALTER TABLE public.sla_breach_logs OWNER TO neondb_owner;

--
-- TOC entry 283 (class 1259 OID 26407)
-- Name: sla_breach_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sla_breach_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sla_breach_logs_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4174 (class 0 OID 0)
-- Dependencies: 283
-- Name: sla_breach_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sla_breach_logs_id_seq OWNED BY public.sla_breach_logs.id;


--
-- TOC entry 282 (class 1259 OID 26388)
-- Name: sla_policies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sla_policies (
    id bigint NOT NULL,
    created_by_user_id bigint NOT NULL,
    team_type public.sla_team_t NOT NULL,
    limit_hours integer NOT NULL,
    warning_at_percent smallint DEFAULT 80 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sla_policies_limit_hours_check CHECK ((limit_hours > 0)),
    CONSTRAINT sla_policies_warning_at_percent_check CHECK (((warning_at_percent >= 1) AND (warning_at_percent <= 99)))
);


ALTER TABLE public.sla_policies OWNER TO neondb_owner;

--
-- TOC entry 281 (class 1259 OID 26387)
-- Name: sla_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sla_policies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sla_policies_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4175 (class 0 OID 0)
-- Dependencies: 281
-- Name: sla_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sla_policies_id_seq OWNED BY public.sla_policies.id;


--
-- TOC entry 290 (class 1259 OID 26485)
-- Name: translations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.translations (
    id bigint NOT NULL,
    language_id bigint NOT NULL,
    entity_type character varying(60) NOT NULL,
    entity_id bigint NOT NULL,
    field_name character varying(60) NOT NULL,
    translated_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.translations OWNER TO neondb_owner;

--
-- TOC entry 289 (class 1259 OID 26484)
-- Name: translations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.translations_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4176 (class 0 OID 0)
-- Dependencies: 289
-- Name: translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.translations_id_seq OWNED BY public.translations.id;


--
-- TOC entry 270 (class 1259 OID 26272)
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_achievements (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    achievement_definition_id bigint NOT NULL,
    trigger_context jsonb,
    celebrated boolean DEFAULT false NOT NULL,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_achievements OWNER TO neondb_owner;

--
-- TOC entry 269 (class 1259 OID 26271)
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_achievements_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4177 (class 0 OID 0)
-- Dependencies: 269
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- TOC entry 266 (class 1259 OID 26202)
-- Name: user_badges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_badges (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    badge_id bigint NOT NULL,
    source_application_id bigint,
    awarded_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    is_published boolean DEFAULT false NOT NULL,
    rgpd_accepted boolean DEFAULT false NOT NULL,
    rgpd_accepted_at timestamp with time zone,
    points_awarded integer DEFAULT 0 NOT NULL,
    public_token character varying(128) DEFAULT encode(public.gen_random_bytes(24), 'hex'::text) NOT NULL,
    linkedin_shared_at timestamp with time zone,
    certificate_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_badges_points_awarded_check CHECK ((points_awarded >= 0))
);


ALTER TABLE public.user_badges OWNER TO neondb_owner;

--
-- TOC entry 265 (class 1259 OID 26201)
-- Name: user_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_badges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_badges_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4178 (class 0 OID 0)
-- Dependencies: 265
-- Name: user_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_badges_id_seq OWNED BY public.user_badges.id;


--
-- TOC entry 280 (class 1259 OID 26367)
-- Name: user_email_signatures; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_email_signatures (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    include_badges boolean DEFAULT false NOT NULL,
    max_badges_shown smallint DEFAULT 3 NOT NULL,
    show_only_published boolean DEFAULT true NOT NULL,
    custom_template text,
    generated_html text,
    last_generated_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_email_signatures_max_badges_shown_check CHECK (((max_badges_shown >= 1) AND (max_badges_shown <= 10)))
);


ALTER TABLE public.user_email_signatures OWNER TO neondb_owner;

--
-- TOC entry 279 (class 1259 OID 26366)
-- Name: user_email_signatures_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_email_signatures_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_email_signatures_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4179 (class 0 OID 0)
-- Dependencies: 279
-- Name: user_email_signatures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_email_signatures_id_seq OWNED BY public.user_email_signatures.id;


--
-- TOC entry 248 (class 1259 OID 26020)
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_preferences (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    remember_login boolean DEFAULT false NOT NULL,
    badge_public_by_default boolean DEFAULT false NOT NULL,
    email_notifications_enabled boolean DEFAULT true NOT NULL,
    push_notifications_enabled boolean DEFAULT true NOT NULL,
    linkedin_profile_url text,
    softinsa_profile_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_preferences OWNER TO neondb_owner;

--
-- TOC entry 247 (class 1259 OID 26019)
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_preferences_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4180 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- TOC entry 244 (class 1259 OID 25969)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    assigned_by bigint,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- TOC entry 243 (class 1259 OID 25968)
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4181 (class 0 OID 0)
-- Dependencies: 243
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- TOC entry 250 (class 1259 OID 26042)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_sessions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    refresh_token text NOT NULL,
    user_agent text,
    ip_address inet,
    device_info jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone
);


ALTER TABLE public.user_sessions OWNER TO neondb_owner;

--
-- TOC entry 249 (class 1259 OID 26041)
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_sessions_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4182 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_sessions_id_seq OWNED BY public.user_sessions.id;


--
-- TOC entry 242 (class 1259 OID 25938)
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    language_id bigint,
    preferred_area_id bigint,
    full_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash text NOT NULL,
    account_status public.account_status_t DEFAULT 'pending_confirmation'::public.account_status_t NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    must_change_password boolean DEFAULT true NOT NULL,
    accepted_rgpd_at timestamp with time zone,
    rgpd_policy_id bigint,
    first_login_at timestamp with time zone,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- TOC entry 241 (class 1259 OID 25937)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- TOC entry 4183 (class 0 OID 0)
-- Dependencies: 241
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 299 (class 1259 OID 41006)
-- Name: v_consultant_badge_progress; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.v_consultant_badge_progress AS
 SELECT u.id AS user_id,
    u.full_name,
    u.email,
    count(DISTINCT ub.id) AS badges_obtidos,
    count(DISTINCT ba.id) FILTER (WHERE (ba.status = 'open'::public.application_status_t)) AS candidaturas_abertas,
    count(DISTINCT ba.id) FILTER (WHERE (ba.status = 'submitted'::public.application_status_t)) AS candidaturas_submetidas,
    count(DISTINCT ba.id) FILTER (WHERE (ba.status = 'in_validation'::public.application_status_t)) AS candidaturas_em_validacao,
    count(DISTINCT ba.id) FILTER (WHERE ((ba.status = 'closed'::public.application_status_t) AND (ba.final_result = 'approved'::public.application_result_t))) AS candidaturas_aprovadas,
    count(DISTINCT ba.id) FILTER (WHERE ((ba.status = 'closed'::public.application_status_t) AND (ba.final_result = 'rejected'::public.application_result_t))) AS candidaturas_rejeitadas,
    COALESCE(sum(pt.points_delta), (0)::bigint) AS pontos_totais
   FROM (((public.users u
     LEFT JOIN public.user_badges ub ON ((ub.user_id = u.id)))
     LEFT JOIN public.badge_applications ba ON ((ba.applicant_user_id = u.id)))
     LEFT JOIN public.point_transactions pt ON ((pt.user_id = u.id)))
  GROUP BY u.id, u.full_name, u.email;


ALTER VIEW public.v_consultant_badge_progress OWNER TO neondb_owner;

--
-- TOC entry 300 (class 1259 OID 41011)
-- Name: v_public_badges; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.v_public_badges AS
 SELECT ub.public_token,
    ub.awarded_at,
    ub.expires_at,
    u.id AS user_id,
    u.full_name,
    b.id AS badge_id,
    b.code AS badge_code,
    b.name AS badge_name,
    b.badge_type,
    b.image_url AS badge_image_url,
    l.code AS level_code,
    l.name AS level_name,
    a.name AS area_name,
    sl.name AS service_line_name,
    lp.name AS learning_path_name
   FROM ((((((public.user_badges ub
     JOIN public.users u ON ((u.id = ub.user_id)))
     JOIN public.badges b ON ((b.id = ub.badge_id)))
     LEFT JOIN public.levels l ON ((l.id = b.level_id)))
     LEFT JOIN public.areas a ON ((a.id = l.area_id)))
     LEFT JOIN public.service_lines sl ON ((sl.id = a.service_line_id)))
     LEFT JOIN public.learning_paths lp ON ((lp.id = sl.learning_path_id)))
  WHERE ((ub.is_published = true) AND (ub.rgpd_accepted = true));


ALTER VIEW public.v_public_badges OWNER TO neondb_owner;

--
-- TOC entry 301 (class 1259 OID 41016)
-- Name: v_sla_pending_applications; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.v_sla_pending_applications AS
 SELECT ba.id AS application_id,
    ba.status,
    ba.submitted_at,
    sp.team_type,
    sp.limit_hours,
    round((EXTRACT(epoch FROM (now() - ba.submitted_at)) / 3600.0), 2) AS elapsed_hours,
    round((((EXTRACT(epoch FROM (now() - ba.submitted_at)) / 3600.0) * 100.0) / (sp.limit_hours)::numeric), 2) AS elapsed_percent
   FROM (public.badge_applications ba
     JOIN public.sla_policies sp ON ((sp.is_active = true)))
  WHERE ((ba.status = ANY (ARRAY['submitted'::public.application_status_t, 'in_validation'::public.application_status_t])) AND (ba.submitted_at IS NOT NULL));


ALTER VIEW public.v_sla_pending_applications OWNER TO neondb_owner;

--
-- TOC entry 3535 (class 2604 OID 25909)
-- Name: achievement_definitions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievement_definitions ALTER COLUMN id SET DEFAULT nextval('public.achievement_definitions_id_seq'::regclass);


--
-- TOC entry 3575 (class 2604 OID 26139)
-- Name: application_evidences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_evidences ALTER COLUMN id SET DEFAULT nextval('public.application_evidences_id_seq'::regclass);


--
-- TOC entry 3579 (class 2604 OID 26185)
-- Name: application_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_history ALTER COLUMN id SET DEFAULT nextval('public.application_history_id_seq'::regclass);


--
-- TOC entry 3577 (class 2604 OID 26165)
-- Name: application_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_reviews ALTER COLUMN id SET DEFAULT nextval('public.application_reviews_id_seq'::regclass);


--
-- TOC entry 3515 (class 2604 OID 25709)
-- Name: areas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.areas ALTER COLUMN id SET DEFAULT nextval('public.areas_id_seq'::regclass);


--
-- TOC entry 3635 (class 2604 OID 26557)
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- TOC entry 3572 (class 2604 OID 26117)
-- Name: badge_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_applications ALTER COLUMN id SET DEFAULT nextval('public.badge_applications_id_seq'::regclass);


--
-- TOC entry 3631 (class 2604 OID 26525)
-- Name: badge_shares id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_shares ALTER COLUMN id SET DEFAULT nextval('public.badge_shares_id_seq'::regclass);


--
-- TOC entry 3527 (class 2604 OID 25881)
-- Name: badges id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badges ALTER COLUMN id SET DEFAULT nextval('public.badges_id_seq'::regclass);


--
-- TOC entry 3539 (class 2604 OID 25929)
-- Name: certificate_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certificate_templates ALTER COLUMN id SET DEFAULT nextval('public.certificate_templates_id_seq'::regclass);


--
-- TOC entry 3620 (class 2604 OID 26461)
-- Name: consultant_objectives id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_objectives ALTER COLUMN id SET DEFAULT nextval('public.consultant_objectives_id_seq'::regclass);


--
-- TOC entry 3617 (class 2604 OID 26435)
-- Name: consultant_timeline_events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_timeline_events ALTER COLUMN id SET DEFAULT nextval('public.consultant_timeline_events_id_seq'::regclass);


--
-- TOC entry 3601 (class 2604 OID 26351)
-- Name: email_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);


--
-- TOC entry 3564 (class 2604 OID 26063)
-- Name: email_verification_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.email_verification_tokens_id_seq'::regclass);


--
-- TOC entry 3597 (class 2604 OID 26334)
-- Name: info_notices id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.info_notices ALTER COLUMN id SET DEFAULT nextval('public.info_notices_id_seq'::regclass);


--
-- TOC entry 3627 (class 2604 OID 26506)
-- Name: integration_configs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.integration_configs ALTER COLUMN id SET DEFAULT nextval('public.integration_configs_id_seq'::regclass);


--
-- TOC entry 3499 (class 2604 OID 25640)
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- TOC entry 3507 (class 2604 OID 25676)
-- Name: learning_paths id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.learning_paths ALTER COLUMN id SET DEFAULT nextval('public.learning_paths_id_seq'::regclass);


--
-- TOC entry 3519 (class 2604 OID 25728)
-- Name: levels id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.levels ALTER COLUMN id SET DEFAULT nextval('public.levels_id_seq'::regclass);


--
-- TOC entry 3593 (class 2604 OID 26299)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3566 (class 2604 OID 26080)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 3633 (class 2604 OID 26540)
-- Name: platform_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_config ALTER COLUMN id SET DEFAULT nextval('public.platform_config_id_seq'::regclass);


--
-- TOC entry 3588 (class 2604 OID 26240)
-- Name: point_transactions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions ALTER COLUMN id SET DEFAULT nextval('public.point_transactions_id_seq'::regclass);


--
-- TOC entry 3568 (class 2604 OID 26097)
-- Name: push_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_tokens ALTER COLUMN id SET DEFAULT nextval('public.push_tokens_id_seq'::regclass);


--
-- TOC entry 3596 (class 2604 OID 26315)
-- Name: reminders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reminders ALTER COLUMN id SET DEFAULT nextval('public.reminders_id_seq'::regclass);


--
-- TOC entry 3523 (class 2604 OID 25750)
-- Name: requirements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requirements ALTER COLUMN id SET DEFAULT nextval('public.requirements_id_seq'::regclass);


--
-- TOC entry 3504 (class 2604 OID 25663)
-- Name: rgpd_policies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rgpd_policies ALTER COLUMN id SET DEFAULT nextval('public.rgpd_policies_id_seq'::regclass);


--
-- TOC entry 3502 (class 2604 OID 25651)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 3552 (class 2604 OID 25998)
-- Name: service_line_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments ALTER COLUMN id SET DEFAULT nextval('public.service_line_assignments_id_seq'::regclass);


--
-- TOC entry 3511 (class 2604 OID 25690)
-- Name: service_lines id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_lines ALTER COLUMN id SET DEFAULT nextval('public.service_lines_id_seq'::regclass);


--
-- TOC entry 3615 (class 2604 OID 26411)
-- Name: sla_breach_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_breach_logs ALTER COLUMN id SET DEFAULT nextval('public.sla_breach_logs_id_seq'::regclass);


--
-- TOC entry 3610 (class 2604 OID 26391)
-- Name: sla_policies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_policies ALTER COLUMN id SET DEFAULT nextval('public.sla_policies_id_seq'::regclass);


--
-- TOC entry 3624 (class 2604 OID 26488)
-- Name: translations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations ALTER COLUMN id SET DEFAULT nextval('public.translations_id_seq'::regclass);


--
-- TOC entry 3590 (class 2604 OID 26275)
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- TOC entry 3581 (class 2604 OID 26205)
-- Name: user_badges id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges ALTER COLUMN id SET DEFAULT nextval('public.user_badges_id_seq'::regclass);


--
-- TOC entry 3605 (class 2604 OID 26370)
-- Name: user_email_signatures id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_email_signatures ALTER COLUMN id SET DEFAULT nextval('public.user_email_signatures_id_seq'::regclass);


--
-- TOC entry 3554 (class 2604 OID 26023)
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- TOC entry 3549 (class 2604 OID 25972)
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- TOC entry 3561 (class 2604 OID 26045)
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions ALTER COLUMN id SET DEFAULT nextval('public.user_sessions_id_seq'::regclass);


--
-- TOC entry 3543 (class 2604 OID 25941)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4074 (class 0 OID 25906)
-- Dependencies: 238
-- Data for Name: achievement_definitions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.achievement_definitions (id, code, name, description, image_url, badge_id, points_bonus, rule_config, is_active, created_at) FROM stdin;
1	first_badge	Primeiro Badge	Obteve o seu primeiro badge na plataforma	\N	\N	50	{"type": "badge_count", "threshold": 1}	t	2026-03-16 16:42:03.421316+00
2	junior_certified	Júnior Certificado	Obteve o badge de nível Júnior numa área	\N	\N	30	{"type": "level_code", "level_code": "A"}	t	2026-03-16 16:42:03.421316+00
3	senior_certified	Sénior Certificado	Obteve o badge de nível Sénior numa área	\N	\N	80	{"type": "level_code", "level_code": "C"}	t	2026-03-16 16:42:03.421316+00
4	expert_certified	Especialista	Obteve o badge de nível Especialista numa área	\N	\N	150	{"type": "level_code", "level_code": "D"}	t	2026-03-16 16:42:03.421316+00
5	knowledge_leader	Líder de Conhecimento	Obteve o badge de nível Líder de Conhecimento numa área	\N	\N	300	{"type": "level_code", "level_code": "E"}	t	2026-03-16 16:42:03.421316+00
6	5_badges	Colecionador	Obteve 5 badges na plataforma	\N	\N	100	{"type": "badge_count", "threshold": 5}	t	2026-03-16 16:42:03.421316+00
7	10_badges	Destaque	Obteve 10 badges na plataforma	\N	\N	200	{"type": "badge_count", "threshold": 10}	t	2026-03-16 16:42:03.421316+00
8	all_levels_area	Mestre da Área	Completou todos os 5 níveis numa mesma área	\N	\N	500	{"type": "all_levels_area"}	t	2026-03-16 16:42:03.421316+00
9	speed_badge	Velocista	Obteve um badge em menos de 30 dias após candidatura	\N	\N	80	{"days": 30, "type": "badge_within_days"}	t	2026-03-16 16:42:03.421316+00
10	top_year	Top Performer do Ano	Obteve 10 ou mais badges num período de 365 dias	\N	\N	300	{"type": "badge_count_period", "threshold": 10, "period_days": 365}	t	2026-03-16 16:42:03.421316+00
11	paid_certification	Certificação Paga	Completou uma certificação externa paga ou badge premium	\N	\N	150	{"type": "badge_type", "badge_type": "premium"}	t	2026-03-16 16:42:03.421316+00
12	multi_area	Polivalente	Obteve badges em 3 áreas diferentes	\N	\N	200	{"type": "distinct_areas", "threshold": 3}	t	2026-03-16 16:42:03.421316+00
\.


--
-- TOC entry 4096 (class 0 OID 26136)
-- Dependencies: 260
-- Data for Name: application_evidences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.application_evidences (id, application_id, requirement_id, uploaded_by_user_id, file_name, storage_key, file_url, mime_type, size_bytes, description, uploaded_at) FROM stdin;
1	2	1	2	evidencia.pdf	aplicacoes/2/1/evidencia	2342	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:17:24.816416+00
2	2	2	2	evidencia.pdf	aplicacoes/2/2/evidencia	23423	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:17:28.08195+00
3	3	1	2	evidencia.pdf	aplicacoes/3/1/evidencia	234	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:17:40.662501+00
4	3	2	2	evidencia.pdf	aplicacoes/3/2/evidencia	234	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:17:42.426211+00
5	4	6	2	evidencia.pdf	aplicacoes/4/6/evidencia	3534	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:32:35.727785+00
6	4	5	2	evidencia.pdf	aplicacoes/4/5/evidencia	3453	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:32:36.153186+00
\.


--
-- TOC entry 4100 (class 0 OID 26182)
-- Dependencies: 264
-- Data for Name: application_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.application_history (id, application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at) FROM stdin;
1	3	2	open	submitted	submitted	\N	2026-05-14 14:17:46.350263+00
2	4	2	open	submitted	submitted	\N	2026-05-14 14:32:39.636976+00
\.


--
-- TOC entry 4098 (class 0 OID 26162)
-- Dependencies: 262
-- Data for Name: application_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.application_reviews (id, application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at) FROM stdin;
\.


--
-- TOC entry 4066 (class 0 OID 25706)
-- Dependencies: 230
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.areas (id, service_line_id, code, name, description, image_url, is_active, created_at, updated_at) FROM stdin;
1	2	LC	LowCode	\N	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
2	3	DSO	DevSecOps & IT Automation	\N	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
\.


--
-- TOC entry 4134 (class 0 OID 26554)
-- Dependencies: 298
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_log (id, actor_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, occurred_at) FROM stdin;
\.


--
-- TOC entry 4094 (class 0 OID 26114)
-- Dependencies: 258
-- Data for Name: badge_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.badge_applications (id, applicant_user_id, badge_id, status, final_result, final_comment, created_at, submitted_at, deadline_at, approved_at, closed_at) FROM stdin;
2	2	1	open	\N	\N	2026-05-14 14:17:15.783576+00	\N	\N	\N	\N
3	2	1	submitted	\N	\N	2026-05-14 14:17:38.363115+00	2026-05-14 14:17:46.350263+00	\N	\N	\N
4	2	3	submitted	\N	\N	2026-05-14 14:32:31.499503+00	2026-05-14 14:32:39.636976+00	\N	\N	\N
\.


--
-- TOC entry 4130 (class 0 OID 26522)
-- Dependencies: 294
-- Data for Name: badge_shares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.badge_shares (id, user_badge_id, platform, share_url, shared_at) FROM stdin;
\.


--
-- TOC entry 4072 (class 0 OID 25878)
-- Dependencies: 236
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.badges (id, level_id, code, badge_type, name, description, image_url, points, has_expiration, valid_days, has_completion_deadline, completion_days, is_active, created_at, updated_at) FROM stdin;
1	1	BDG-LC-A	level	Bronze - LowCode	Certificação base nas ferramentas LowCode da Softinsa	\N	50	f	\N	f	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
2	2	BDG-LC-B	level	Prata - LowCode	Desenvolvimento autónomo e independência de documentação básica	\N	100	f	\N	f	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
3	3	BDG-LC-C	level	Ouro - LowCode	Arquitetura e desenvolvimento Master	\N	250	f	\N	f	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
4	4	BDG-DSO-B	level	Prata - DevOps	Implementação de pipelines de CI/CD	\N	100	f	\N	f	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
\.


--
-- TOC entry 4076 (class 0 OID 25926)
-- Dependencies: 240
-- Data for Name: certificate_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.certificate_templates (id, badge_type, name, template_url, config, is_active, is_default, created_at) FROM stdin;
\.


--
-- TOC entry 4124 (class 0 OID 26458)
-- Dependencies: 288
-- Data for Name: consultant_objectives; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.consultant_objectives (id, user_id, created_by, title, description, target_badge_id, target_date, completed_at, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4122 (class 0 OID 26432)
-- Dependencies: 286
-- Data for Name: consultant_timeline_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.consultant_timeline_events (id, user_id, event_type, title, description, related_badge_id, related_user_badge_id, event_date, is_public, created_at) FROM stdin;
\.


--
-- TOC entry 4114 (class 0 OID 26348)
-- Dependencies: 278
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_templates (id, code, name, subject, body_html, body_text, variables, language_id, is_active, created_at, updated_at) FROM stdin;
1	registration_confirm	Confirmação de Registo	Bem-vindo à Softinsa Badges — Confirme o seu email	<p>Olá <strong>{{full_name}}</strong>,</p><p>Obrigado por se registar na plataforma Softinsa Badges.</p><p>Por favor confirme o seu email clicando <a href="{{verification_url}}">aqui</a>.</p><p>O link expira em 24 horas.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
2	password_reset	Recuperação de Password	Softinsa Badges — Recuperação de password	<p>Olá <strong>{{full_name}}</strong>,</p><p>Recebemos um pedido de recuperação de password.</p><p>Clique <a href="{{reset_url}}">aqui</a> para redefinir a sua password.</p><p>O link expira em 1 hora.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
3	application_submitted	Candidatura Recebida	A sua candidatura ao badge {{badge_name}} foi recebida	<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi recebida com sucesso e encontra-se agora em análise.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
4	application_forwarded	Candidatura Enviada para Validação Final	A sua candidatura ao badge {{badge_name}} avançou para validação final	<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi validada pelo Talent Manager e encontra-se agora em validação final pelo Service Line Leader.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
5	application_approved	Badge Aprovado! 🎉	Parabéns! O seu badge {{badge_name}} foi aprovado	<p>Olá <strong>{{full_name}}</strong>,</p><p>Parabéns! O seu badge <strong>{{badge_name}}</strong> foi aprovado.</p><p>Aceda à plataforma para publicar e partilhar a sua conquista.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
6	application_rejected	Candidatura Rejeitada	Informação sobre a sua candidatura ao badge {{badge_name}}	<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> não foi aprovada.</p><p>Motivo: {{reason}}</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
7	application_send_back	Candidatura Devolvida para Revisão	A sua candidatura ao badge {{badge_name}} requer revisão	<p>Olá <strong>{{full_name}}</strong>,</p><p>A sua candidatura ao badge <strong>{{badge_name}}</strong> foi devolvida para revisão.</p><p>Comentário: {{comment}}</p><p>Aceda à plataforma para efectuar as correcções necessárias.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
8	badge_expiring_soon	Badge a Expirar em Breve	O seu badge {{badge_name}} expira em {{days_remaining}} dias	<p>Olá <strong>{{full_name}}</strong>,</p><p>O seu badge <strong>{{badge_name}}</strong> expira a <strong>{{expiry_date}}</strong>.</p><p>Renove a sua certificação para manter o badge activo.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
9	sla_warning	Aviso de SLA — Candidatura Pendente	Candidatura #{{application_id}} pendente há {{hours}} horas	<p>Existe uma candidatura pendente de revisão há <strong>{{hours}} horas</strong>.</p><p>Candidatura: <strong>#{{application_id}}</strong> — Badge: <strong>{{badge_name}}</strong></p><p>Por favor proceda à revisão para evitar violação de SLA.</p>	\N	\N	1	t	2026-03-16 16:42:03.478086+00	2026-03-16 16:42:03.478086+00
\.


--
-- TOC entry 4088 (class 0 OID 26060)
-- Dependencies: 252
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_verification_tokens (id, user_id, token, created_at, expires_at, used_at) FROM stdin;
\.


--
-- TOC entry 4112 (class 0 OID 26331)
-- Dependencies: 276
-- Data for Name: info_notices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.info_notices (id, created_by_user_id, title, content, target_roles, is_active, starts_at, ends_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4128 (class 0 OID 26503)
-- Dependencies: 292
-- Data for Name: integration_configs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.integration_configs (id, provider, config, event_types, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4056 (class 0 OID 25637)
-- Dependencies: 220
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.languages (id, code, name, native_name, is_active, created_at) FROM stdin;
1	pt	Portuguese	Português	t	2026-03-16 16:42:02.944205+00
2	en	English	English	t	2026-03-16 16:42:02.944205+00
3	es	Spanish	Español	t	2026-03-16 16:42:02.944205+00
\.


--
-- TOC entry 4062 (class 0 OID 25673)
-- Dependencies: 226
-- Data for Name: learning_paths; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.learning_paths (id, code, name, description, image_url, is_active, created_at, updated_at) FROM stdin;
1	jornada-tecnica	Jornada Técnica	Learning path técnico principal da Softinsa — em desenvolvimento	\N	t	2026-03-16 16:42:03.316521+00	2026-03-16 16:42:03.316521+00
2	power-skills	Power Skills	Competências transversais e soft skills — suportado na BD, desenvolvimento futuro	\N	t	2026-03-16 16:42:03.316521+00	2026-03-16 16:42:03.316521+00
7	JT	Jornada Técnica	Jornada técnica principal	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
\.


--
-- TOC entry 4068 (class 0 OID 25725)
-- Dependencies: 232
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.levels (id, area_id, code, name, rank_order, description, is_active, created_at, updated_at) FROM stdin;
1	1	A	Júnior	1	Aprendizagem inicial em contexto de trabalho	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
2	1	B	Intermédio	2	Execução autónoma de tarefas	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
3	1	C	Sénior	3	Domínio avançado e mentoria	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
4	2	B	Intermédio	2	Execução autónoma em pipelines	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
\.


--
-- TOC entry 4108 (class 0 OID 26296)
-- Dependencies: 272
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, type, title, message, payload, is_read, sent_at, read_at) FROM stdin;
\.


--
-- TOC entry 4090 (class 0 OID 26077)
-- Dependencies: 254
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (id, user_id, token, created_at, expires_at, used_at) FROM stdin;
\.


--
-- TOC entry 4132 (class 0 OID 26537)
-- Dependencies: 296
-- Data for Name: platform_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.platform_config (id, config_key, config_value, description, updated_by_user_id, updated_at) FROM stdin;
1	softinsa_website_url	https://www.softinsa.pt	URL do website Softinsa para integração pública (req 28)	\N	2026-03-16 16:42:03.367917+00
2	badge_public_base_url		URL base para páginas públicas de badges (req 25-26)	\N	2026-03-16 16:42:03.367917+00
3	email_sender_name	Softinsa Badges	Nome do remetente nos emails da plataforma	\N	2026-03-16 16:42:03.367917+00
4	email_sender_address		Endereço de email remetente	\N	2026-03-16 16:42:03.367917+00
5	default_language	pt	Idioma padrão da plataforma	\N	2026-03-16 16:42:03.367917+00
6	linkedin_share_enabled	true	Activar partilha de badges no LinkedIn (req 11)	\N	2026-03-16 16:42:03.367917+00
7	push_notifications_enabled	true	Activar notificações push no mobile (bonus mobile b)	\N	2026-03-16 16:42:03.367917+00
8	teams_integration_enabled	false	Activar integração com Microsoft Teams (bonus)	\N	2026-03-16 16:42:03.367917+00
9	slack_integration_enabled	false	Activar integração com Slack (bonus)	\N	2026-03-16 16:42:03.367917+00
10	max_evidence_size_mb	20	Tamanho máximo por ficheiro de evidência em MB (req 5)	\N	2026-03-16 16:42:03.367917+00
11	sla_warning_email_enabled	true	Enviar email de aviso de SLA (bonus admin req 1)	\N	2026-03-16 16:42:03.367917+00
12	greeting_absence_days	15	Dias de ausência para saudação especial (bonus greetings)	\N	2026-03-16 16:42:03.367917+00
13	default_completion_timezone	Europe/Lisbon	Timezone padrão para cálculo de prazos	\N	2026-03-16 16:42:03.367917+00
\.


--
-- TOC entry 4104 (class 0 OID 26237)
-- Dependencies: 268
-- Data for Name: point_transactions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.point_transactions (id, user_id, badge_id, user_badge_id, achievement_id, transaction_type, points_delta, balance_after, note, occurred_at, created_by) FROM stdin;
\.


--
-- TOC entry 4092 (class 0 OID 26094)
-- Dependencies: 256
-- Data for Name: push_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.push_tokens (id, user_id, device_token, platform, is_active, registered_at, last_used_at) FROM stdin;
\.


--
-- TOC entry 4110 (class 0 OID 26312)
-- Dependencies: 274
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reminders (id, user_id, created_by, title, message, related_entity, related_id, scheduled_for, sent_at, dismissed_at) FROM stdin;
\.


--
-- TOC entry 4070 (class 0 OID 25747)
-- Dependencies: 234
-- Data for Name: requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.requirements (id, level_id, code, title, description, evidence_instructions, image_url, display_order, is_active, created_at, updated_at) FROM stdin;
1	1	A1	Certificado OutSystems Associate	Obtenção da certificação oficial OutSystems Associate Developer.	Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.	\N	1	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
2	1	A2	Projeto Entregue em Produção	Participação comprovada num projeto LowCode entregue e em produção.	Submeter print do deployment em produção e breve descrição do projeto (máx. 500 palavras) com o nome do cliente anonimizado.	\N	2	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
3	2	B1	Certificado OutSystems Professional	Obtenção da certificação oficial OutSystems Professional Developer.	Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.	\N	1	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
4	2	B2	Liderança de Módulo	Liderança técnica de pelo menos um módulo ou componente num projeto em produção.	Submeter documento de arquitetura do módulo ou registo de pull requests com descrição do papel desempenhado, validado pelo team lead.	\N	2	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
5	3	C1	Certificado OutSystems Expert	Obtenção da certificação oficial OutSystems Expert (Distinguished Software Engineer ou equivalente atual).	Submeter o certificado emitido pela OutSystems University com data de emissão e número de registo.	\N	1	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
6	3	C2	Arquitetura de Sistema Complexo	Conceção e documentação da arquitetura de um sistema complexo (multi-tenant, alta disponibilidade ou integrações críticas).	Submeter diagrama de arquitetura (C4 ou equivalente) e documento de decisões arquiteturais (ADR) revisto pela Service Line.	\N	2	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
7	4	B1	Pipeline CI/CD Implementado	Implementação de um pipeline de CI/CD completo (build, test, deploy) num projeto real ou interno.	Submeter link do repositório (ou export do pipeline) com descrição das etapas implementadas e evidência de execução com sucesso (screenshot ou log).	\N	1	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
8	4	B2	Certificado Docker/Kubernetes	Obtenção de certificação oficial em containerização ou orquestração (ex: Docker Certified Associate, CKA, CKAD ou equivalente).	Submeter o certificado emitido pela entidade certificadora com data de emissão e código de verificação.	\N	2	t	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
\.


--
-- TOC entry 4060 (class 0 OID 25660)
-- Dependencies: 224
-- Data for Name: rgpd_policies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rgpd_policies (id, version, content, is_current, effective_from, created_at) FROM stdin;
1	1.0	Política de privacidade e RGPD da plataforma Softinsa Badges v1.0. O utilizador consente no tratamento dos seus dados pessoais para efeitos de certificação, publicação e partilha de competências profissionais verificáveis, de acordo com o RGPD (Regulamento (UE) 2016/679).	t	2026-03-16	2026-03-16 16:42:03.256555+00
\.


--
-- TOC entry 4058 (class 0 OID 25648)
-- Dependencies: 222
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, code, name, description, created_at) FROM stdin;
1	admin	Administrador	Gestão global da plataforma, utilizadores, badges e configurações	2026-03-16 16:42:03.150379+00
2	consultant	Consultor	Submete candidaturas, consulta badges e acompanha progressão	2026-03-16 16:42:03.150379+00
3	talent_manager	Talent Manager	Valida evidências de candidaturas, transversal a todas as áreas	2026-03-16 16:42:03.150379+00
4	service_line_leader	Service Line Leader	Validação final de candidaturas da sua Service Line	2026-03-16 16:42:03.150379+00
\.


--
-- TOC entry 4082 (class 0 OID 25995)
-- Dependencies: 246
-- Data for Name: service_line_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_line_assignments (id, user_id, service_line_id, assigned_by, assigned_at) FROM stdin;
1	6	2	\N	2026-05-03 15:19:07.609372+00
\.


--
-- TOC entry 4064 (class 0 OID 25687)
-- Dependencies: 228
-- Data for Name: service_lines; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_lines (id, learning_path_id, code, name, description, image_url, is_active, created_at, updated_at) FROM stdin;
2	7	HC	Hybrid Cloud	Soluções de Cloud Híbrida e LowCode	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
3	7	AO	Application Operations	Operações de Aplicações e DevOps	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
\.


--
-- TOC entry 4120 (class 0 OID 26408)
-- Dependencies: 284
-- Data for Name: sla_breach_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sla_breach_logs (id, application_id, sla_policy_id, responsible_user_id, breach_type, hours_elapsed, notified_at) FROM stdin;
\.


--
-- TOC entry 4118 (class 0 OID 26388)
-- Dependencies: 282
-- Data for Name: sla_policies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sla_policies (id, created_by_user_id, team_type, limit_hours, warning_at_percent, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4126 (class 0 OID 26485)
-- Dependencies: 290
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.translations (id, language_id, entity_type, entity_id, field_name, translated_text, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4106 (class 0 OID 26272)
-- Dependencies: 270
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_achievements (id, user_id, achievement_definition_id, trigger_context, celebrated, awarded_at) FROM stdin;
\.


--
-- TOC entry 4102 (class 0 OID 26202)
-- Dependencies: 266
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_badges (id, user_id, badge_id, source_application_id, awarded_at, expires_at, is_published, rgpd_accepted, rgpd_accepted_at, points_awarded, public_token, linkedin_shared_at, certificate_url, created_at) FROM stdin;
\.


--
-- TOC entry 4116 (class 0 OID 26367)
-- Dependencies: 280
-- Data for Name: user_email_signatures; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_email_signatures (id, user_id, include_badges, max_badges_shown, show_only_published, custom_template, generated_html, last_generated_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4084 (class 0 OID 26020)
-- Dependencies: 248
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_preferences (id, user_id, remember_login, badge_public_by_default, email_notifications_enabled, push_notifications_enabled, linkedin_profile_url, softinsa_profile_url, created_at, updated_at) FROM stdin;
1	1	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
2	5	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
3	6	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
4	2	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
5	3	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
6	4	f	f	t	t	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-03 15:19:07.609372+00
\.


--
-- TOC entry 4080 (class 0 OID 25969)
-- Dependencies: 244
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (id, user_id, role_id, is_active, assigned_by, assigned_at) FROM stdin;
1	1	1	t	\N	2026-05-03 15:19:07.609372+00
2	2	2	t	\N	2026-05-03 15:19:07.609372+00
3	3	2	t	\N	2026-05-03 15:19:07.609372+00
4	4	2	t	\N	2026-05-03 15:19:07.609372+00
5	5	3	t	\N	2026-05-03 15:19:07.609372+00
6	6	4	t	\N	2026-05-03 15:19:07.609372+00
\.


--
-- TOC entry 4086 (class 0 OID 26042)
-- Dependencies: 250
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (id, user_id, refresh_token, user_agent, ip_address, device_info, created_at, last_used_at, expires_at, revoked_at) FROM stdin;
1	2	317b0dd666e9c8f503abb6772e13fa9be87ce19daf2f3280a6f42138153b5ef4329623deaeb53ee0e1a8ab9a6f24be5a	\N	\N	\N	2026-05-03 15:24:53.742472+00	2026-05-03 15:24:53.742472+00	2026-06-02 15:24:53.742472+00	\N
2	2	da2c84eaff51d41489989f0887cbc34a83d3d60ef7ff0ab4d998d9819d2eddedff308f7d06ee83d484eb99bad7997b59	\N	\N	\N	2026-05-03 15:25:53.512609+00	2026-05-03 15:25:53.512609+00	2026-06-02 15:25:53.512609+00	\N
3	5	6cdef85bc3b526f1f94fdd8faaf461d94aaae4e5629c05fcdae9f33951b15cd9de094a62d112ec4d1a72ce0f99c45665	\N	\N	\N	2026-05-03 15:25:54.002639+00	2026-05-03 15:25:54.002639+00	2026-06-02 15:25:54.002639+00	\N
4	6	7a994b8ea7aa9af37c1ec72983a7b626c95ce2354d63737c84ceec6c82877104ba912fccfc89ab2c554b73654db1f401	\N	\N	\N	2026-05-03 15:25:54.526077+00	2026-05-03 15:25:54.526077+00	2026-06-02 15:25:54.526077+00	\N
5	1	9fe07179093bdca346c47b0fdcc286262ea898cd26a2d024ac892e665d4e704569064199f251b4eba6b7cd901c1d3af0	\N	\N	\N	2026-05-03 15:25:55.079097+00	2026-05-03 15:25:55.079097+00	2026-06-02 15:25:55.079097+00	\N
6	2	4477c2d14366ad04c4caf89dee3ee674a03aa401d37b4b4b3325544f0e660ded86981b4e898fb450d11012bff7ed5b8b	\N	\N	\N	2026-05-03 15:28:44.257822+00	2026-05-03 15:28:44.257822+00	2026-06-02 15:28:44.257822+00	\N
7	2	fef85664efa70a300fc7a068b31bf0defa16db5dece819322ce02b733b2369a46c1d97cd78c3a063fd5cd895481647c1	\N	\N	\N	2026-05-03 15:33:05.431625+00	2026-05-03 15:33:05.431625+00	2026-06-02 15:33:05.431625+00	\N
8	2	8200199b9a1740903b0493162cedf8bfb37fb4a2c1dfb7fbf6e5887e3595412119b52e9baed639d22e35f50c57f025c9	\N	\N	\N	2026-05-14 14:10:44.901611+00	2026-05-14 14:10:44.901611+00	2026-06-13 14:10:44.901611+00	\N
9	2	138580a8ce5edd118adfd43e65490c22259cf9acbce73db35ba4478f32fabc8e6a6719a2fb0b8acc54deb4de62ed2bc9	\N	\N	\N	2026-05-14 14:21:21.504711+00	2026-05-14 14:21:21.504711+00	2026-06-13 14:21:21.504711+00	\N
10	2	48119cb9cb5ef842af87955cda1177c35dd0d2d4f4632e242350edb03b98030c0a33dfb3bf5535d36fb208ec0862c1c6	\N	\N	\N	2026-05-14 14:35:25.049621+00	2026-05-14 14:35:25.049621+00	2026-06-13 14:35:25.049621+00	\N
11	3	3eecfa78ba73e8e15d6ae8263f48fd0887579c9941a46fdc4f056d6de5b2d3fa9c0e4ca8735eb60009628e8252c7dc69	\N	\N	\N	2026-05-14 14:36:42.140105+00	2026-05-14 14:36:42.140105+00	2026-06-13 14:36:42.140105+00	\N
\.


--
-- TOC entry 4078 (class 0 OID 25938)
-- Dependencies: 242
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, language_id, preferred_area_id, full_name, email, password_hash, account_status, email_verified, must_change_password, accepted_rgpd_at, rgpd_policy_id, first_login_at, last_login_at, created_at, updated_at) FROM stdin;
5	\N	\N	Ana Costa	ana.costa@softinsa.pt	$2a$10$qX3M.l6Z2R.nTuU/Eik5puNRNQuVnsapBT1YoqNHYie0Uqisypdny	active	t	f	\N	\N	2026-05-03 15:25:54.050571+00	2026-05-03 15:25:54.050571+00	2026-05-03 15:19:07.609372+00	2026-05-03 15:25:54.050571+00
6	\N	\N	Carlos Mendes	carlos.mendes@softinsa.pt	$2a$10$LpmEEDiyHiEC4A0NcjyLF.NC7jq86qMNxNy7sWmBub5..rJtvZ7XS	active	t	f	\N	\N	2026-05-03 15:25:54.573592+00	2026-05-03 15:25:54.573592+00	2026-05-03 15:19:07.609372+00	2026-05-03 15:25:54.573592+00
1	\N	\N	Administrador Softinsa	admin@softinsa.pt	$2a$10$OIFwVWfQQ/EhdvKh6RWEFesYfp/9jDDRpVyGld1Sk880n8WQuhXrq	active	t	f	\N	\N	2026-05-03 15:25:55.126629+00	2026-05-03 15:25:55.126629+00	2026-05-03 15:19:07.609372+00	2026-05-03 15:25:55.126629+00
4	\N	2	Victor Rocha	rocha@softinsa.pt	$2a$10$UBBrzWrEXpJBDZlEkSsUq.d1HQZutmLC4gBuwk6.cIjT.CwEN6/2q	active	t	f	\N	\N	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-14 14:35:09.707608+00
2	\N	1	Francisco Abreu	abreu@softinsa.pt	$2a$10$q2XxnrER.FqyiW1AO2irmu0oe7JttPa47e2XL1XimrhFGWVcKNB9C	active	t	f	\N	\N	2026-05-03 15:24:53.822509+00	2026-05-14 14:35:25.088255+00	2026-05-03 15:19:07.609372+00	2026-05-14 14:35:25.088255+00
3	\N	1	Tiago Santos	santos@softinsa.pt	$2a$10$efEsGTRj3mj.YyH/Oho6JOaqFoB1yqGNQxhPsRaGPl9GkSq0XOFBe	active	t	f	\N	\N	2026-05-14 14:36:42.179032+00	2026-05-14 14:36:42.179032+00	2026-05-03 15:19:07.609372+00	2026-05-14 14:36:42.179032+00
\.


--
-- TOC entry 4184 (class 0 OID 0)
-- Dependencies: 237
-- Name: achievement_definitions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.achievement_definitions_id_seq', 12, true);


--
-- TOC entry 4185 (class 0 OID 0)
-- Dependencies: 259
-- Name: application_evidences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_evidences_id_seq', 6, true);


--
-- TOC entry 4186 (class 0 OID 0)
-- Dependencies: 263
-- Name: application_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_history_id_seq', 2, true);


--
-- TOC entry 4187 (class 0 OID 0)
-- Dependencies: 261
-- Name: application_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_reviews_id_seq', 1, false);


--
-- TOC entry 4188 (class 0 OID 0)
-- Dependencies: 229
-- Name: areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.areas_id_seq', 2, true);


--
-- TOC entry 4189 (class 0 OID 0)
-- Dependencies: 297
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 1, false);


--
-- TOC entry 4190 (class 0 OID 0)
-- Dependencies: 257
-- Name: badge_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.badge_applications_id_seq', 4, true);


--
-- TOC entry 4191 (class 0 OID 0)
-- Dependencies: 293
-- Name: badge_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.badge_shares_id_seq', 1, false);


--
-- TOC entry 4192 (class 0 OID 0)
-- Dependencies: 235
-- Name: badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.badges_id_seq', 4, true);


--
-- TOC entry 4193 (class 0 OID 0)
-- Dependencies: 239
-- Name: certificate_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.certificate_templates_id_seq', 1, false);


--
-- TOC entry 4194 (class 0 OID 0)
-- Dependencies: 287
-- Name: consultant_objectives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.consultant_objectives_id_seq', 1, false);


--
-- TOC entry 4195 (class 0 OID 0)
-- Dependencies: 285
-- Name: consultant_timeline_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.consultant_timeline_events_id_seq', 1, false);


--
-- TOC entry 4196 (class 0 OID 0)
-- Dependencies: 277
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.email_templates_id_seq', 9, true);


--
-- TOC entry 4197 (class 0 OID 0)
-- Dependencies: 251
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.email_verification_tokens_id_seq', 1, false);


--
-- TOC entry 4198 (class 0 OID 0)
-- Dependencies: 275
-- Name: info_notices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.info_notices_id_seq', 1, false);


--
-- TOC entry 4199 (class 0 OID 0)
-- Dependencies: 291
-- Name: integration_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.integration_configs_id_seq', 1, false);


--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 219
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.languages_id_seq', 3, true);


--
-- TOC entry 4201 (class 0 OID 0)
-- Dependencies: 225
-- Name: learning_paths_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.learning_paths_id_seq', 7, true);


--
-- TOC entry 4202 (class 0 OID 0)
-- Dependencies: 231
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.levels_id_seq', 4, true);


--
-- TOC entry 4203 (class 0 OID 0)
-- Dependencies: 271
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 4204 (class 0 OID 0)
-- Dependencies: 253
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- TOC entry 4205 (class 0 OID 0)
-- Dependencies: 295
-- Name: platform_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.platform_config_id_seq', 13, true);


--
-- TOC entry 4206 (class 0 OID 0)
-- Dependencies: 267
-- Name: point_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.point_transactions_id_seq', 1, false);


--
-- TOC entry 4207 (class 0 OID 0)
-- Dependencies: 255
-- Name: push_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.push_tokens_id_seq', 1, false);


--
-- TOC entry 4208 (class 0 OID 0)
-- Dependencies: 273
-- Name: reminders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reminders_id_seq', 1, false);


--
-- TOC entry 4209 (class 0 OID 0)
-- Dependencies: 233
-- Name: requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.requirements_id_seq', 8, true);


--
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 223
-- Name: rgpd_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rgpd_policies_id_seq', 1, true);


--
-- TOC entry 4211 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 4212 (class 0 OID 0)
-- Dependencies: 245
-- Name: service_line_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_line_assignments_id_seq', 1, true);


--
-- TOC entry 4213 (class 0 OID 0)
-- Dependencies: 227
-- Name: service_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.service_lines_id_seq', 3, true);


--
-- TOC entry 4214 (class 0 OID 0)
-- Dependencies: 283
-- Name: sla_breach_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sla_breach_logs_id_seq', 1, false);


--
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 281
-- Name: sla_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sla_policies_id_seq', 1, false);


--
-- TOC entry 4216 (class 0 OID 0)
-- Dependencies: 289
-- Name: translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.translations_id_seq', 1, false);


--
-- TOC entry 4217 (class 0 OID 0)
-- Dependencies: 269
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 1, false);


--
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 265
-- Name: user_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_badges_id_seq', 1, false);


--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 279
-- Name: user_email_signatures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_email_signatures_id_seq', 1, false);


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 247
-- Name: user_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_preferences_id_seq', 6, true);


--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 243
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 6, true);


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 11, true);


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 241
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 3700 (class 2606 OID 25919)
-- Name: achievement_definitions achievement_definitions_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievement_definitions
    ADD CONSTRAINT achievement_definitions_code_key UNIQUE (code);


--
-- TOC entry 3702 (class 2606 OID 25917)
-- Name: achievement_definitions achievement_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievement_definitions
    ADD CONSTRAINT achievement_definitions_pkey PRIMARY KEY (id);


--
-- TOC entry 3754 (class 2606 OID 26145)
-- Name: application_evidences application_evidences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_evidences
    ADD CONSTRAINT application_evidences_pkey PRIMARY KEY (id);


--
-- TOC entry 3761 (class 2606 OID 26190)
-- Name: application_history application_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_history
    ADD CONSTRAINT application_history_pkey PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 26170)
-- Name: application_reviews application_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_reviews
    ADD CONSTRAINT application_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3673 (class 2606 OID 25718)
-- Name: areas areas_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_code_key UNIQUE (code);


--
-- TOC entry 3675 (class 2606 OID 25716)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- TOC entry 3828 (class 2606 OID 26562)
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 2606 OID 26124)
-- Name: badge_applications badge_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_applications
    ADD CONSTRAINT badge_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3822 (class 2606 OID 26530)
-- Name: badge_shares badge_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_shares
    ADD CONSTRAINT badge_shares_pkey PRIMARY KEY (id);


--
-- TOC entry 3692 (class 2606 OID 25899)
-- Name: badges badges_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_code_key UNIQUE (code);


--
-- TOC entry 3694 (class 2606 OID 25897)
-- Name: badges badges_level_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_level_id_key UNIQUE (level_id);


--
-- TOC entry 3696 (class 2606 OID 25895)
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 25936)
-- Name: certificate_templates certificate_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certificate_templates
    ADD CONSTRAINT certificate_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 3810 (class 2606 OID 26468)
-- Name: consultant_objectives consultant_objectives_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_objectives
    ADD CONSTRAINT consultant_objectives_pkey PRIMARY KEY (id);


--
-- TOC entry 3807 (class 2606 OID 26441)
-- Name: consultant_timeline_events consultant_timeline_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_timeline_events
    ADD CONSTRAINT consultant_timeline_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3792 (class 2606 OID 26360)
-- Name: email_templates email_templates_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_code_key UNIQUE (code);


--
-- TOC entry 3794 (class 2606 OID 26358)
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 26068)
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 26070)
-- Name: email_verification_tokens email_verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_key UNIQUE (token);


--
-- TOC entry 3790 (class 2606 OID 26341)
-- Name: info_notices info_notices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.info_notices
    ADD CONSTRAINT info_notices_pkey PRIMARY KEY (id);


--
-- TOC entry 3818 (class 2606 OID 26513)
-- Name: integration_configs integration_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.integration_configs
    ADD CONSTRAINT integration_configs_pkey PRIMARY KEY (id);


--
-- TOC entry 3652 (class 2606 OID 25646)
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- TOC entry 3654 (class 2606 OID 25644)
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- TOC entry 3664 (class 2606 OID 25685)
-- Name: learning_paths learning_paths_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.learning_paths
    ADD CONSTRAINT learning_paths_code_key UNIQUE (code);


--
-- TOC entry 3666 (class 2606 OID 25683)
-- Name: learning_paths learning_paths_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.learning_paths
    ADD CONSTRAINT learning_paths_pkey PRIMARY KEY (id);


--
-- TOC entry 3679 (class 2606 OID 25736)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- TOC entry 3785 (class 2606 OID 26305)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3739 (class 2606 OID 26085)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3741 (class 2606 OID 26087)
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- TOC entry 3824 (class 2606 OID 26547)
-- Name: platform_config platform_config_config_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_config
    ADD CONSTRAINT platform_config_config_key_key UNIQUE (config_key);


--
-- TOC entry 3826 (class 2606 OID 26545)
-- Name: platform_config platform_config_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_config
    ADD CONSTRAINT platform_config_pkey PRIMARY KEY (id);


--
-- TOC entry 3777 (class 2606 OID 26245)
-- Name: point_transactions point_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3744 (class 2606 OID 26107)
-- Name: push_tokens push_tokens_device_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_tokens
    ADD CONSTRAINT push_tokens_device_token_key UNIQUE (device_token);


--
-- TOC entry 3746 (class 2606 OID 26105)
-- Name: push_tokens push_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_tokens
    ADD CONSTRAINT push_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 3788 (class 2606 OID 26319)
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 25758)
-- Name: requirements requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requirements
    ADD CONSTRAINT requirements_pkey PRIMARY KEY (id);


--
-- TOC entry 3660 (class 2606 OID 25669)
-- Name: rgpd_policies rgpd_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rgpd_policies
    ADD CONSTRAINT rgpd_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 3662 (class 2606 OID 25671)
-- Name: rgpd_policies rgpd_policies_version_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rgpd_policies
    ADD CONSTRAINT rgpd_policies_version_key UNIQUE (version);


--
-- TOC entry 3656 (class 2606 OID 25658)
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- TOC entry 3658 (class 2606 OID 25656)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3721 (class 2606 OID 26001)
-- Name: service_line_assignments service_line_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments
    ADD CONSTRAINT service_line_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3669 (class 2606 OID 25699)
-- Name: service_lines service_lines_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_lines
    ADD CONSTRAINT service_lines_code_key UNIQUE (code);


--
-- TOC entry 3671 (class 2606 OID 25697)
-- Name: service_lines service_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_lines
    ADD CONSTRAINT service_lines_pkey PRIMARY KEY (id);


--
-- TOC entry 3805 (class 2606 OID 26415)
-- Name: sla_breach_logs sla_breach_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_breach_logs
    ADD CONSTRAINT sla_breach_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3800 (class 2606 OID 26399)
-- Name: sla_policies sla_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_policies
    ADD CONSTRAINT sla_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 3814 (class 2606 OID 26494)
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- TOC entry 3820 (class 2606 OID 26515)
-- Name: integration_configs uq_integration_provider; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.integration_configs
    ADD CONSTRAINT uq_integration_provider UNIQUE (provider);


--
-- TOC entry 3681 (class 2606 OID 25738)
-- Name: levels uq_levels_area_code; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT uq_levels_area_code UNIQUE (area_id, code);


--
-- TOC entry 3683 (class 2606 OID 25740)
-- Name: levels uq_levels_area_rank; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT uq_levels_area_rank UNIQUE (area_id, rank_order);


--
-- TOC entry 3688 (class 2606 OID 25760)
-- Name: requirements uq_requirements_level_code; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requirements
    ADD CONSTRAINT uq_requirements_level_code UNIQUE (level_id, code);


--
-- TOC entry 3690 (class 2606 OID 25762)
-- Name: requirements uq_requirements_level_order; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requirements
    ADD CONSTRAINT uq_requirements_level_order UNIQUE (level_id, display_order);


--
-- TOC entry 3723 (class 2606 OID 26003)
-- Name: service_line_assignments uq_service_line_assignments; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments
    ADD CONSTRAINT uq_service_line_assignments UNIQUE (user_id, service_line_id);


--
-- TOC entry 3802 (class 2606 OID 26401)
-- Name: sla_policies uq_sla_policies_team; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_policies
    ADD CONSTRAINT uq_sla_policies_team UNIQUE (team_type);


--
-- TOC entry 3816 (class 2606 OID 26496)
-- Name: translations uq_translations; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT uq_translations UNIQUE (language_id, entity_type, entity_id, field_name);


--
-- TOC entry 3780 (class 2606 OID 26283)
-- Name: user_achievements uq_user_achievements; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT uq_user_achievements UNIQUE (user_id, achievement_definition_id);


--
-- TOC entry 3715 (class 2606 OID 25978)
-- Name: user_roles uq_user_roles; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT uq_user_roles UNIQUE (user_id, role_id);


--
-- TOC entry 3782 (class 2606 OID 26281)
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- TOC entry 3769 (class 2606 OID 26216)
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- TOC entry 3771 (class 2606 OID 26220)
-- Name: user_badges user_badges_public_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_public_token_key UNIQUE (public_token);


--
-- TOC entry 3773 (class 2606 OID 26218)
-- Name: user_badges user_badges_source_application_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_source_application_id_key UNIQUE (source_application_id);


--
-- TOC entry 3796 (class 2606 OID 26379)
-- Name: user_email_signatures user_email_signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_email_signatures
    ADD CONSTRAINT user_email_signatures_pkey PRIMARY KEY (id);


--
-- TOC entry 3798 (class 2606 OID 26381)
-- Name: user_email_signatures user_email_signatures_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_email_signatures
    ADD CONSTRAINT user_email_signatures_user_id_key UNIQUE (user_id);


--
-- TOC entry 3725 (class 2606 OID 26033)
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 26035)
-- Name: user_preferences user_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);


--
-- TOC entry 3717 (class 2606 OID 25976)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3731 (class 2606 OID 26051)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3733 (class 2606 OID 26053)
-- Name: user_sessions user_sessions_refresh_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_refresh_token_key UNIQUE (refresh_token);


--
-- TOC entry 3709 (class 2606 OID 25952)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3711 (class 2606 OID 25950)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3778 (class 1259 OID 26599)
-- Name: idx_achievements_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_achievements_user ON public.user_achievements USING btree (user_id);


--
-- TOC entry 3749 (class 1259 OID 26584)
-- Name: idx_apps_applicant; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_apps_applicant ON public.badge_applications USING btree (applicant_user_id);


--
-- TOC entry 3750 (class 1259 OID 26585)
-- Name: idx_apps_badge; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_apps_badge ON public.badge_applications USING btree (badge_id);


--
-- TOC entry 3751 (class 1259 OID 26586)
-- Name: idx_apps_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_apps_status ON public.badge_applications USING btree (status);


--
-- TOC entry 3752 (class 1259 OID 26587)
-- Name: idx_apps_submitted; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_apps_submitted ON public.badge_applications USING btree (submitted_at);


--
-- TOC entry 3676 (class 1259 OID 26569)
-- Name: idx_areas_sl; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_areas_sl ON public.areas USING btree (service_line_id);


--
-- TOC entry 3829 (class 1259 OID 26606)
-- Name: idx_audit_actor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_actor ON public.audit_log USING btree (actor_id);


--
-- TOC entry 3830 (class 1259 OID 26607)
-- Name: idx_audit_entity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_entity ON public.audit_log USING btree (entity_type, entity_id);


--
-- TOC entry 3831 (class 1259 OID 26608)
-- Name: idx_audit_occurred; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_occurred ON public.audit_log USING btree (occurred_at);


--
-- TOC entry 3697 (class 1259 OID 26572)
-- Name: idx_badges_level; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_badges_level ON public.badges USING btree (level_id);


--
-- TOC entry 3698 (class 1259 OID 26573)
-- Name: idx_badges_type_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_badges_type_active ON public.badges USING btree (badge_type, is_active);


--
-- TOC entry 3755 (class 1259 OID 26588)
-- Name: idx_evidences_app; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_evidences_app ON public.application_evidences USING btree (application_id);


--
-- TOC entry 3756 (class 1259 OID 26589)
-- Name: idx_evidences_req; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_evidences_req ON public.application_evidences USING btree (requirement_id);


--
-- TOC entry 3762 (class 1259 OID 26591)
-- Name: idx_history_app; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_history_app ON public.application_history USING btree (application_id);


--
-- TOC entry 3763 (class 1259 OID 26592)
-- Name: idx_history_occurred; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_history_occurred ON public.application_history USING btree (occurred_at);


--
-- TOC entry 3677 (class 1259 OID 26570)
-- Name: idx_levels_area; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_levels_area ON public.levels USING btree (area_id);


--
-- TOC entry 3783 (class 1259 OID 26600)
-- Name: idx_notif_user_unread; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notif_user_unread ON public.notifications USING btree (user_id, is_read) WHERE (is_read = false);


--
-- TOC entry 3811 (class 1259 OID 26604)
-- Name: idx_objectives_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_objectives_user ON public.consultant_objectives USING btree (user_id, target_date);


--
-- TOC entry 3774 (class 1259 OID 26598)
-- Name: idx_points_occurred; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_points_occurred ON public.point_transactions USING btree (occurred_at);


--
-- TOC entry 3775 (class 1259 OID 26597)
-- Name: idx_points_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_points_user ON public.point_transactions USING btree (user_id);


--
-- TOC entry 3742 (class 1259 OID 26583)
-- Name: idx_push_tokens_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_push_tokens_user ON public.push_tokens USING btree (user_id);


--
-- TOC entry 3786 (class 1259 OID 26601)
-- Name: idx_reminders_due; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reminders_due ON public.reminders USING btree (user_id, scheduled_for) WHERE (sent_at IS NULL);


--
-- TOC entry 3684 (class 1259 OID 26571)
-- Name: idx_requirements_level; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_requirements_level ON public.requirements USING btree (level_id);


--
-- TOC entry 3759 (class 1259 OID 26590)
-- Name: idx_reviews_app; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_reviews_app ON public.application_reviews USING btree (application_id);


--
-- TOC entry 3667 (class 1259 OID 26568)
-- Name: idx_service_lines_lp; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_service_lines_lp ON public.service_lines USING btree (learning_path_id);


--
-- TOC entry 3728 (class 1259 OID 26582)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_expires ON public.user_sessions USING btree (expires_at);


--
-- TOC entry 3729 (class 1259 OID 26581)
-- Name: idx_sessions_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_user ON public.user_sessions USING btree (user_id);


--
-- TOC entry 3718 (class 1259 OID 26580)
-- Name: idx_sl_assign_sl; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sl_assign_sl ON public.service_line_assignments USING btree (service_line_id);


--
-- TOC entry 3719 (class 1259 OID 26579)
-- Name: idx_sl_assign_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sl_assign_user ON public.service_line_assignments USING btree (user_id);


--
-- TOC entry 3803 (class 1259 OID 26602)
-- Name: idx_sla_breach_app; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sla_breach_app ON public.sla_breach_logs USING btree (application_id);


--
-- TOC entry 3808 (class 1259 OID 26603)
-- Name: idx_timeline_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_timeline_user ON public.consultant_timeline_events USING btree (user_id, event_date);


--
-- TOC entry 3812 (class 1259 OID 26605)
-- Name: idx_translations_entity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_translations_entity ON public.translations USING btree (entity_type, entity_id);


--
-- TOC entry 3764 (class 1259 OID 26594)
-- Name: idx_user_badges_badge; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_badges_badge ON public.user_badges USING btree (badge_id);


--
-- TOC entry 3765 (class 1259 OID 26596)
-- Name: idx_user_badges_expires; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_badges_expires ON public.user_badges USING btree (expires_at) WHERE (expires_at IS NOT NULL);


--
-- TOC entry 3766 (class 1259 OID 26595)
-- Name: idx_user_badges_pub; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_badges_pub ON public.user_badges USING btree (is_published) WHERE (is_published = true);


--
-- TOC entry 3767 (class 1259 OID 26593)
-- Name: idx_user_badges_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_badges_user ON public.user_badges USING btree (user_id);


--
-- TOC entry 3712 (class 1259 OID 26578)
-- Name: idx_user_roles_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_roles_role ON public.user_roles USING btree (role_id);


--
-- TOC entry 3713 (class 1259 OID 26577)
-- Name: idx_user_roles_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_user_roles_user ON public.user_roles USING btree (user_id);


--
-- TOC entry 3705 (class 1259 OID 26575)
-- Name: idx_users_area; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_area ON public.users USING btree (preferred_area_id);


--
-- TOC entry 3706 (class 1259 OID 26574)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 3707 (class 1259 OID 26576)
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_status ON public.users USING btree (account_status);


--
-- TOC entry 3894 (class 2620 OID 40993)
-- Name: areas trg_areas_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3897 (class 2620 OID 40996)
-- Name: badges trg_badges_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_badges_updated_at BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3903 (class 2620 OID 41002)
-- Name: consultant_objectives trg_consultant_objectives_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_consultant_objectives_updated_at BEFORE UPDATE ON public.consultant_objectives FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3901 (class 2620 OID 41000)
-- Name: email_templates trg_email_templates_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3900 (class 2620 OID 40999)
-- Name: info_notices trg_info_notices_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_info_notices_updated_at BEFORE UPDATE ON public.info_notices FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3905 (class 2620 OID 41004)
-- Name: integration_configs trg_integration_configs_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_integration_configs_updated_at BEFORE UPDATE ON public.integration_configs FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3892 (class 2620 OID 40991)
-- Name: learning_paths trg_learning_paths_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3895 (class 2620 OID 40994)
-- Name: levels trg_levels_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_levels_updated_at BEFORE UPDATE ON public.levels FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3906 (class 2620 OID 41005)
-- Name: platform_config trg_platform_config_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_platform_config_updated_at BEFORE UPDATE ON public.platform_config FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3896 (class 2620 OID 40995)
-- Name: requirements trg_requirements_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_requirements_updated_at BEFORE UPDATE ON public.requirements FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3893 (class 2620 OID 40992)
-- Name: service_lines trg_service_lines_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_service_lines_updated_at BEFORE UPDATE ON public.service_lines FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3902 (class 2620 OID 41001)
-- Name: sla_policies trg_sla_policies_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_sla_policies_updated_at BEFORE UPDATE ON public.sla_policies FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3904 (class 2620 OID 41003)
-- Name: translations trg_translations_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3899 (class 2620 OID 40998)
-- Name: user_preferences trg_user_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3898 (class 2620 OID 40997)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trg_set_updated_at();


--
-- TOC entry 3837 (class 2606 OID 25920)
-- Name: achievement_definitions achievement_definitions_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.achievement_definitions
    ADD CONSTRAINT achievement_definitions_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;


--
-- TOC entry 3854 (class 2606 OID 26146)
-- Name: application_evidences application_evidences_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_evidences
    ADD CONSTRAINT application_evidences_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.badge_applications(id) ON DELETE CASCADE;


--
-- TOC entry 3855 (class 2606 OID 26151)
-- Name: application_evidences application_evidences_requirement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_evidences
    ADD CONSTRAINT application_evidences_requirement_id_fkey FOREIGN KEY (requirement_id) REFERENCES public.requirements(id) ON DELETE RESTRICT;


--
-- TOC entry 3856 (class 2606 OID 26156)
-- Name: application_evidences application_evidences_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_evidences
    ADD CONSTRAINT application_evidences_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3859 (class 2606 OID 26196)
-- Name: application_history application_history_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_history
    ADD CONSTRAINT application_history_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3860 (class 2606 OID 26191)
-- Name: application_history application_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_history
    ADD CONSTRAINT application_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.badge_applications(id) ON DELETE CASCADE;


--
-- TOC entry 3857 (class 2606 OID 26171)
-- Name: application_reviews application_reviews_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_reviews
    ADD CONSTRAINT application_reviews_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.badge_applications(id) ON DELETE CASCADE;


--
-- TOC entry 3858 (class 2606 OID 26176)
-- Name: application_reviews application_reviews_reviewer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.application_reviews
    ADD CONSTRAINT application_reviews_reviewer_user_id_fkey FOREIGN KEY (reviewer_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3833 (class 2606 OID 25719)
-- Name: areas areas_service_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_service_line_id_fkey FOREIGN KEY (service_line_id) REFERENCES public.service_lines(id) ON DELETE CASCADE;


--
-- TOC entry 3891 (class 2606 OID 26563)
-- Name: audit_log audit_log_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3852 (class 2606 OID 26125)
-- Name: badge_applications badge_applications_applicant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_applications
    ADD CONSTRAINT badge_applications_applicant_user_id_fkey FOREIGN KEY (applicant_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3853 (class 2606 OID 26130)
-- Name: badge_applications badge_applications_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_applications
    ADD CONSTRAINT badge_applications_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE RESTRICT;


--
-- TOC entry 3889 (class 2606 OID 26531)
-- Name: badge_shares badge_shares_user_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badge_shares
    ADD CONSTRAINT badge_shares_user_badge_id_fkey FOREIGN KEY (user_badge_id) REFERENCES public.user_badges(id) ON DELETE CASCADE;


--
-- TOC entry 3836 (class 2606 OID 25900)
-- Name: badges badges_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id) ON DELETE SET NULL;


--
-- TOC entry 3884 (class 2606 OID 26474)
-- Name: consultant_objectives consultant_objectives_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_objectives
    ADD CONSTRAINT consultant_objectives_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3885 (class 2606 OID 26479)
-- Name: consultant_objectives consultant_objectives_target_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_objectives
    ADD CONSTRAINT consultant_objectives_target_badge_id_fkey FOREIGN KEY (target_badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;


--
-- TOC entry 3886 (class 2606 OID 26469)
-- Name: consultant_objectives consultant_objectives_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_objectives
    ADD CONSTRAINT consultant_objectives_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3881 (class 2606 OID 26447)
-- Name: consultant_timeline_events consultant_timeline_events_related_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_timeline_events
    ADD CONSTRAINT consultant_timeline_events_related_badge_id_fkey FOREIGN KEY (related_badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;


--
-- TOC entry 3882 (class 2606 OID 26452)
-- Name: consultant_timeline_events consultant_timeline_events_related_user_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_timeline_events
    ADD CONSTRAINT consultant_timeline_events_related_user_badge_id_fkey FOREIGN KEY (related_user_badge_id) REFERENCES public.user_badges(id) ON DELETE SET NULL;


--
-- TOC entry 3883 (class 2606 OID 26442)
-- Name: consultant_timeline_events consultant_timeline_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.consultant_timeline_events
    ADD CONSTRAINT consultant_timeline_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3875 (class 2606 OID 26361)
-- Name: email_templates email_templates_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE SET NULL;


--
-- TOC entry 3849 (class 2606 OID 26071)
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3874 (class 2606 OID 26342)
-- Name: info_notices info_notices_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.info_notices
    ADD CONSTRAINT info_notices_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3888 (class 2606 OID 26516)
-- Name: integration_configs integration_configs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.integration_configs
    ADD CONSTRAINT integration_configs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3834 (class 2606 OID 25741)
-- Name: levels levels_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id) ON DELETE CASCADE;


--
-- TOC entry 3871 (class 2606 OID 26306)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3850 (class 2606 OID 26088)
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3890 (class 2606 OID 26548)
-- Name: platform_config platform_config_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.platform_config
    ADD CONSTRAINT platform_config_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3864 (class 2606 OID 26261)
-- Name: point_transactions point_transactions_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievement_definitions(id) ON DELETE SET NULL;


--
-- TOC entry 3865 (class 2606 OID 26251)
-- Name: point_transactions point_transactions_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE SET NULL;


--
-- TOC entry 3866 (class 2606 OID 26266)
-- Name: point_transactions point_transactions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3867 (class 2606 OID 26256)
-- Name: point_transactions point_transactions_user_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_badge_id_fkey FOREIGN KEY (user_badge_id) REFERENCES public.user_badges(id) ON DELETE SET NULL;


--
-- TOC entry 3868 (class 2606 OID 26246)
-- Name: point_transactions point_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3851 (class 2606 OID 26108)
-- Name: push_tokens push_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_tokens
    ADD CONSTRAINT push_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3872 (class 2606 OID 26325)
-- Name: reminders reminders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3873 (class 2606 OID 26320)
-- Name: reminders reminders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3835 (class 2606 OID 25763)
-- Name: requirements requirements_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.requirements
    ADD CONSTRAINT requirements_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(id) ON DELETE CASCADE;


--
-- TOC entry 3844 (class 2606 OID 26014)
-- Name: service_line_assignments service_line_assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments
    ADD CONSTRAINT service_line_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3845 (class 2606 OID 26009)
-- Name: service_line_assignments service_line_assignments_service_line_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments
    ADD CONSTRAINT service_line_assignments_service_line_id_fkey FOREIGN KEY (service_line_id) REFERENCES public.service_lines(id) ON DELETE CASCADE;


--
-- TOC entry 3846 (class 2606 OID 26004)
-- Name: service_line_assignments service_line_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_line_assignments
    ADD CONSTRAINT service_line_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3832 (class 2606 OID 25700)
-- Name: service_lines service_lines_learning_path_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_lines
    ADD CONSTRAINT service_lines_learning_path_id_fkey FOREIGN KEY (learning_path_id) REFERENCES public.learning_paths(id) ON DELETE CASCADE;


--
-- TOC entry 3878 (class 2606 OID 26416)
-- Name: sla_breach_logs sla_breach_logs_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_breach_logs
    ADD CONSTRAINT sla_breach_logs_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.badge_applications(id) ON DELETE CASCADE;


--
-- TOC entry 3879 (class 2606 OID 26426)
-- Name: sla_breach_logs sla_breach_logs_responsible_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_breach_logs
    ADD CONSTRAINT sla_breach_logs_responsible_user_id_fkey FOREIGN KEY (responsible_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3880 (class 2606 OID 26421)
-- Name: sla_breach_logs sla_breach_logs_sla_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_breach_logs
    ADD CONSTRAINT sla_breach_logs_sla_policy_id_fkey FOREIGN KEY (sla_policy_id) REFERENCES public.sla_policies(id) ON DELETE RESTRICT;


--
-- TOC entry 3877 (class 2606 OID 26402)
-- Name: sla_policies sla_policies_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sla_policies
    ADD CONSTRAINT sla_policies_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 3887 (class 2606 OID 26497)
-- Name: translations translations_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE CASCADE;


--
-- TOC entry 3869 (class 2606 OID 26289)
-- Name: user_achievements user_achievements_achievement_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_definition_id_fkey FOREIGN KEY (achievement_definition_id) REFERENCES public.achievement_definitions(id) ON DELETE CASCADE;


--
-- TOC entry 3870 (class 2606 OID 26284)
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3861 (class 2606 OID 26226)
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE RESTRICT;


--
-- TOC entry 3862 (class 2606 OID 26231)
-- Name: user_badges user_badges_source_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_source_application_id_fkey FOREIGN KEY (source_application_id) REFERENCES public.badge_applications(id) ON DELETE SET NULL;


--
-- TOC entry 3863 (class 2606 OID 26221)
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3876 (class 2606 OID 26382)
-- Name: user_email_signatures user_email_signatures_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_email_signatures
    ADD CONSTRAINT user_email_signatures_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3847 (class 2606 OID 26036)
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3841 (class 2606 OID 25989)
-- Name: user_roles user_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3842 (class 2606 OID 25984)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 3843 (class 2606 OID 25979)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3848 (class 2606 OID 26054)
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3838 (class 2606 OID 25953)
-- Name: users users_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id) ON DELETE SET NULL;


--
-- TOC entry 3839 (class 2606 OID 25958)
-- Name: users users_preferred_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_preferred_area_id_fkey FOREIGN KEY (preferred_area_id) REFERENCES public.areas(id) ON DELETE SET NULL;


--
-- TOC entry 3840 (class 2606 OID 25963)
-- Name: users users_rgpd_policy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_rgpd_policy_id_fkey FOREIGN KEY (rgpd_policy_id) REFERENCES public.rgpd_policies(id) ON DELETE SET NULL;


--
-- TOC entry 4141 (class 0 OID 0)
-- Dependencies: 4140
-- Name: DATABASE neondb; Type: ACL; Schema: -; Owner: neondb_owner
--

GRANT ALL ON DATABASE neondb TO neon_superuser;


--
-- TOC entry 2334 (class 826 OID 16394)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- TOC entry 2333 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


-- Completed on 2026-05-14 15:46:17

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.8 (9c8634e)
-- Dumped by pg_dump version 17.5

-- Started on 2026-05-14 15:46:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16392)
-- Name: neon; Type: SCHEMA; Schema: -; Owner: cloud_admin
--

CREATE SCHEMA neon;


ALTER SCHEMA neon OWNER TO cloud_admin;

--
-- TOC entry 9 (class 2615 OID 16476)
-- Name: neon_migration; Type: SCHEMA; Schema: -; Owner: cloud_admin
--

CREATE SCHEMA neon_migration;


ALTER SCHEMA neon_migration OWNER TO cloud_admin;

--
-- TOC entry 3 (class 3079 OID 16432)
-- Name: neon; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS neon WITH SCHEMA neon;


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION neon; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION neon IS 'cloud storage for PostgreSQL';


--
-- TOC entry 2 (class 3079 OID 16395)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 234 (class 1255 OID 16494)
-- Name: get_compute_primary_memory_bytes(); Type: FUNCTION; Schema: public; Owner: cloud_admin
--

CREATE FUNCTION public.get_compute_primary_memory_bytes() RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
    result BIGINT;
    flag_enabled BOOLEAN;
BEGIN
    -- Check if this is a replica (primary should never emit this metric)
    IF NOT pg_catalog.pg_is_in_recovery() THEN
        RETURN NULL;
    END IF;

    -- Check if the autoscaling state transfer flag is enabled
    -- The flag is exposed as a PostgreSQL GUC by compute_ctl
    -- Note: current_setting returns NULL if the setting doesn't exist (with missing_ok=true)
    -- We treat NULL as "flag not enabled" to be safe
    flag_enabled := pg_catalog.current_setting('neon.autoscaling_state_transfer_enabled', true) = 'on';
    IF flag_enabled IS NULL OR NOT flag_enabled THEN
        RETURN NULL;
    END IF;

    -- Get the value from the table
    SELECT (value)::bigint INTO result
    FROM public.lakebase_attributes
    WHERE name = 'primary_memory' AND value IS NOT NULL;

    -- Return NULL if no row found (COALESCE not used - we want NULL to not emit metric)
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.get_compute_primary_memory_bytes() OWNER TO cloud_admin;

--
-- TOC entry 275 (class 1255 OID 32781)
-- Name: health_check_write_succeeds(); Type: FUNCTION; Schema: public; Owner: cloud_admin
--

CREATE FUNCTION public.health_check_write_succeeds() RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
INSERT INTO public.health_check VALUES (1, now())
ON CONFLICT (id) DO UPDATE
    SET updated_at = now();

RETURN 1;
EXCEPTION WHEN OTHERS THEN
RAISE EXCEPTION '[NEON_SMGR] health_check failed: [%] %', SQLSTATE, SQLERRM;
RETURN 0;
END;
$$;


ALTER FUNCTION public.health_check_write_succeeds() OWNER TO cloud_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16477)
-- Name: migration_id; Type: TABLE; Schema: neon_migration; Owner: cloud_admin
--

CREATE TABLE neon_migration.migration_id (
    key integer NOT NULL,
    id bigint DEFAULT 0 NOT NULL
);


ALTER TABLE neon_migration.migration_id OWNER TO cloud_admin;

--
-- TOC entry 229 (class 1259 OID 16470)
-- Name: health_check; Type: TABLE; Schema: public; Owner: cloud_admin
--

CREATE TABLE public.health_check (
    id integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.health_check OWNER TO cloud_admin;

--
-- TOC entry 228 (class 1259 OID 16469)
-- Name: health_check_id_seq; Type: SEQUENCE; Schema: public; Owner: cloud_admin
--

ALTER TABLE public.health_check ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.health_check_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 16486)
-- Name: lakebase_attributes; Type: TABLE; Schema: public; Owner: cloud_admin
--

CREATE TABLE public.lakebase_attributes (
    name text NOT NULL,
    value jsonb,
    last_updated timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lakebase_attributes OWNER TO cloud_admin;

--
-- TOC entry 3441 (class 0 OID 16477)
-- Dependencies: 230
-- Data for Name: migration_id; Type: TABLE DATA; Schema: neon_migration; Owner: cloud_admin
--

COPY neon_migration.migration_id (key, id) FROM stdin;
0	14
\.


--
-- TOC entry 3440 (class 0 OID 16470)
-- Dependencies: 229
-- Data for Name: health_check; Type: TABLE DATA; Schema: public; Owner: cloud_admin
--

COPY public.health_check (id, updated_at) FROM stdin;
1	2026-05-14 14:46:16.315939+00
\.


--
-- TOC entry 3442 (class 0 OID 16486)
-- Dependencies: 231
-- Data for Name: lakebase_attributes; Type: TABLE DATA; Schema: public; Owner: cloud_admin
--

COPY public.lakebase_attributes (name, value, last_updated) FROM stdin;
\.


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 228
-- Name: health_check_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cloud_admin
--

SELECT pg_catalog.setval('public.health_check_id_seq', 1, false);


--
-- TOC entry 3282 (class 2606 OID 16482)
-- Name: migration_id migration_id_pkey; Type: CONSTRAINT; Schema: neon_migration; Owner: cloud_admin
--

ALTER TABLE ONLY neon_migration.migration_id
    ADD CONSTRAINT migration_id_pkey PRIMARY KEY (key);


--
-- TOC entry 3280 (class 2606 OID 16475)
-- Name: health_check health_check_pkey; Type: CONSTRAINT; Schema: public; Owner: cloud_admin
--

ALTER TABLE ONLY public.health_check
    ADD CONSTRAINT health_check_pkey PRIMARY KEY (id);


--
-- TOC entry 3284 (class 2606 OID 16493)
-- Name: lakebase_attributes lakebase_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: cloud_admin
--

ALTER TABLE ONLY public.lakebase_attributes
    ADD CONSTRAINT lakebase_attributes_pkey PRIMARY KEY (name);


--
-- TOC entry 3286 (class 2620 OID 32782)
-- Name: migration_id neon_migration_id_superuser_check; Type: TRIGGER; Schema: neon_migration; Owner: cloud_admin
--

CREATE TRIGGER neon_migration_id_superuser_check BEFORE INSERT OR DELETE OR UPDATE OR TRUNCATE ON neon_migration.migration_id FOR EACH STATEMENT EXECUTE FUNCTION neon.neon_check_for_superuser();


--
-- TOC entry 3285 (class 2620 OID 32780)
-- Name: health_check neon_health_check_superuser_check; Type: TRIGGER; Schema: public; Owner: cloud_admin
--

CREATE TRIGGER neon_health_check_superuser_check BEFORE INSERT OR DELETE OR UPDATE OR TRUNCATE ON public.health_check FOR EACH STATEMENT EXECUTE FUNCTION neon.neon_check_for_superuser();


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 241
-- Name: FUNCTION pg_export_snapshot(); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_export_snapshot() TO neon_superuser;


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 240
-- Name: FUNCTION pg_log_standby_snapshot(); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_log_standby_snapshot() TO neon_superuser;


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 233
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: cloud_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO neon_superuser;


-- Completed on 2026-05-14 15:46:21

--
-- PostgreSQL database dump complete
--

-- Completed on 2026-05-14 15:46:21

--
-- PostgreSQL database cluster dump complete
--

