--
-- PostgreSQL database cluster dump
--

-- Started on 2026-05-15 15:14:25

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

-- Started on 2026-05-15 15:14:25

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

-- Completed on 2026-05-15 15:14:30

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

-- Started on 2026-05-15 15:14:30

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
13	FIRST_BADGE	Primeiro Badge	Obtiveste o teu primeiro badge na plataforma!	\N	\N	50	{"min_badges": 1}	t	2026-05-14 18:06:42.439766+00
14	BADGES_3	Trio de Excelência	Obtiveste 3 badges. Estás no bom caminho!	\N	\N	100	{"min_badges": 3}	t	2026-05-14 18:06:42.439766+00
15	BADGES_5	Colecionador	Já tens 5 badges. Impressionante dedicação!	\N	\N	200	{"min_badges": 5}	t	2026-05-14 18:06:42.439766+00
16	BADGES_10	Mestre dos Badges	Chegaste aos 10 badges. És um verdadeiro especialista!	\N	\N	500	{"min_badges": 10}	t	2026-05-14 18:06:42.439766+00
17	POINTS_100	Primeiros 100 Pontos	Atingiste os 100 pontos na plataforma.	\N	\N	0	{"min_points": 100}	t	2026-05-14 18:06:42.439766+00
18	POINTS_500	Acumulador	Chegaste aos 500 pontos. Excelente evolução!	\N	\N	50	{"min_points": 500}	t	2026-05-14 18:06:42.439766+00
19	POINTS_1000	Elite da Softinsa	Atingiste 1000 pontos. Estás no topo!	\N	\N	150	{"min_points": 1000}	t	2026-05-14 18:06:42.439766+00
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
7	5	3	2	evidencia.pdf	aplicacoes/5/3/evidencia	123	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:54:03.39089+00
8	5	4	2	evidencia.pdf	aplicacoes/5/4/evidencia	123332	\N	\N	Evidência submetida pelo consultor	2026-05-14 14:54:18.248873+00
9	6	5	2	evidencia.pdf	aplicacoes/6/5/evidencia	werew	\N	\N	Evidência submetida pelo consultor	2026-05-14 15:20:14.410201+00
10	6	6	2	evidencia.pdf	aplicacoes/6/6/evidencia	124312	\N	\N	Evidência submetida pelo consultor	2026-05-14 15:20:17.603913+00
11	7	3	2	evidencia.pdf	aplicacoes/7/3/evidencia	te	\N	\N	Evidência submetida pelo consultor	2026-05-14 15:22:46.976775+00
12	7	4	2	evidencia.pdf	aplicacoes/7/4/evidencia	te	\N	\N	Evidência submetida pelo consultor	2026-05-14 15:22:48.058458+00
13	8	11	2	evidencia.pdf	aplicacoes/8/11/evidencia	e	\N	\N	Evidência submetida pelo consultor	2026-05-14 18:46:06.858928+00
14	8	12	2	evidencia.pdf	aplicacoes/8/12/evidencia	e	\N	\N	Evidência submetida pelo consultor	2026-05-14 18:46:09.292224+00
15	9	13	2	evidencia.pdf	aplicacoes/9/13/evidencia	12	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:09:59.397004+00
16	9	14	2	evidencia.pdf	aplicacoes/9/14/evidencia	2	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:10:00.460764+00
17	10	32	3	evidencia.pdf	aplicacoes/10/32/evidencia	132	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:18:41.627147+00
18	10	31	3	evidencia.pdf	aplicacoes/10/31/evidencia	312	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:18:41.985747+00
19	11	11	2	evidencia.pdf	aplicacoes/11/11/evidencia	11	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:21:56.940744+00
20	11	12	2	evidencia.pdf	aplicacoes/11/12/evidencia	11	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:21:58.080142+00
21	12	15	2	evidencia.pdf	aplicacoes/12/15/evidencia	3	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:29:30.85425+00
22	12	16	2	evidencia.pdf	aplicacoes/12/16/evidencia	33	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:29:31.247567+00
23	13	5	2	evidencia.pdf	aplicacoes/13/5/evidencia	teste	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:39:48.605144+00
24	13	6	2	evidencia.pdf	aplicacoes/13/6/evidencia	teste	\N	\N	Evidência submetida pelo consultor	2026-05-14 19:39:49.957303+00
25	14	5	2	evidencia.pdf	aplicacoes/14/5/evidencia	asd	\N	\N	Evidência submetida pelo consultor	2026-05-15 00:00:59.570658+00
26	14	6	2	evidencia.pdf	aplicacoes/14/6/evidencia	asd	\N	\N	Evidência submetida pelo consultor	2026-05-15 00:01:00.021509+00
27	15	13	2	evidencia.pdf	aplicacoes/15/13/evidencia	adasdadsasd	\N	\N	Evidência submetida pelo consultor	2026-05-15 10:35:07.312282+00
28	15	14	2	evidencia.pdf	aplicacoes/15/14/evidencia	asd	\N	\N	Evidência submetida pelo consultor	2026-05-15 10:35:07.952043+00
29	16	1	2	evidencia.pdf	aplicacoes/16/1/evidencia	132	\N	\N	Evidência submetida pelo consultor	2026-05-15 10:43:54.08331+00
30	16	2	2	evidencia.pdf	aplicacoes/16/2/evidencia	123	\N	\N	Evidência submetida pelo consultor	2026-05-15 10:43:57.069885+00
31	17	14	2	evidencia.pdf	aplicacoes/17/14/evidencia	s	\N	\N	Evidência submetida pelo consultor	2026-05-15 11:03:38.654378+00
32	17	13	2	evidencia.pdf	aplicacoes/17/13/evidencia	s	\N	\N	Evidência submetida pelo consultor	2026-05-15 11:03:39.249006+00
33	18	15	2	evidencia.pdf	aplicacoes/18/15/evidencia	adas	\N	\N	Evidência submetida pelo consultor	2026-05-15 11:23:59.373148+00
34	18	16	2	evidencia.pdf	aplicacoes/18/16/evidencia	asd	\N	\N	Evidência submetida pelo consultor	2026-05-15 11:24:02.449281+00
\.


--
-- TOC entry 4100 (class 0 OID 26182)
-- Dependencies: 264
-- Data for Name: application_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.application_history (id, application_id, actor_user_id, from_status, to_status, event_type, comment, occurred_at) FROM stdin;
1	3	2	open	submitted	submitted	\N	2026-05-14 14:17:46.350263+00
2	4	2	open	submitted	submitted	\N	2026-05-14 14:32:39.636976+00
3	4	5	submitted	closed	approved	adjaksdj	2026-05-14 14:50:35.723361+00
4	3	5	submitted	closed	rejected	Não dá	2026-05-14 14:50:56.181022+00
5	5	2	open	submitted	submitted	\N	2026-05-14 14:54:19.535703+00
6	5	5	submitted	closed	approved	123123	2026-05-14 14:55:27.390014+00
7	6	2	open	submitted	submitted	\N	2026-05-14 15:20:18.956886+00
8	6	5	submitted	closed	approved	132131	2026-05-14 15:21:17.425479+00
9	7	2	open	submitted	submitted	\N	2026-05-14 15:22:48.445227+00
10	7	5	submitted	closed	approved	\N	2026-05-14 17:42:42.796992+00
11	8	2	open	submitted	submitted	\N	2026-05-14 18:46:11.751695+00
12	8	5	submitted	in_validation	forwarded	\N	2026-05-14 18:51:05.437838+00
13	8	5	in_validation	closed	approved	12	2026-05-14 18:51:08.708076+00
14	9	2	open	submitted	submitted	\N	2026-05-14 19:10:01.018794+00
15	9	5	submitted	in_validation	forwarded	\N	2026-05-14 19:10:32.972513+00
16	9	5	in_validation	closed	approved	Sim	2026-05-14 19:10:37.823144+00
17	10	3	open	submitted	submitted	\N	2026-05-14 19:18:43.164541+00
18	10	5	submitted	in_validation	forwarded	\N	2026-05-14 19:20:22.889214+00
19	10	5	in_validation	closed	approved	sIM	2026-05-14 19:20:28.507207+00
20	11	2	open	submitted	submitted	\N	2026-05-14 19:21:58.624354+00
21	11	5	submitted	in_validation	forwarded	Sim	2026-05-14 19:24:10.068918+00
22	11	5	in_validation	closed	approved	Sim	2026-05-14 19:24:12.554187+00
23	12	2	open	submitted	submitted	\N	2026-05-14 19:29:31.641113+00
24	12	5	submitted	in_validation	forwarded	\N	2026-05-14 19:30:24.934234+00
25	12	5	submitted	in_validation	forwarded	cee	2026-05-14 19:34:06.94691+00
26	13	2	open	submitted	submitted	\N	2026-05-14 19:39:50.445601+00
27	13	5	submitted	in_validation	forwarded	Pode	2026-05-14 19:40:37.833159+00
28	13	6	in_validation	closed	approved	Okay	2026-05-14 19:41:04.901527+00
29	12	6	in_validation	closed	rejected	nao	2026-05-14 20:32:09.313684+00
30	14	2	open	submitted	submitted	\N	2026-05-15 00:01:01.175111+00
31	14	5	submitted	in_validation	forwarded	Pode ir	2026-05-15 00:01:47.972919+00
32	14	6	in_validation	closed	approved	\N	2026-05-15 00:02:19.672505+00
33	15	2	open	submitted	submitted	\N	2026-05-15 10:35:08.948282+00
34	15	3	submitted	in_validation	forwarded	Ola	2026-05-15 10:36:22.192671+00
35	15	6	in_validation	open	send_back	te	2026-05-15 10:37:33.98875+00
36	16	2	open	submitted	submitted	\N	2026-05-15 10:43:58.282626+00
37	16	3	submitted	in_validation	forwarded	sim	2026-05-15 10:45:15.297566+00
38	16	6	in_validation	open	send_back	o	2026-05-15 10:48:36.609377+00
39	17	2	open	submitted	submitted	\N	2026-05-15 11:03:40.111808+00
40	17	5	submitted	in_validation	forwarded	a	2026-05-15 11:04:14.300235+00
41	17	6	in_validation	closed	approved	sim	2026-05-15 11:04:45.433241+00
42	18	2	open	submitted	submitted	\N	2026-05-15 11:24:03.666327+00
43	18	5	submitted	in_validation	forwarded	asda	2026-05-15 11:24:56.51022+00
\.


--
-- TOC entry 4098 (class 0 OID 26162)
-- Dependencies: 262
-- Data for Name: application_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.application_reviews (id, application_id, reviewer_user_id, reviewer_type, decision, comment, reviewed_at) FROM stdin;
1	4	5	service_line_leader	approve	adjaksdj	2026-05-14 14:50:35.723361+00
2	3	5	talent_manager	reject	Não dá	2026-05-14 14:50:56.181022+00
3	5	5	service_line_leader	approve	123123	2026-05-14 14:55:27.390014+00
4	6	5	service_line_leader	approve	132131	2026-05-14 15:21:17.425479+00
5	7	5	service_line_leader	approve	\N	2026-05-14 17:42:42.796992+00
6	8	5	talent_manager	forward	\N	2026-05-14 18:51:05.339783+00
7	8	5	service_line_leader	approve	12	2026-05-14 18:51:08.708076+00
8	9	5	talent_manager	forward	\N	2026-05-14 19:10:32.929617+00
9	9	5	service_line_leader	approve	Sim	2026-05-14 19:10:37.823144+00
10	10	5	talent_manager	forward	\N	2026-05-14 19:20:22.842523+00
11	10	5	service_line_leader	approve	sIM	2026-05-14 19:20:28.507207+00
12	11	5	talent_manager	forward	Sim	2026-05-14 19:24:10.017821+00
13	11	5	service_line_leader	approve	Sim	2026-05-14 19:24:12.554187+00
14	12	5	talent_manager	forward	\N	2026-05-14 19:30:24.884686+00
15	12	5	talent_manager	forward	cee	2026-05-14 19:34:06.90149+00
16	13	5	talent_manager	forward	Pode	2026-05-14 19:40:37.78467+00
17	13	6	service_line_leader	approve	Okay	2026-05-14 19:41:04.901527+00
18	12	6	service_line_leader	reject	nao	2026-05-14 20:32:09.313684+00
19	14	5	talent_manager	forward	Pode ir	2026-05-15 00:01:47.909425+00
20	14	6	service_line_leader	approve	\N	2026-05-15 00:02:19.672505+00
21	15	3	talent_manager	forward	Ola	2026-05-15 10:36:22.054247+00
22	15	6	service_line_leader	send_back	te	2026-05-15 10:37:33.775985+00
23	16	3	talent_manager	forward	sim	2026-05-15 10:45:15.198366+00
24	16	6	service_line_leader	send_back	o	2026-05-15 10:48:36.405557+00
25	17	5	talent_manager	forward	a	2026-05-15 11:04:14.19706+00
26	17	6	service_line_leader	approve	sim	2026-05-15 11:04:45.433241+00
27	18	5	talent_manager	forward	asda	2026-05-15 11:24:56.407231+00
\.


--
-- TOC entry 4066 (class 0 OID 25706)
-- Dependencies: 230
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.areas (id, service_line_id, code, name, description, image_url, is_active, created_at, updated_at) FROM stdin;
1	2	LC	LowCode	\N	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
2	3	DSO	DevSecOps & IT Automation	\N	\N	t	2026-04-12 15:23:08.306811+00	2026-04-12 15:23:08.306811+00
6	7	TM	Talent Management	\N	\N	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
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
4	2	3	closed	approved	adjaksdj	2026-05-14 14:32:31.499503+00	2026-05-14 14:32:39.636976+00	\N	2026-05-14 14:50:35.723361+00	2026-05-14 14:50:35.723361+00
3	2	1	closed	rejected	Não dá	2026-05-14 14:17:38.363115+00	2026-05-14 14:17:46.350263+00	\N	\N	2026-05-14 14:50:56.181022+00
5	2	2	closed	approved	123123	2026-05-14 14:53:56.938671+00	2026-05-14 14:54:19.535703+00	\N	2026-05-14 14:55:27.390014+00	2026-05-14 14:55:27.390014+00
6	2	3	closed	approved	132131	2026-05-14 15:20:05.96499+00	2026-05-14 15:20:18.956886+00	\N	2026-05-14 15:21:17.425479+00	2026-05-14 15:21:17.425479+00
7	2	2	closed	approved	\N	2026-05-14 15:22:45.413484+00	2026-05-14 15:22:48.445227+00	\N	2026-05-14 17:42:42.796992+00	2026-05-14 17:42:42.796992+00
8	2	27	closed	approved	12	2026-05-14 18:46:01.16692+00	2026-05-14 18:46:11.751695+00	\N	2026-05-14 18:51:08.708076+00	2026-05-14 18:51:08.708076+00
9	2	28	closed	approved	Sim	2026-05-14 19:09:53.953498+00	2026-05-14 19:10:01.018794+00	\N	2026-05-14 19:10:37.823144+00	2026-05-14 19:10:37.823144+00
10	3	37	closed	approved	sIM	2026-05-14 19:18:37.622029+00	2026-05-14 19:18:43.164541+00	\N	2026-05-14 19:20:28.507207+00	2026-05-14 19:20:28.507207+00
11	2	27	closed	approved	Sim	2026-05-14 19:21:54.303875+00	2026-05-14 19:21:58.624354+00	\N	2026-05-14 19:24:12.554187+00	2026-05-14 19:24:12.554187+00
13	2	3	closed	approved	Okay	2026-05-14 19:39:46.551521+00	2026-05-14 19:39:50.445601+00	\N	2026-05-14 19:41:04.901527+00	2026-05-14 19:41:04.901527+00
12	2	29	closed	rejected	nao	2026-05-14 19:29:28.160781+00	2026-05-14 19:32:47.611451+00	\N	\N	2026-05-14 20:32:09.313684+00
14	2	3	closed	approved	\N	2026-05-15 00:00:56.305452+00	2026-05-15 00:01:01.175111+00	\N	2026-05-15 00:02:19.672505+00	2026-05-15 00:02:19.672505+00
15	2	28	open	\N	\N	2026-05-15 10:34:57.585893+00	\N	\N	\N	\N
16	2	1	open	\N	\N	2026-05-15 10:43:51.11689+00	\N	\N	\N	\N
17	2	28	closed	approved	sim	2026-05-15 10:44:32.469036+00	2026-05-15 11:03:40.111808+00	\N	2026-05-15 11:04:45.433241+00	2026-05-15 11:04:45.433241+00
18	2	29	in_validation	\N	\N	2026-05-15 11:23:46.320674+00	2026-05-15 11:24:03.666327+00	\N	\N	\N
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
27	33	BDG-LC-D	level	Platina - LowCode	Especialização avançada e liderança em OutSystems	\N	400	f	\N	f	\N	t	2026-05-14 18:35:26.933288+00	2026-05-14 18:35:26.933288+00
28	34	BDG-LC-E	level	Diamante - LowCode	Referência máxima OutSystems na Softinsa	\N	600	f	\N	f	\N	t	2026-05-14 18:35:26.978978+00	2026-05-14 18:35:26.978978+00
29	35	BDG-DSO-A	level	Bronze - DevOps	Fundamentos de DevOps, Git e automação básica	\N	50	f	\N	f	\N	t	2026-05-14 18:35:27.02677+00	2026-05-14 18:35:27.02677+00
30	36	BDG-DSO-C	level	Ouro - DevOps	Arquitetura de plataformas DevSecOps em produção	\N	250	f	\N	f	\N	t	2026-05-14 18:35:27.081293+00	2026-05-14 18:35:27.081293+00
31	37	BDG-DSO-D	level	Platina - DevOps	Liderança técnica DevOps e segurança aplicacional	\N	400	f	\N	f	\N	t	2026-05-14 18:35:27.127807+00	2026-05-14 18:35:27.127807+00
32	38	BDG-DSO-E	level	Diamante - DevOps	Referência máxima DevSecOps na Softinsa	\N	600	f	\N	f	\N	t	2026-05-14 18:35:27.171855+00	2026-05-14 18:35:27.171855+00
33	39	BDG-TM-A	level	Bronze - Talent Management	Fundamentos de recrutamento e selecção	\N	50	f	\N	f	\N	t	2026-05-14 18:35:34.733633+00	2026-05-14 18:35:34.733633+00
34	40	BDG-TM-B	level	Prata - Talent Management	Gestão autónoma de processos de selecção	\N	100	f	\N	f	\N	t	2026-05-14 18:35:34.733633+00	2026-05-14 18:35:34.733633+00
36	42	BDG-TM-D	level	Platina - Talent Management	Liderança de People & Talent Strategy	\N	400	f	\N	f	\N	t	2026-05-14 18:35:34.733633+00	2026-05-14 18:35:34.733633+00
37	43	BDG-TM-E	level	Diamante - Talent Management	Referência máxima em Talent & Culture	\N	600	f	\N	f	\N	t	2026-05-14 18:35:34.733633+00	2026-05-14 18:35:34.733633+00
35	41	BDG-TM-C	level	Ouro - Talent Management	Estratégia de atração de talento sénior	\N	250	f	\N	f	\N	t	2026-05-14 18:35:34.733633+00	2026-05-14 20:56:49.655193+00
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
33	1	D	Especialista	4	Liderança técnica e inovação em LowCode	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
34	1	E	Líder de Conhecimento	5	Referência máxima e evangelismo LowCode	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
35	2	A	Júnior	1	Fundamentos de DevOps e CI/CD	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
36	2	C	Sénior	3	Arquitetura DevSecOps e automação avançada	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
37	2	D	Especialista	4	Liderança de plataformas DevOps e segurança	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
38	2	E	Líder de Conhecimento	5	Referência máxima em DevSecOps	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
39	6	A	Júnior	1	Fundamentos de Talent Management	t	2026-05-14 18:35:26.887851+00	2026-05-14 18:35:26.887851+00
40	6	B	Intermédio	2	Gestão autónoma de processos de selecção	t	2026-05-14 18:35:26.887851+00	2026-05-14 18:35:26.887851+00
41	6	C	Sénior	3	Estratégia de atração de talento	t	2026-05-14 18:35:26.887851+00	2026-05-14 18:35:26.887851+00
42	6	D	Especialista	4	Liderança de equipas e talentos críticos	t	2026-05-14 18:35:26.887851+00	2026-05-14 18:35:26.887851+00
43	6	E	Líder de Conhecimento	5	Visão estratégica de People & Culture	t	2026-05-14 18:35:26.887851+00	2026-05-14 18:35:26.887851+00
\.


--
-- TOC entry 4108 (class 0 OID 26296)
-- Dependencies: 272
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, type, title, message, payload, is_read, sent_at, read_at) FROM stdin;
1	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 1, "application_id": 4}	t	2026-05-14 14:50:35.723361+00	2026-05-14 18:43:18.092668+00
2	2	application_rejected	Candidatura rejeitada	A tua candidatura foi rejeitada. Motivo: Não dá	{"application_id": 3}	t	2026-05-14 14:50:56.181022+00	2026-05-14 18:43:18.092668+00
3	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 2, "application_id": 5}	t	2026-05-14 14:55:27.390014+00	2026-05-14 18:43:18.092668+00
4	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 3, "application_id": 6}	t	2026-05-14 15:21:17.425479+00	2026-05-14 18:43:18.092668+00
5	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 4, "application_id": 7}	t	2026-05-14 17:42:42.796992+00	2026-05-14 18:43:18.092668+00
6	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "13"}	t	2026-05-14 18:43:37.8333+00	2026-05-14 18:44:01.973568+00
7	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "14"}	t	2026-05-14 18:43:38.0493+00	2026-05-14 18:44:01.973568+00
8	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "17"}	t	2026-05-14 18:43:38.300539+00	2026-05-14 18:44:01.973568+00
9	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "18"}	t	2026-05-14 18:43:38.506799+00	2026-05-14 18:44:01.973568+00
10	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 5, "application_id": 8}	t	2026-05-14 18:51:08.708076+00	2026-05-14 19:09:56.232057+00
11	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 6, "application_id": 9}	t	2026-05-14 19:10:37.823144+00	2026-05-14 19:21:43.500257+00
13	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 8, "application_id": 11}	t	2026-05-14 19:24:12.554187+00	2026-05-14 19:29:23.731141+00
15	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 12}	f	2026-05-14 19:34:06.989676+00	\N
14	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 12}	t	2026-05-14 19:34:06.989676+00	2026-05-14 19:34:41.85323+00
17	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 13}	f	2026-05-14 19:40:37.879222+00	\N
16	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 13}	t	2026-05-14 19:40:37.879222+00	2026-05-14 19:40:49.223886+00
18	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 9, "application_id": 13}	t	2026-05-14 19:41:04.901527+00	2026-05-14 19:41:28.805136+00
19	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "15"}	t	2026-05-14 19:42:08.742531+00	2026-05-14 19:42:24.381267+00
20	2	badge_awarded	Conquista desbloqueada!	Desbloqueaste uma nova conquista!	{"achievement_id": "19"}	t	2026-05-14 19:42:09.093972+00	2026-05-14 19:42:24.381267+00
21	2	application_rejected	Candidatura rejeitada	A tua candidatura foi rejeitada. Motivo: nao	{"application_id": 12}	t	2026-05-14 20:32:09.313684+00	2026-05-14 20:32:31.316534+00
23	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 14}	f	2026-05-15 00:01:48.029078+00	\N
22	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 14}	t	2026-05-15 00:01:48.029078+00	2026-05-15 00:02:04.250724+00
24	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 10, "application_id": 14}	t	2026-05-15 00:02:19.672505+00	2026-05-15 00:03:05.007981+00
12	3	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 7, "application_id": 10}	t	2026-05-14 19:20:28.507207+00	2026-05-15 10:35:52.747693+00
26	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 15}	f	2026-05-15 10:36:22.298742+00	\N
25	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 15}	t	2026-05-15 10:36:22.298742+00	2026-05-15 10:36:58.888906+00
28	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 16}	f	2026-05-15 10:45:15.40727+00	\N
27	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 16}	t	2026-05-15 10:45:15.40727+00	2026-05-15 10:48:24.791488+00
29	2	application_send_back	Candidatura devolvida	A tua candidatura foi devolvida para correção. Motivo: o	{"application_id": 16}	t	2026-05-15 10:48:36.710764+00	2026-05-15 11:02:42.258066+00
31	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 17}	f	2026-05-15 11:04:14.399034+00	\N
30	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 17}	t	2026-05-15 11:04:14.399034+00	2026-05-15 11:04:40.285266+00
32	2	application_approved	Badge aprovado	A tua candidatura foi aprovada e o badge foi atribuido.	{"user_badge_id": 11, "application_id": 17}	f	2026-05-15 11:04:45.433241+00	\N
34	4	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 18}	f	2026-05-15 11:24:56.599223+00	\N
33	6	application_forwarded	Nova candidatura para validação	Uma candidatura foi encaminhada para a tua validação final.	{"application_id": 18}	t	2026-05-15 11:24:56.599223+00	2026-05-15 11:25:26.606101+00
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
1	2	3	1	\N	badge_award	250	250	Aprovacao da candidatura 4	2026-05-14 14:50:35.723361+00	5
2	2	2	2	\N	badge_award	100	350	Aprovacao da candidatura 5	2026-05-14 14:55:27.390014+00	5
3	2	3	3	\N	badge_award	250	600	Aprovacao da candidatura 6	2026-05-14 15:21:17.425479+00	5
4	2	2	4	\N	badge_award	100	700	Aprovacao da candidatura 7	2026-05-14 17:42:42.796992+00	5
5	2	\N	\N	13	achievement_bonus	50	750	Conquista: FIRST_BADGE	2026-05-14 18:43:37.783076+00	\N
6	2	\N	\N	14	achievement_bonus	100	850	Conquista: BADGES_3	2026-05-14 18:43:38.006909+00	\N
7	2	\N	\N	18	achievement_bonus	50	900	Conquista: POINTS_500	2026-05-14 18:43:38.465296+00	\N
8	2	27	5	\N	badge_award	400	1300	Aprovacao da candidatura 8	2026-05-14 18:51:08.708076+00	5
9	2	28	6	\N	badge_award	600	1900	Aprovacao da candidatura 9	2026-05-14 19:10:37.823144+00	5
10	3	37	7	\N	badge_award	600	600	Aprovacao da candidatura 10	2026-05-14 19:20:28.507207+00	5
11	2	27	8	\N	badge_award	400	2300	Aprovacao da candidatura 11	2026-05-14 19:24:12.554187+00	5
12	2	3	9	\N	badge_award	250	2550	Aprovacao da candidatura 13	2026-05-14 19:41:04.901527+00	6
13	2	\N	\N	15	achievement_bonus	200	2750	Conquista: BADGES_5	2026-05-14 19:42:08.697924+00	\N
14	2	\N	\N	19	achievement_bonus	150	2900	Conquista: POINTS_1000	2026-05-14 19:42:09.049457+00	\N
15	2	3	10	\N	badge_award	250	3150	Aprovacao da candidatura 14	2026-05-15 00:02:19.672505+00	6
16	2	28	11	\N	badge_award	600	3750	Aprovacao da candidatura 17	2026-05-15 11:04:45.433241+00	6
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
11	33	D1	Certificado OutSystems Architecture	Certificação OutSystems Architecture Specialist.	Submeter certificado com número de registo e data.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
12	33	D2	Projeto de Arquitetura Enterprise	Liderança de arquitetura de projeto OutSystems enterprise em produção.	Submeter diagrama de arquitetura e documento de decisões.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
13	34	E1	Formação Interna (mín. 2 sessões)	Realização de pelo menos 2 sessões de formação interna em OutSystems.	Submeter materiais, registo de participantes e feedback.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
14	34	E2	Contribuição para Comunidade OutSystems	Publicação de artigo, plugin ou contribuição na Forge OutSystems.	Submeter link público da contribuição.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
15	35	A1	Domínio de Git	Contribuição activa em repositório Git com branches e merges.	Submeter link do repositório com histórico de contribuições.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
16	35	A2	Pipeline CI/CD Básico	Criação de pipeline CI (build+test) num projeto real ou de estudo.	Submeter link do repo com o pipeline e screenshot de execução.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
17	36	C1	Arquitetura DevSecOps em Produção	Design de arquitetura completa (CI/CD+security+monitoring) em produção.	Submeter diagrama de arquitetura e evidências de implementação.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
18	36	C2	Certificação Kubernetes (CKA/CKAD) ou equivalente	Certificação cloud/container reconhecida internacionalmente.	Submeter certificado com número de verificação e data.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
19	37	D1	Liderança de Plataforma DevOps	Responsabilidade técnica por plataforma CI/CD usada por múltiplas equipas.	Submeter descrição do âmbito, equipas envolvidas e métricas de adopção.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
20	37	D2	Certificação de Segurança Aplicacional	Certificação em segurança (CSSLP, CEH ou equivalente cloud security).	Submeter certificado com número de registo.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
21	38	E1	Framework DevSecOps Interno	Criação de framework de boas práticas DevSecOps adoptado em toda a empresa.	Submeter documento publicado internamente e evidências de adopção.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
22	38	E2	Mentoria de Equipa DevOps	Mentoria formal de pelo menos 3 colaboradores que atingiram nível B ou superior.	Submeter registo de mentorias e avaliação dos mentorados.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
23	39	A1	Participação em 3 Processos de Recrutamento	Participação activa em pelo menos 3 processos de recrutamento completos.	Submeter relatório com número de candidatos, etapas e resultado.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
24	39	A2	Formação em Recrutamento e Selecção	Curso de formação em RH (mínimo 20h).	Submeter certificado com data e instituição.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
25	40	B1	Gestão Autónoma de 5 Processos	Condução autónoma de pelo menos 5 processos de selecção.	Submeter relatório com métricas de qualidade (time-to-hire, retention).	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
26	40	B2	Contribuição para Employer Branding	Participação na criação de conteúdos de employer branding publicados.	Submeter links dos conteúdos e descrição do contributo.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
27	41	C1	Estratégia de Atração de Talento	Desenvolvimento e implementação de estratégia para área específica.	Submeter documento de estratégia e resultados quantitativos.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
28	41	C2	Certificação SHRM ou equivalente	Certificação internacional em Gestão de RH (SHRM-CP, PHR, ou equivalente).	Submeter certificado com número de registo e entidade emissora.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
29	42	D1	Liderança de Equipa de Recrutamento	Liderança formal de equipa de recrutamento (mín. 3 meses, mín. 2 elementos).	Submeter descrição do papel, composição da equipa e resultados.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
30	42	D2	People Analytics	Criação de dashboard de People Analytics com KPIs de talent management.	Submeter screenshot/export do dashboard e descrição das métricas.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
31	43	E1	Estratégia People & Culture	Definição e implementação de estratégia aprovada pela direcção.	Submeter documento de estratégia e evidências de implementação.	\N	1	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
32	43	E2	Publicação ou Apresentação Reconhecida	Artigo, palestra ou workshop em evento de RH (interno ou externo).	Submeter link/evidência e confirmação de participação.	\N	2	t	2026-05-14 18:38:34.469357+00	2026-05-14 18:38:34.469357+00
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
7	7	STM	Sourcing & Talent Management	Recrutamento, Sourcing e Gestão de Talentos	\N	t	2026-05-14 18:35:13.61277+00	2026-05-14 18:35:13.61277+00
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
1	2	13	{"points": 700, "badge_count": 4}	f	2026-05-14 18:43:37.680467+00
2	2	14	{"points": 700, "badge_count": 4}	f	2026-05-14 18:43:37.924311+00
3	2	17	{"points": 700, "badge_count": 4}	f	2026-05-14 18:43:38.215124+00
4	2	18	{"points": 700, "badge_count": 4}	f	2026-05-14 18:43:38.382438+00
5	2	15	{"points": 2550, "badge_count": 8}	f	2026-05-14 19:42:08.595775+00
6	2	19	{"points": 2550, "badge_count": 8}	f	2026-05-14 19:42:08.960891+00
\.


--
-- TOC entry 4102 (class 0 OID 26202)
-- Dependencies: 266
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_badges (id, user_id, badge_id, source_application_id, awarded_at, expires_at, is_published, rgpd_accepted, rgpd_accepted_at, points_awarded, public_token, linkedin_shared_at, certificate_url, created_at) FROM stdin;
1	2	3	4	2026-05-14 14:50:35.723361+00	\N	f	f	\N	250	299ab9aa8fd83fe8df8626896111f0b96f4a9dfb84d9cf1e	\N	\N	2026-05-14 14:50:35.723361+00
2	2	2	5	2026-05-14 14:55:27.390014+00	\N	f	f	\N	100	20934a97aadf12d354770232e6eea14aa034c608908d3d1f	\N	\N	2026-05-14 14:55:27.390014+00
3	2	3	6	2026-05-14 15:21:17.425479+00	\N	f	f	\N	250	c57890ce2c3d4f70067542d03b5d1c95dd4675a74e29d5d3	\N	\N	2026-05-14 15:21:17.425479+00
5	2	27	8	2026-05-14 18:51:08.708076+00	\N	f	f	\N	400	3de2daafc5dc76c1fb2cd041cde1165db7cc9e0e5dad3ae6	\N	\N	2026-05-14 18:51:08.708076+00
6	2	28	9	2026-05-14 19:10:37.823144+00	\N	f	f	\N	600	3807ef6c8cc16a08bc91e7a375cf9794a225c44961536b48	\N	\N	2026-05-14 19:10:37.823144+00
7	3	37	10	2026-05-14 19:20:28.507207+00	\N	f	f	\N	600	253b8a1692c5a5b187a791138e3fd5e223f13191e5c1255a	\N	\N	2026-05-14 19:20:28.507207+00
8	2	27	11	2026-05-14 19:24:12.554187+00	\N	f	f	\N	400	b4a08b001c8e6868494b5d9cf121998dd066d0676e9559fc	\N	\N	2026-05-14 19:24:12.554187+00
4	2	2	7	2026-05-14 17:42:42.796992+00	\N	t	t	2026-05-14 23:08:52.524144+00	100	d319040cd79da8d64b98e12a18cab72e421825a00c4f3964	\N	\N	2026-05-14 17:42:42.796992+00
10	2	3	14	2026-05-15 00:02:19.672505+00	\N	f	f	\N	250	32b3328821d2add56e8d14064f6d94c9bccef51bcc5251d9	\N	\N	2026-05-15 00:02:19.672505+00
9	2	3	13	2026-05-14 19:41:04.901527+00	\N	t	t	2026-05-15 00:03:26.451119+00	250	b3bc917095a6d040b382bb9778ae1a7236cd7b55bf3ef683	\N	\N	2026-05-14 19:41:04.901527+00
11	2	28	17	2026-05-15 11:04:45.433241+00	\N	f	f	\N	600	b91a78471515e273c99fce14b7216a5c8b56e6f0337f6105	\N	\N	2026-05-15 11:04:45.433241+00
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
5	5	3	t	\N	2026-05-03 15:19:07.609372+00
6	6	4	t	\N	2026-05-03 15:19:07.609372+00
4	4	2	f	\N	2026-05-03 15:19:07.609372+00
7	4	4	t	\N	2026-05-14 17:51:55.03847+00
3	3	2	f	\N	2026-05-03 15:19:07.609372+00
8	3	3	t	\N	2026-05-14 20:56:23.649498+00
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
12	2	f1bb3e62a0ba8dd6b8b81f7a06cd80481d50fd79d14031b360940fd2ca2e5e72ce9918bd0a8ee65259fc906083580398	\N	\N	\N	2026-05-14 14:49:16.302657+00	2026-05-14 14:49:16.302657+00	2026-06-13 14:49:16.302657+00	\N
13	5	3c15c76f533fee6f7a6eada420cbc20765db2bc1ab2997f93878992b61be167dd445d77a80c4ca55440ce0aaeb71c462	\N	\N	\N	2026-05-14 14:49:37.603763+00	2026-05-14 14:49:37.603763+00	2026-06-13 14:49:37.603763+00	\N
14	6	9545d1e8875525280de2ad0e2d9a18b1b4f8d8198595ee5ce0f6fe12d44626a458587f8451e47995f63ad0e4085a7a31	\N	\N	\N	2026-05-14 14:51:11.875273+00	2026-05-14 14:51:11.875273+00	2026-06-13 14:51:11.875273+00	\N
15	2	693959f1d3736e02e0d545add5ade2ecab743f2371a324dd2237ee32971182b409073b888d819f65f0b4945e2a9c43ce	\N	\N	\N	2026-05-14 14:52:18.196465+00	2026-05-14 14:52:18.196465+00	2026-06-13 14:52:18.196465+00	\N
16	5	3d026c8b1b02f7e414c83b40cad547a11f3981c96df9ebfcc2c7d5e0a52762df5d36092fff0e39bbd18a667acecef51f	\N	\N	\N	2026-05-14 14:54:44.529792+00	2026-05-14 14:54:44.529792+00	2026-06-13 14:54:44.529792+00	\N
17	6	c2ff550e1f934741767432244a894556833fb550b1fe0bc6a14dc47752b1d3722e05daf9f030c30eb47fbecfdc7fec72	\N	\N	\N	2026-05-14 14:56:10.76889+00	2026-05-14 14:56:10.76889+00	2026-06-13 14:56:10.76889+00	\N
18	2	b25254ce6dde265f26024e1698ee8176eaf52d5041c1698008bb942c3bb7fb681a75ee9847af57e82b3828cb0b912c2b	\N	\N	\N	2026-05-14 15:18:50.998876+00	2026-05-14 15:18:50.998876+00	2026-06-13 15:18:50.998876+00	\N
19	5	b0b06314637ce8e3b2ffdd7d769cff6df8cffb4d5595a5642e5381a772ba2735bf5a620fdffd8e78998bc97cfb92fb5b	\N	\N	\N	2026-05-14 15:20:41.213929+00	2026-05-14 15:20:41.213929+00	2026-06-13 15:20:41.213929+00	\N
20	6	b628a183ccfda9e57c02c973c1864cd1521a2840e0b7cb7436ff04e742dc06b0a5374031578d41d2a4ba5177b262247b	\N	\N	\N	2026-05-14 15:21:42.486924+00	2026-05-14 15:21:42.486924+00	2026-06-13 15:21:42.486924+00	\N
21	2	aa2676cd9fdeb6945eac2699ec4c0b432a88d040f2f2521bb4e16bb5ead086ab036593f8484d12d300eb62b2f8dbc6b6	\N	\N	\N	2026-05-14 15:22:38.480307+00	2026-05-14 15:22:38.480307+00	2026-06-13 15:22:38.480307+00	\N
22	6	4ec97c34ff49ccb5fdf291b8b4782c7476011285267b9f448be8a9d4fe3970a604906a47bd64ee4d7f485e9765bed5e3	\N	\N	\N	2026-05-14 15:23:00.478742+00	2026-05-14 15:23:00.478742+00	2026-06-13 15:23:00.478742+00	\N
23	5	8e6df3e0d761e5a3243060701d444b0bd0ab69e2f65c277d530dda9c39c39cbb834e58ef62fa53505d100e89969ebcf3	\N	\N	\N	2026-05-14 17:42:07.062878+00	2026-05-14 17:42:07.062878+00	2026-06-13 17:42:07.062878+00	\N
24	6	2eee12e97120b141b0aa95ca6093efaa4608c3eb0d9049ea5c83e0cb2cdb55223f7bba109fc7e3af387b67dfb6432549	\N	\N	\N	2026-05-14 17:43:25.913826+00	2026-05-14 17:43:25.913826+00	2026-06-13 17:43:25.913826+00	\N
25	1	3ec5edbc086c2387219e4320792b1e90f43296cb686936e1415fa99efe096d46a23d95eac454ebe3e67cf42ddc35e5a8	\N	\N	\N	2026-05-14 17:51:18.79153+00	2026-05-14 17:51:18.79153+00	2026-06-13 17:51:18.79153+00	\N
26	2	65aef54b9572a4308084ebface1cd12f25d15096dc2f244c8424cd932e0aa7b62215aace7f8dbb62fdb97d93107938af	\N	\N	\N	2026-05-14 18:41:55.423211+00	2026-05-14 18:41:55.423211+00	2026-06-13 18:41:55.423211+00	\N
27	5	6076a60165e15e50b7d6533cd41063886532536bae624bce57867b5c8c82c88fa6803a0fee9b039458eab87a3f592631	\N	\N	\N	2026-05-14 18:50:21.289643+00	2026-05-14 18:50:21.289643+00	2026-06-13 18:50:21.289643+00	\N
28	6	20ebc1b0ce496fe56b6423d2452e445f351df764309897efd0793b8712b4a9964bcf12f73adc6963aec6586a62ae2755	\N	\N	\N	2026-05-14 18:51:31.725068+00	2026-05-14 18:51:31.725068+00	2026-06-13 18:51:31.725068+00	\N
29	5	7a4dddcdb246bef12c9294ea1b2a9be53c5be00e7200510df1a7980c1a85849720482bff315a03d4e9da8889696d0431	\N	\N	\N	2026-05-14 19:09:19.830564+00	2026-05-14 19:09:19.830564+00	2026-06-13 19:09:19.830564+00	\N
30	2	43f63eecd464f71958fd6187a7b0e171d0c944836faeba50507309eb3ed6d64670b7d98844e9b36fa95e55b01708d037	\N	\N	\N	2026-05-14 19:09:30.747062+00	2026-05-14 19:09:30.747062+00	2026-06-13 19:09:30.747062+00	\N
31	5	d96d83ebee0347c3041f7e8d5ee39791e3f8d9d3772b7874d87401548bd0164295d7d63491002309099f3214abbd6fd9	\N	\N	\N	2026-05-14 19:10:16.730845+00	2026-05-14 19:10:16.730845+00	2026-06-13 19:10:16.730845+00	\N
32	6	4c853c04a58e5b22056a36168f67fc980927ae16115bc03a3821892bb154867f846549bb3e79d966e36b6cd9722cbcc5	\N	\N	\N	2026-05-14 19:10:52.523103+00	2026-05-14 19:10:52.523103+00	2026-06-13 19:10:52.523103+00	\N
33	3	9c3b303af90faa32fddc618f825854e5c5ad9b07e8d23ce23552de5402cad99c91dee4e3d50c690a5b7ec917df72a65d	\N	\N	\N	2026-05-14 19:18:07.421644+00	2026-05-14 19:18:07.421644+00	2026-06-13 19:18:07.421644+00	\N
34	5	2fc0a9cf668493c87d810858e5c233a52d48896b77a535dfdc80d8c448158190fe656d3a05fa2efa83bfe7aefbd7c555	\N	\N	\N	2026-05-14 19:19:10.401429+00	2026-05-14 19:19:10.401429+00	2026-06-13 19:19:10.401429+00	\N
35	6	64915b82731dde50b0318fbf4c5c25c26807d823e847b61fced6577caec5c10745df8ca149186119185364a7b447683d	\N	\N	\N	2026-05-14 19:20:49.317428+00	2026-05-14 19:20:49.317428+00	2026-06-13 19:20:49.317428+00	\N
36	2	10882182028ce5d2110a61b7268cb98ecff7b256c8b011502b94c888e628caa8ed6f0e21bc479e08c8168a61c067b53a	\N	\N	\N	2026-05-14 19:21:39.607119+00	2026-05-14 19:21:39.607119+00	2026-06-13 19:21:39.607119+00	\N
37	6	664c972c8f413923f150815fef03452904daefa40576093615f5f405a50526b3ab551ab07164d9cde37a66fd31573871	\N	\N	\N	2026-05-14 19:22:26.630378+00	2026-05-14 19:22:26.630378+00	2026-06-13 19:22:26.630378+00	\N
38	6	c5d21b34ae9740a075057bb58b81fd3e325e56a38efb9cf24cf2393aad1afde628036fbc9fee74a4c6403a2d5f19fe90	\N	\N	\N	2026-05-14 19:22:50.696756+00	2026-05-14 19:22:50.696756+00	2026-06-13 19:22:50.696756+00	\N
39	6	a752a18294f2713139027d47aa5eea7edb5ed309856d82b2e9d32baa97b161472421afd873395a06914a761c44876ef1	\N	\N	\N	2026-05-14 19:23:03.18274+00	2026-05-14 19:23:03.18274+00	2026-06-13 19:23:03.18274+00	\N
40	5	5349a10b43832e39c4bad5770fadbc8230f5c7f7d39e970dff62f507502c9b45ac025ff6dea4ae6196d0d1b56539c2e9	\N	\N	\N	2026-05-14 19:23:59.965547+00	2026-05-14 19:23:59.965547+00	2026-06-13 19:23:59.965547+00	\N
41	6	818a3853b93f61d5d69823e35c59ff79f9df5dff303c741afa2563177fc827779b2bd4afe07a9dcbd66ad97c40bd770d	\N	\N	\N	2026-05-14 19:24:28.38351+00	2026-05-14 19:24:28.38351+00	2026-06-13 19:24:28.38351+00	\N
42	2	6fbbca907f84f2d06b809cafca91eda1ec468fcd005bfbb57cc76ef827bd6c4fdb81f702fde583aecd93b4341adcacef	\N	\N	\N	2026-05-14 19:29:20.58042+00	2026-05-14 19:29:20.58042+00	2026-06-13 19:29:20.58042+00	\N
43	5	d5ecc59f11ee9d23b48c7e93c020fd3155877d6905f6bb262a7ab133f1346594f0a8ab37021d61be887fafd04adde05f	\N	\N	\N	2026-05-14 19:29:57.751736+00	2026-05-14 19:29:57.751736+00	2026-06-13 19:29:57.751736+00	\N
44	6	69d845fff287342479453550f8a0647c4833a01283a05546d46381ae5534d064f95d18d90a9ad1c98afc1e2e19f4912a	\N	\N	\N	2026-05-14 19:34:38.396156+00	2026-05-14 19:34:38.396156+00	2026-06-13 19:34:38.396156+00	\N
45	6	5a6bbc9ecf16e4fb404078e2da19ce5f041ca80aa08b34e9238aa57a1bbe88bd6628071846ad7dd566b6ad3106ab9dd0	\N	\N	\N	2026-05-14 19:38:35.452971+00	2026-05-14 19:38:35.452971+00	2026-06-13 19:38:35.452971+00	\N
46	2	8b3b80437b439821e19b8e597158367677722b3a8c9f4fa8de0deb6483c517d1bdf22571c51f766a0ba4d2e7b9b49783	\N	\N	\N	2026-05-14 19:39:28.654261+00	2026-05-14 19:39:28.654261+00	2026-06-13 19:39:28.654261+00	\N
47	5	30bd9e4387c693aee6fd0f609e1f0a13349df74261be88d9d3f4b817a4a1007d5a103558337ec6e501edb84f6f69518b	\N	\N	\N	2026-05-14 19:40:20.661421+00	2026-05-14 19:40:20.661421+00	2026-06-13 19:40:20.661421+00	\N
48	6	bd4f801ea4e37a3e7d465bfe59b5832811f60536e49e40cf160a35a9799f5dec1f373229caba8f2b3b1406c67ce15fd7	\N	\N	\N	2026-05-14 19:40:47.110391+00	2026-05-14 19:40:47.110391+00	2026-06-13 19:40:47.110391+00	\N
49	2	6dbb50bc88b08fad362f61d5ee7d82abfb32f35914b57b709760f4269f6e5b203d9641349fe81b84a4720aa28f2dfb4d	\N	\N	\N	2026-05-14 19:41:25.517271+00	2026-05-14 19:41:25.517271+00	2026-06-13 19:41:25.517271+00	\N
50	6	dd17a76d64a3e1dce4209c5b34dfd912ead35ee16adc0c26e5cd5269584b1618e8b3cbdb4f8238058204b0c7cfe218e5	\N	\N	\N	2026-05-14 20:30:24.323586+00	2026-05-14 20:30:24.323586+00	2026-06-13 20:30:24.323586+00	\N
51	6	ece653991f406cac306cfcab4861425492668a0613c36b507a8bb37134227d58692aa7e718bb52c2bde87ce597f138cf	\N	\N	\N	2026-05-14 20:30:36.310911+00	2026-05-14 20:30:36.310911+00	2026-06-13 20:30:36.310911+00	\N
52	5	bc71965693ebe99d9b839d3d3ae65f1c043941dc2ca474acaaa7b306d1be462c735df8698ae3bbd35e4dbbbc5da858df	\N	\N	\N	2026-05-14 20:30:58.197919+00	2026-05-14 20:30:58.197919+00	2026-06-13 20:30:58.197919+00	\N
53	6	d31ad8e99edab1447f8a0b3a00d49a87021a457587c1509deda0fb94a99b3b281d588a726e19ac92bbccf85120615978	\N	\N	\N	2026-05-14 20:31:25.12843+00	2026-05-14 20:31:25.12843+00	2026-06-13 20:31:25.12843+00	\N
54	2	7064d97e4e29d1469109af5ed44c33bf5354fd4d7dcdd9753548bf54fc1c07b654c5e4eeff29af16ab91c738d77b293b	\N	\N	\N	2026-05-14 20:32:29.115221+00	2026-05-14 20:32:29.115221+00	2026-06-13 20:32:29.115221+00	\N
55	1	c1eeed11b79c09ec6bf2171bf72164447194d76e25f4c05976e270b5a1807878ca7214cb9d0d1354ca1295549780f0e0	\N	\N	\N	2026-05-14 20:56:03.220161+00	2026-05-14 20:56:03.220161+00	2026-06-13 20:56:03.220161+00	\N
56	2	fe9f539fff085f328d5820e355810619e2c2828960d32680d59d80018c2383dfb82188982d2ddcb68946222a486abea3	\N	\N	\N	2026-05-14 20:57:35.653904+00	2026-05-14 20:57:35.653904+00	2026-06-13 20:57:35.653904+00	\N
57	2	bdf1be37d20438d62e9105686f07f07385187efe411c5b8de1178afe96bf0972224437b6bc4606c11cf416c411e26327	\N	\N	\N	2026-05-14 23:08:16.556279+00	2026-05-14 23:08:16.556279+00	2026-06-13 23:08:16.556279+00	\N
58	1	c845d69ed0414c09e337cbd51c51e375487bccda7cb157ced2bd063b8897464d8518525ce9dfc528ebf519535e4d08fd	\N	\N	\N	2026-05-14 23:28:09.0184+00	2026-05-14 23:28:09.0184+00	2026-06-13 23:28:09.0184+00	\N
59	5	928e2d8d4a9c759d9d06164416b395476cae81d3fc78eb2d3b074a383e4d84f62a0b853df019618738747df679966bf0	\N	\N	\N	2026-05-14 23:37:36.169362+00	2026-05-14 23:37:36.169362+00	2026-06-13 23:37:36.169362+00	\N
60	5	1ee8dd032dec6428ff1db471607a37b0b8d85972d0df0323dd833b629236fa0428577c64021356d5b7f677252ad33161	\N	\N	\N	2026-05-14 23:39:09.519595+00	2026-05-14 23:39:09.519595+00	2026-06-13 23:39:09.519595+00	\N
61	6	c902e8f930fec15d9245e756c4fe88d8a88b55d981825f8406b100e7d00f3cf625756f185122663420d012181f085338	\N	\N	\N	2026-05-14 23:45:45.916517+00	2026-05-14 23:45:45.916517+00	2026-06-13 23:45:45.916517+00	\N
62	2	949d8a7ced63cdc34cbc4c16603f0edfbbd601b271fd26a1857f406035f5d721f30d55e578473024360fe5040c597a36	\N	\N	\N	2026-05-15 00:00:41.439214+00	2026-05-15 00:00:41.439214+00	2026-06-14 00:00:41.439214+00	\N
63	5	1f72b2b9356467047db01c7ac35895520b469c119ada22a3256e824552f83e6e14b6d4fb57adac76153a98a2be445469	\N	\N	\N	2026-05-15 00:01:23.824094+00	2026-05-15 00:01:23.824094+00	2026-06-14 00:01:23.824094+00	\N
64	6	b153223f429e8ff997df304d281bc1e8c3a71ae4af7c75853d4ff463070fd7aebb9ef56656e81f91f19b2d37696a2019	\N	\N	\N	2026-05-15 00:02:02.526422+00	2026-05-15 00:02:02.526422+00	2026-06-14 00:02:02.526422+00	\N
65	2	88c6de05ee2d71a3e2aee46aa6e2091849f1601f1879ded6ab7c39b4e6a8be0f6ea98bf8c60bef0cd2276eb5f65ec49b	\N	\N	\N	2026-05-15 00:03:02.430539+00	2026-05-15 00:03:02.430539+00	2026-06-14 00:03:02.430539+00	\N
66	2	4f986ac8e4a8e12787eae6d99352c555b9980ef7b2ec085b5da07c3f154d99784c7ac60f5042d62c3902123bb82ef848	\N	\N	\N	2026-05-15 10:33:41.430703+00	2026-05-15 10:33:41.430703+00	2026-06-14 10:33:41.430703+00	\N
67	3	ac60a3e550fedd8ff00a8ead6a000136094a6a6340bf10cfd7bce3d16f446d0ab5febcc9f1c9cbc9e76e5160184b57d9	\N	\N	\N	2026-05-15 10:35:50.558684+00	2026-05-15 10:35:50.558684+00	2026-06-14 10:35:50.558684+00	\N
68	6	6385fd114222ed8ba81f97c2fc4b98a268331094b7ad8837e61502d53fbbc3d4ef0f737d2937f73134b9711f48897c29	\N	\N	\N	2026-05-15 10:36:56.817154+00	2026-05-15 10:36:56.817154+00	2026-06-14 10:36:56.817154+00	\N
69	2	1203851971d52ccf99ad697fdf7b64132511f4374a45192d5b37e26025f44d66f4514e82698ce2e97aabf9b9c540f84e	\N	\N	\N	2026-05-15 10:43:44.667489+00	2026-05-15 10:43:44.667489+00	2026-06-14 10:43:44.667489+00	\N
70	3	09acb2f4c30a46dd25c42159338569fc2ed3f0508de182ef92c61daa7a40d569ce66e2368da5d32314bb58089d43eb07	\N	\N	\N	2026-05-15 10:45:07.733377+00	2026-05-15 10:45:07.733377+00	2026-06-14 10:45:07.733377+00	\N
71	6	c1eeac9bca2cff26cf5a8f4af6263fdc3c309991148669b5bbcd49269177e60691881c3a469d651debb8f3db68556a09	\N	\N	\N	2026-05-15 10:48:21.760176+00	2026-05-15 10:48:21.760176+00	2026-06-14 10:48:21.760176+00	\N
72	6	6b6c1b5ca7fd399ccaba6f7f2635bc592993a4ceb640efcf940390db9089205ac582a8a0fd83459c86f859b4740911a2	\N	\N	\N	2026-05-15 10:57:27.351124+00	2026-05-15 10:57:27.351124+00	2026-06-14 10:57:27.351124+00	\N
73	2	353045ec1ff917d1075e99d7585b06e365aba85c91e155fc91200251187971b9e37233998931c7f335ca852b59a7da51	\N	\N	\N	2026-05-15 11:01:02.185783+00	2026-05-15 11:01:02.185783+00	2026-06-14 11:01:02.185783+00	\N
74	5	d7361b72839f648f1ae29b41ddeef5be74b69db8da4d5c4e657406616ffa9042bc4e48d0fcf56f14c770d3a5bce5337b	\N	\N	\N	2026-05-15 11:02:56.898061+00	2026-05-15 11:02:56.898061+00	2026-06-14 11:02:56.898061+00	\N
75	2	e25817b7e38244ba7990ed7e2592eeb93045190b74d2e5c05e87617f177b32659af63c97cb3f588cf7184f79faacd2e2	\N	\N	\N	2026-05-15 11:03:16.243075+00	2026-05-15 11:03:16.243075+00	2026-06-14 11:03:16.243075+00	\N
76	5	31184965989f33cafd0e45019ba9ad6a8aaf5cb953a87705b17621612e598fbc3b0d0e2e4b50362e05e103a5540bff05	\N	\N	\N	2026-05-15 11:04:05.288298+00	2026-05-15 11:04:05.288298+00	2026-06-14 11:04:05.288298+00	\N
77	6	a238655c780bbc1cf652e269705994e5fdeffffff28408cec60bdbe5e5ecd5c809adcef1e5035f1a112f5c1793065cbc	\N	\N	\N	2026-05-15 11:04:38.730309+00	2026-05-15 11:04:38.730309+00	2026-06-14 11:04:38.730309+00	\N
78	5	3b7efc4223faa333df635f5e995a9cca634a6b1d39c57ca43fafd30a852675f38b6cad9147cb4dd7cb0cf3e937a82806	\N	\N	\N	2026-05-15 11:04:55.669869+00	2026-05-15 11:04:55.669869+00	2026-06-14 11:04:55.669869+00	\N
79	1	fac083287729253917089fa674222080cbe956a87fcd9798263f3ef14881c3681b0380090699cba412085e69202ac2f3	\N	\N	\N	2026-05-15 11:05:15.939091+00	2026-05-15 11:05:15.939091+00	2026-06-14 11:05:15.939091+00	\N
80	2	e605571c60effacbf00915858dcb4bb3638a04ccc63e9016e1bcdbf04ae1a91b6ee5f60db1ac272177de0cb2948a47e3	\N	\N	\N	2026-05-15 11:23:23.322875+00	2026-05-15 11:23:23.322875+00	2026-06-14 11:23:23.322875+00	\N
81	5	41dcd55eebb68ca6ae92006232c2066dd64011bbf3aadee58a189744165abb996287514e64aec0e67ef420e4b52fcbfd	\N	\N	\N	2026-05-15 11:24:36.129636+00	2026-05-15 11:24:36.129636+00	2026-06-14 11:24:36.129636+00	\N
82	6	8c9b641a789088d6e45fe8fd341a6851b247bb9b61ecdef0566f9062215968b2d1598bb2c743e720c1d0e3a6ec381d86	\N	\N	\N	2026-05-15 11:25:21.905015+00	2026-05-15 11:25:21.905015+00	2026-06-14 11:25:21.905015+00	\N
\.


--
-- TOC entry 4078 (class 0 OID 25938)
-- Dependencies: 242
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, language_id, preferred_area_id, full_name, email, password_hash, account_status, email_verified, must_change_password, accepted_rgpd_at, rgpd_policy_id, first_login_at, last_login_at, created_at, updated_at) FROM stdin;
4	\N	2	Victor Rocha	rocha@softinsa.pt	$2a$10$UBBrzWrEXpJBDZlEkSsUq.d1HQZutmLC4gBuwk6.cIjT.CwEN6/2q	active	t	f	\N	\N	\N	\N	2026-05-03 15:19:07.609372+00	2026-05-14 14:35:09.707608+00
3	\N	6	Tiago Santos	santos@softinsa.pt	$2a$10$efEsGTRj3mj.YyH/Oho6JOaqFoB1yqGNQxhPsRaGPl9GkSq0XOFBe	active	t	f	\N	\N	2026-05-14 14:36:42.179032+00	2026-05-15 10:45:07.827363+00	2026-05-03 15:19:07.609372+00	2026-05-15 10:45:07.827363+00
1	\N	\N	Administrador Softinsa	admin@softinsa.pt	$2a$10$OIFwVWfQQ/EhdvKh6RWEFesYfp/9jDDRpVyGld1Sk880n8WQuhXrq	active	t	f	\N	\N	2026-05-03 15:25:55.126629+00	2026-05-15 11:05:16.156415+00	2026-05-03 15:19:07.609372+00	2026-05-15 11:05:16.156415+00
2	\N	1	Francisco Abreu	abreu@softinsa.pt	$2a$10$q2XxnrER.FqyiW1AO2irmu0oe7JttPa47e2XL1XimrhFGWVcKNB9C	active	t	f	\N	\N	2026-05-03 15:24:53.822509+00	2026-05-15 11:23:23.425459+00	2026-05-03 15:19:07.609372+00	2026-05-15 11:23:23.425459+00
5	\N	\N	Daniel Faísca	faisca@softinsa.pt	$2a$10$qX3M.l6Z2R.nTuU/Eik5puNRNQuVnsapBT1YoqNHYie0Uqisypdny	active	t	f	\N	\N	2026-05-03 15:25:54.050571+00	2026-05-15 11:24:36.233231+00	2026-05-03 15:19:07.609372+00	2026-05-15 11:24:36.233231+00
6	\N	2	José Beselga	beselga@softinsa.pt	$2a$10$LpmEEDiyHiEC4A0NcjyLF.NC7jq86qMNxNy7sWmBub5..rJtvZ7XS	active	t	f	\N	\N	2026-05-03 15:25:54.573592+00	2026-05-15 11:25:22.00407+00	2026-05-03 15:19:07.609372+00	2026-05-15 11:25:22.00407+00
\.


--
-- TOC entry 4184 (class 0 OID 0)
-- Dependencies: 237
-- Name: achievement_definitions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.achievement_definitions_id_seq', 19, true);


--
-- TOC entry 4185 (class 0 OID 0)
-- Dependencies: 259
-- Name: application_evidences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_evidences_id_seq', 34, true);


--
-- TOC entry 4186 (class 0 OID 0)
-- Dependencies: 263
-- Name: application_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_history_id_seq', 43, true);


--
-- TOC entry 4187 (class 0 OID 0)
-- Dependencies: 261
-- Name: application_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.application_reviews_id_seq', 27, true);


--
-- TOC entry 4188 (class 0 OID 0)
-- Dependencies: 229
-- Name: areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.areas_id_seq', 7, true);


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

SELECT pg_catalog.setval('public.badge_applications_id_seq', 18, true);


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

SELECT pg_catalog.setval('public.badges_id_seq', 48, true);


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

SELECT pg_catalog.setval('public.info_notices_id_seq', 1, true);


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

SELECT pg_catalog.setval('public.levels_id_seq', 54, true);


--
-- TOC entry 4203 (class 0 OID 0)
-- Dependencies: 271
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 34, true);


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

SELECT pg_catalog.setval('public.point_transactions_id_seq', 16, true);


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

SELECT pg_catalog.setval('public.requirements_id_seq', 32, true);


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

SELECT pg_catalog.setval('public.service_lines_id_seq', 8, true);


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

SELECT pg_catalog.setval('public.user_achievements_id_seq', 6, true);


--
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 265
-- Name: user_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_badges_id_seq', 11, true);


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

SELECT pg_catalog.setval('public.user_roles_id_seq', 8, true);


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 249
-- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_sessions_id_seq', 82, true);


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


-- Completed on 2026-05-15 15:14:40

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

-- Started on 2026-05-15 15:14:40

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
1	2026-05-15 14:14:38.429554+00
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


-- Completed on 2026-05-15 15:14:45

--
-- PostgreSQL database dump complete
--

-- Completed on 2026-05-15 15:14:45

--
-- PostgreSQL database cluster dump complete
--

