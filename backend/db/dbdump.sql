SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.account (
    account_id character varying(255) NOT NULL,
    account_user_id integer NOT NULL,
    account_type character varying(255) NOT NULL,
    account_expires_at timestamp with time zone,
    account_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    account_language character varying(50),
    account_timezone timestamp with time zone
);

CREATE TABLE public.budget (
    budget_id integer NOT NULL,
    budget_user_id integer NOT NULL,
    budget_budget_type_id integer NOT NULL,
    budget_related_id integer,
    budget_related_type character varying(20) NOT NULL,
    budget_amount numeric(15,2) NOT NULL,
    budget_date timestamp with time zone NOT NULL,
    budget_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.budget_type (
    budget_type_id integer NOT NULL,
    budget_type_name character varying(50) NOT NULL
);

CREATE TABLE public.due (
    due_id integer NOT NULL,
    due_user_id integer NOT NULL,
    due_date timestamp with time zone NOT NULL,
    due_due_date timestamp with time zone NOT NULL,
    due_details text,
    due_amount numeric(15,2) NOT NULL,
    due_type_id integer NOT NULL,
    due_status_id integer NOT NULL
);

CREATE TABLE public.due_status (
    due_status_id integer NOT NULL,
    due_status_name character varying(50) NOT NULL
);

CREATE TABLE public.due_type (
    due_type_id integer NOT NULL,
    due_type_name character varying(50) NOT NULL
);

CREATE TABLE public.expense (
    expense_id integer NOT NULL,
    expense_user_id integer NOT NULL,
    expense_type_id integer,
    expense_amount numeric(15,2) NOT NULL,
    expense_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expense_note text
);

CREATE TABLE public.expense_category (
    expense_category_id integer NOT NULL,
    expense_category_name character varying(100) NOT NULL
);

CREATE TABLE public.expense_type (
    expense_type_id integer NOT NULL,
    expense_type_name character varying(100) NOT NULL,
    expense_category_id integer
);

CREATE TABLE public.forecast (
    forecast_id integer NOT NULL,
    forecast_user_id integer NOT NULL,
    forecast_related_type character varying(50) NOT NULL,
    forecast_related_id character varying(50) NOT NULL,
    forecast_month character varying(20) NOT NULL,
    forecast_amount numeric(10,2) NOT NULL,
    forecast_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    forecast_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.income (
    income_id integer NOT NULL,
    income_user_id integer NOT NULL,
    income_amount numeric(15,2) NOT NULL,
    income_type_id integer,
    income_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    income_note text
);

CREATE TABLE public.income_type (
    income_type_id integer NOT NULL,
    income_type_name character varying(100) NOT NULL
);

CREATE TABLE public.saving (
    saving_id integer NOT NULL,
    saving_user_id integer NOT NULL,
    saving_amount numeric(15,2) NOT NULL,
    saving_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    saving_type_id integer,
    saving_note text
);

CREATE TABLE public.saving_type (
    saving_type_id integer NOT NULL,
    saving_type_name character varying(255) NOT NULL
);

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    user_fullname character varying(255),
    user_email character varying(255) NOT NULL,
    user_email_verified timestamp(3) without time zone DEFAULT now(),
    user_password_hash character varying(255),
    user_is_verified boolean DEFAULT false,
    user_image character varying(255),
    user_currency_unit character(3),
    user_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_default_language character varying(20),
    user_need_ratio double precision DEFAULT 50.0,
    user_want_ratio double precision DEFAULT 20.0,
    user_saving_ratio double precision DEFAULT 30.0,
    user_expected_income double precision
);

CREATE SEQUENCE public.budget_budget_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.budget_type_budget_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.due_due_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.due_status_due_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.due_type_due_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.expense_category_expense_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.expense_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.expense_type_expense_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.forecast_forecast_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.income_income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.income_type_income_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.saving_saving_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.saving_type_saving_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_budget_id_seq OWNED BY public.budget.budget_id;
ALTER SEQUENCE public.budget_type_budget_type_id_seq OWNED BY public.budget_type.budget_type_id;
ALTER SEQUENCE public.due_due_id_seq OWNED BY public.due.due_id;
ALTER SEQUENCE public.due_status_due_status_id_seq OWNED BY public.due_status.due_status_id;
ALTER SEQUENCE public.due_type_due_type_id_seq OWNED BY public.due_type.due_type_id;
ALTER SEQUENCE public.expense_category_expense_category_id_seq OWNED BY public.expense_category.expense_category_id;
ALTER SEQUENCE public.expense_expense_id_seq OWNED BY public.expense.expense_id;
ALTER SEQUENCE public.expense_type_expense_type_id_seq OWNED BY public.expense_type.expense_type_id;
ALTER SEQUENCE public.forecast_forecast_id_seq OWNED BY public.forecast.forecast_id;
ALTER SEQUENCE public.income_income_id_seq OWNED BY public.income.income_id;
ALTER SEQUENCE public.income_type_income_type_id_seq OWNED BY public.income_type.income_type_id;
ALTER SEQUENCE public.saving_saving_id_seq OWNED BY public.saving.saving_id;
ALTER SEQUENCE public.saving_type_saving_type_id_seq OWNED BY public.saving_type.saving_type_id;
ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;

ALTER TABLE ONLY public.budget ALTER COLUMN budget_id SET DEFAULT nextval('public.budget_budget_id_seq'::regclass);
ALTER TABLE ONLY public.budget_type ALTER COLUMN budget_type_id SET DEFAULT nextval('public.budget_type_budget_type_id_seq'::regclass);
ALTER TABLE ONLY public.due ALTER COLUMN due_id SET DEFAULT nextval('public.due_due_id_seq'::regclass);
ALTER TABLE ONLY public.due_status ALTER COLUMN due_status_id SET DEFAULT nextval('public.due_status_due_status_id_seq'::regclass);
ALTER TABLE ONLY public.due_type ALTER COLUMN due_type_id SET DEFAULT nextval('public.due_type_due_type_id_seq'::regclass);
ALTER TABLE ONLY public.expense ALTER COLUMN expense_id SET DEFAULT nextval('public.expense_expense_id_seq'::regclass);
ALTER TABLE ONLY public.expense_category ALTER COLUMN expense_category_id SET DEFAULT nextval('public.expense_category_expense_category_id_seq'::regclass);
ALTER TABLE ONLY public.expense_type ALTER COLUMN expense_type_id SET DEFAULT nextval('public.expense_type_expense_type_id_seq'::regclass);
ALTER TABLE ONLY public.forecast ALTER COLUMN forecast_id SET DEFAULT nextval('public.forecast_forecast_id_seq'::regclass);
ALTER TABLE ONLY public.income ALTER COLUMN income_id SET DEFAULT nextval('public.income_income_id_seq'::regclass);
ALTER TABLE ONLY public.income_type ALTER COLUMN income_type_id SET DEFAULT nextval('public.income_type_income_type_id_seq'::regclass);
ALTER TABLE ONLY public.saving ALTER COLUMN saving_id SET DEFAULT nextval('public.saving_saving_id_seq'::regclass);
ALTER TABLE ONLY public.saving_type ALTER COLUMN saving_type_id SET DEFAULT nextval('public.saving_type_saving_type_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);

-- Step 1: Create primary key constraints
ALTER TABLE public.account ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);
ALTER TABLE public.budget ADD CONSTRAINT budget_pkey PRIMARY KEY (budget_id);
ALTER TABLE public.budget_type ADD CONSTRAINT budget_type_pkey PRIMARY KEY (budget_type_id);
ALTER TABLE public.due ADD CONSTRAINT due_pkey PRIMARY KEY (due_id);
ALTER TABLE public.due_status ADD CONSTRAINT due_status_pkey PRIMARY KEY (due_status_id);
ALTER TABLE public.due_type ADD CONSTRAINT due_type_pkey PRIMARY KEY (due_type_id);
ALTER TABLE public.expense_category ADD CONSTRAINT expense_category_pkey PRIMARY KEY (expense_category_id);
ALTER TABLE public.expense ADD CONSTRAINT expense_pkey PRIMARY KEY (expense_id);
ALTER TABLE public.expense_type ADD CONSTRAINT expense_type_pkey PRIMARY KEY (expense_type_id);
ALTER TABLE public.forecast ADD CONSTRAINT forecast_pkey PRIMARY KEY (forecast_id);
ALTER TABLE public.income ADD CONSTRAINT income_pkey PRIMARY KEY (income_id);
ALTER TABLE public.income_type ADD CONSTRAINT income_type_pkey PRIMARY KEY (income_type_id);
ALTER TABLE public.saving ADD CONSTRAINT saving_pkey PRIMARY KEY (saving_id);
ALTER TABLE public.saving_type ADD CONSTRAINT saving_type_pkey PRIMARY KEY (saving_type_id);
ALTER TABLE public."user" ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);

-- Step 2: Create unique constraints
ALTER TABLE public.budget_type ADD CONSTRAINT budget_type_budget_type_name_key UNIQUE (budget_type_name);
ALTER TABLE public.due_status ADD CONSTRAINT due_status_due_status_name_key UNIQUE (due_status_name);
ALTER TABLE public.due_type ADD CONSTRAINT due_type_due_type_name_key UNIQUE (due_type_name);
ALTER TABLE public.expense_category ADD CONSTRAINT expense_category_expense_category_name_key UNIQUE (expense_category_name);
ALTER TABLE public.expense_type ADD CONSTRAINT expense_type_expense_type_name_key UNIQUE (expense_type_name);
ALTER TABLE public.income_type ADD CONSTRAINT income_type_income_type_name_key UNIQUE (income_type_name);
ALTER TABLE public."user" ADD CONSTRAINT user_user_email_key UNIQUE (user_email);

-- Step 3: Create foreign key constraints
ALTER TABLE public.account ADD CONSTRAINT account_account_user_id FOREIGN KEY (account_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.budget ADD CONSTRAINT budget_budget_budget_type_id_fkey FOREIGN KEY (budget_budget_type_id) REFERENCES public.budget_type(budget_type_id);
ALTER TABLE public.budget ADD CONSTRAINT budget_budget_user_id_fkey FOREIGN KEY (budget_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.due ADD CONSTRAINT due_due_status_id FOREIGN KEY (due_status_id) REFERENCES public.due_status(due_status_id);
ALTER TABLE public.due ADD CONSTRAINT due_due_type_id FOREIGN KEY (due_type_id) REFERENCES public.due_type(due_type_id);
ALTER TABLE public.due ADD CONSTRAINT due_due_user_id FOREIGN KEY (due_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.expense ADD CONSTRAINT expense_expense_type_id FOREIGN KEY (expense_type_id) REFERENCES public.expense_type(expense_type_id);
ALTER TABLE public.expense ADD CONSTRAINT expense_expense_user_id FOREIGN KEY (expense_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.expense_type ADD CONSTRAINT expense_type_expense_category_id FOREIGN KEY (expense_category_id) REFERENCES public.expense_category(expense_category_id);
ALTER TABLE public.forecast ADD CONSTRAINT forecast_forecast_user_id_fkey FOREIGN KEY (forecast_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.income ADD CONSTRAINT income_income_type_id FOREIGN KEY (income_type_id) REFERENCES public.income_type(income_type_id);
ALTER TABLE public.income ADD CONSTRAINT income_income_user_id FOREIGN KEY (income_user_id) REFERENCES public."user"(user_id);
ALTER TABLE public.saving ADD CONSTRAINT saving_saving_type_id FOREIGN KEY (saving_type_id) REFERENCES public.saving_type(saving_type_id);
ALTER TABLE public.saving ADD CONSTRAINT saving_saving_user_id FOREIGN KEY (saving_user_id) REFERENCES public."user"(user_id);

SELECT pg_catalog.setval('public.budget_budget_id_seq', 21, true);
SELECT pg_catalog.setval('public.budget_type_budget_type_id_seq', 1, true);
SELECT pg_catalog.setval('public.due_due_id_seq', 10, true);
SELECT pg_catalog.setval('public.due_status_due_status_id_seq', 2, true);
SELECT pg_catalog.setval('public.due_type_due_type_id_seq', 2, true);
SELECT pg_catalog.setval('public.expense_category_expense_category_id_seq', 5, true);
SELECT pg_catalog.setval('public.expense_expense_id_seq', 206, true);
SELECT pg_catalog.setval('public.expense_type_expense_type_id_seq', 8, true);
SELECT pg_catalog.setval('public.forecast_forecast_id_seq', 1, false);
SELECT pg_catalog.setval('public.income_income_id_seq', 463, true);
SELECT pg_catalog.setval('public.income_type_income_type_id_seq', 11, true);
SELECT pg_catalog.setval('public.saving_saving_id_seq', 194, true);
SELECT pg_catalog.setval('public.saving_type_saving_type_id_seq', 6, true);
SELECT pg_catalog.setval('public.user_user_id_seq', 14, true);

INSERT INTO public.budget_type (budget_type_id, budget_type_name) VALUES
(1, 'monthly-budget'),
(2, 'yearly-budget'),
(3, 'weekly-budget');

INSERT INTO public.budget (budget_id, budget_user_id, budget_budget_type_id, budget_related_id, budget_related_type, budget_amount, budget_date, budget_created_at) VALUES
(15, 8, 1, 2, 'saving', 400.00, '2024-06-12 00:00:00+07', '2024-06-21 23:53:50.75904+07'),
(8, 8, 1, 2, 'non-essential', 600.00, '2024-06-09 00:00:00+07', '2024-06-21 23:53:50.75904+07'),
(1, 8, 1, 2, 'income', 123.00, '2024-06-21 00:00:00+07', '2024-06-21 17:15:45.313758+07'),
(7, 8, 1, 3, 'income', 50.00, '2024-06-02 00:00:00+07', '2024-06-21 23:53:50.75904+07'),
(9, 8, 1, 1, 'essential', 123.00, '2024-06-09 00:00:00+07', '2024-06-21 23:53:50.75904+07'),
(17, 8, 1, 4, 'saving', 45.00, '2024-05-14 00:00:00+07', '2024-06-21 23:53:50.75904+07'),
(6, 8, 1, 1, 'income', 701.00, '2024-06-01 00:00:00+07', '2024-06-21 23:53:50.75904+07');

INSERT INTO public.due_status (due_status_id, due_status_name) VALUES
(1, 'paid'),
(2, 'pending');

INSERT INTO public.due_type (due_type_id, due_type_name) VALUES
(1, 'receivable'),
(2, 'payable');

INSERT INTO public.due (due_id, due_user_id, due_date, due_due_date, due_details, due_amount, due_type_id, due_status_id) VALUES
(10, 8, '2024-07-16 02:50:20.685+07', '2024-07-16 07:00:00+07', 'Pending def', 14.00, 1, 2),
(9, 8, '2024-07-16 02:50:13.255+07', '2024-07-17 07:00:00+07', 'Freelance SM', 200.00, 2, 2);

INSERT INTO public.expense_category (expense_category_id, expense_category_name) VALUES
(2, 'essentials'),
(1, 'non-essentials');

INSERT INTO public.expense_type (expense_type_id, expense_type_name, expense_category_id) VALUES
(1, 'Renting', 2),
(2, 'Coffee', 1),
(3, 'Leisure Activities', 1),
(4, 'Groceries', 2),
(5, 'Billings', 2),
(6, 'Shopping', 1),
(7, 'Transport', 2);

INSERT INTO public.expense (expense_id, expense_user_id, expense_type_id, expense_amount, expense_created_at, expense_note) VALUES
(33, 8, 1, 131.00, '2024-02-25 08:45:00+07', 'February expense 5'),
(34, 8, 2, 151.00, '2024-02-28 11:20:00+07', 'February expense 6'),
(35, 8, 3, 171.00, '2024-02-12 13:15:00+07', 'February expense 7'),
(36, 8, 4, 191.00, '2024-02-18 10:10:00+07', 'February expense 8'),
(37, 8, 5, 21.00, '2024-02-22 16:05:00+07', 'February expense 9'),
(38, 8, 6, 231.00, '2024-02-28 15:00:00+07', 'February expense 10'),
(17, 8, 1, 67.00, '2024-03-05 20:31:42.004+07', NULL),
(19, 8, 1, 50.00, '2024-01-05 12:00:00+07', 'January expense 1'),
(20, 8, 2, 70.00, '2024-01-10 14:30:00+07', 'January expense 2'),
(39, 8, 7, 52.00, '2024-03-05 12:00:00+07', 'March expense 1'),
(40, 8, 1, 720.00, '2024-03-10 14:30:00+07', 'March expense 2'),
(41, 8, 2, 920.00, '2024-03-15 09:00:00+07', 'March expense 3'),
(2, 7, 2, 470.00, '2024-04-05 20:31:42.004+07', 'Spend less!'),
(3, 8, 1, 100.00, '2024-05-12 17:16:13.822296+07', 'Spend less!!'),
(22, 8, 4, 110.00, '2024-01-20 17:00:00+07', 'January expense 4'),
(23, 8, 5, 12.00, '2024-01-25 08:45:00+07', 'January expense 5'),
(24, 8, 6, 150.00, '2024-01-30 11:20:00+07', 'January expense 6'),
(25, 8, 7, 170.00, '2024-01-12 13:15:00+07', 'January expense 7'),
(26, 8, 1, 190.00, '2024-01-18 10:10:00+07', 'January expense 8'),
(27, 8, 2, 210.00, '2024-01-22 16:05:00+07', 'January expense 9'),
(28, 8, 3, 23.00, '2024-01-28 15:00:00+07', 'January expense 10'),
(29, 8, 4, 51.00, '2024-02-05 12:00:00+07', 'February expense 1'),
(30, 8, 5, 71.00, '2024-02-10 14:30:00+07', 'February expense 2'),
(31, 8, 6, 91.00, '2024-02-15 09:00:00+07', 'February expense 3'),
(32, 8, 7, 110.00, '2024-02-20 17:00:00+07', 'February expense 4'),
(43, 8, 4, 132.00, '2024-03-25 08:45:00+07', 'March expense 5'),
(44, 8, 5, 15.00, '2024-03-30 11:20:00+07', 'March expense 6'),
(45, 8, 6, 172.00, '2024-03-12 13:15:00+07', 'March expense 7'),
(46, 8, 7, 19.00, '2024-03-18 10:10:00+07', 'March expense 8'),
(47, 8, 1, 212.00, '2024-03-22 16:05:00+07', 'March expense 9'),
(48, 8, 2, 23.00, '2024-03-28 15:00:00+07', 'March expense 10'),
(49, 8, 3, 52.00, '2024-04-05 12:00:00+07', 'April expense 1'),
(50, 8, 4, 73.00, '2024-04-10 14:30:00+07', 'April expense 2'),
(51, 8, 5, 93.00, '2024-04-15 09:00:00+07', 'April expense 3'),
(52, 8, 6, 113.00, '2024-04-20 17:00:00+07', 'April expense 4'),
(53, 8, 7, 133.00, '2024-04-25 08:45:00+07', 'April expense 5'),
(54, 8, 1, 152.00, '2024-04-30 11:20:00+07', 'April expense 6'),
(55, 8, 2, 17.00, '2024-04-12 13:15:00+07', 'April expense 7'),
(56, 8, 3, 19.00, '2024-04-18 10:10:00+07', 'April expense 8'),
(57, 8, 4, 213.00, '2024-04-22 16:05:00+07', 'April expense 9'),
(21, 8, 3, 90.00, '2024-01-15 09:00:00+07', 'January expense 3'),
(5, 8, 2, 200.00, '2024-06-09 07:00:00+07', NULL),
(8, 8, 1, 200.00, '2024-06-17 07:00:00+07', NULL),
(9, 8, 2, 124.00, '2024-06-17 07:00:00+07', NULL),
(10, 8, 2, 55.00, '2024-06-21 07:00:00+07', NULL),
(11, 8, 2, 34.00, '2024-05-16 17:16:13.822296+07', NULL),
(12, 8, 1, 45.00, '2024-05-01 17:16:13.822296+07', NULL),
(13, 8, 2, 78.00, '2024-05-16 17:16:13.822296+07', NULL),
(14, 8, 2, 234.00, '2024-05-17 17:16:13.822296+07', NULL),
(15, 8, 1, 44.00, '2024-05-22 17:16:13.822296+07', NULL),
(16, 8, 2, 55.00, '2024-05-14 17:16:13.822296+07', NULL),
(18, 8, 2, 345.00, '2024-04-05 20:31:42.004+07', NULL),
(42, 8, 3, 112.00, '2024-03-20 17:00:00+07', 'March expense 4'),
(58, 8, 5, 233.00, '2024-04-28 15:00:00+07', 'April expense 10'),
(59, 8, 6, 54.00, '2024-05-05 12:00:00+07', 'May expense 1'),
(60, 8, 7, 74.00, '2024-05-10 14:30:00+07', 'May expense 2'),
(61, 8, 1, 94.00, '2024-05-15 09:00:00+07', 'May expense 3'),
(62, 8, 2, 114.00, '2024-05-20 17:00:00+07', 'May expense 4'),
(63, 8, 3, 134.00, '2024-05-25 08:45:00+07', 'May expense 5'),
(64, 8, 4, 154.00, '2024-05-30 11:20:00+07', 'May expense 6'),
(65, 8, 5, 74.00, '2024-05-12 13:15:00+07', 'May expense 7'),
(66, 8, 6, 19.00, '2024-05-18 10:10:00+07', 'May expense 8'),
(67, 8, 7, 21.00, '2024-05-22 16:05:00+07', 'May expense 9'),
(68, 8, 1, 234.00, '2024-05-28 15:00:00+07', 'May expense 10'),
(71, 8, 1, 50.00, '2024-01-15 00:00:00+07', 'Groceries'),
(72, 8, 1, 75.00, '2024-01-20 00:00:00+07', 'Utilities'),
(73, 8, 1, 30.00, '2024-01-25 00:00:00+07', 'Transport'),
(74, 8, 2, 60.00, '2024-01-10 00:00:00+07', 'Dining Out'),
(75, 8, 2, 40.00, '2024-01-18 00:00:00+07', 'Entertainment'),
(76, 8, 2, 25.00, '2024-01-28 00:00:00+07', 'Snacks'),
(77, 8, 3, 90.00, '2024-01-05 00:00:00+07', 'Rent'),
(78, 8, 3, 85.00, '2024-01-15 00:00:00+07', 'Rent'),
(79, 8, 3, 95.00, '2024-01-25 00:00:00+07', 'Rent'),
(80, 8, 4, 45.00, '2024-01-08 00:00:00+07', 'Gym'),
(81, 8, 4, 50.00, '2024-01-18 00:00:00+07', 'Gym'),
(82, 8, 4, 35.00, '2024-01-28 00:00:00+07', 'Gym'),
(83, 8, 5, 55.00, '2024-01-12 00:00:00+07', 'Insurance'),
(84, 8, 5, 60.00, '2024-01-22 00:00:00+07', 'Insurance'),
(85, 8, 5, 50.00, '2024-01-27 00:00:00+07', 'Insurance'),
(86, 8, 6, 70.00, '2024-01-07 00:00:00+07', 'Subscriptions'),
(87, 8, 6, 75.00, '2024-01-17 00:00:00+07', 'Subscriptions'),
(88, 8, 6, 65.00, '2024-01-27 00:00:00+07', 'Subscriptions'),
(89, 8, 7, 20.00, '2024-01-09 00:00:00+07', 'Miscellaneous'),
(90, 8, 7, 30.00, '2024-01-19 00:00:00+07', 'Miscellaneous'),
(91, 8, 7, 25.00, '2024-01-29 00:00:00+07', 'Miscellaneous'),
(92, 8, 1, 55.00, '2024-02-14 00:00:00+07', 'Groceries'),
(93, 8, 1, 80.00, '2024-02-20 00:00:00+07', 'Utilities'),
(94, 8, 1, 35.00, '2024-02-25 00:00:00+07', 'Transport'),
(95, 8, 2, 65.00, '2024-02-10 00:00:00+07', 'Dining Out'),
(96, 8, 2, 45.00, '2024-02-18 00:00:00+07', 'Entertainment'),
(97, 8, 2, 30.00, '2024-02-28 00:00:00+07', 'Snacks'),
(98, 8, 3, 95.00, '2024-02-05 00:00:00+07', 'Rent'),
(99, 8, 3, 90.00, '2024-02-15 00:00:00+07', 'Rent'),
(100, 8, 3, 100.00, '2024-02-25 00:00:00+07', 'Rent'),
(101, 8, 4, 50.00, '2024-02-08 00:00:00+07', 'Gym'),
(102, 8, 4, 55.00, '2024-02-18 00:00:00+07', 'Gym'),
(103, 8, 4, 40.00, '2024-02-28 00:00:00+07', 'Gym'),
(104, 8, 5, 60.00, '2024-02-12 00:00:00+07', 'Insurance'),
(105, 8, 5, 65.00, '2024-02-22 00:00:00+07', 'Insurance'),
(106, 8, 5, 55.00, '2024-02-27 00:00:00+07', 'Insurance'),
(107, 8, 6, 75.00, '2024-02-07 00:00:00+07', 'Subscriptions'),
(108, 8, 6, 80.00, '2024-02-17 00:00:00+07', 'Subscriptions'),
(109, 8, 6, 70.00, '2024-02-27 00:00:00+07', 'Subscriptions'),
(110, 8, 7, 25.00, '2024-02-09 00:00:00+07', 'Miscellaneous'),
(111, 8, 7, 35.00, '2024-02-19 00:00:00+07', 'Miscellaneous'),
(112, 8, 7, 30.00, '2024-02-29 00:00:00+07', 'Miscellaneous'),
(113, 8, 1, 60.00, '2024-03-14 00:00:00+07', 'Groceries'),
(114, 8, 1, 85.00, '2024-03-20 00:00:00+07', 'Utilities'),
(115, 8, 1, 40.00, '2024-03-25 00:00:00+07', 'Transport'),
(116, 8, 2, 70.00, '2024-03-10 00:00:00+07', 'Dining Out'),
(117, 8, 2, 50.00, '2024-03-18 00:00:00+07', 'Entertainment'),
(118, 8, 2, 35.00, '2024-03-28 00:00:00+07', 'Snacks'),
(119, 8, 3, 100.00, '2024-03-05 00:00:00+07', 'Rent'),
(120, 8, 3, 95.00, '2024-03-15 00:00:00+07', 'Rent'),
(121, 8, 3, 105.00, '2024-03-25 00:00:00+07', 'Rent'),
(122, 8, 4, 55.00, '2024-03-08 00:00:00+07', 'Gym'),
(123, 8, 4, 60.00, '2024-03-18 00:00:00+07', 'Gym'),
(124, 8, 4, 45.00, '2024-03-28 00:00:00+07', 'Gym'),
(125, 8, 5, 65.00, '2024-03-12 00:00:00+07', 'Insurance'),
(126, 8, 5, 70.00, '2024-03-22 00:00:00+07', 'Insurance'),
(127, 8, 5, 60.00, '2024-03-27 00:00:00+07', 'Insurance'),
(128, 8, 6, 80.00, '2024-03-07 00:00:00+07', 'Subscriptions'),
(129, 8, 6, 85.00, '2024-03-17 00:00:00+07', 'Subscriptions'),
(130, 8, 6, 75.00, '2024-03-27 00:00:00+07', 'Subscriptions'),
(131, 8, 7, 30.00, '2024-03-09 00:00:00+07', 'Miscellaneous'),
(132, 8, 7, 40.00, '2024-03-19 00:00:00+07', 'Miscellaneous'),
(133, 8, 7, 35.00, '2024-03-29 00:00:00+07', 'Miscellaneous'),
(134, 8, 1, 65.00, '2024-04-14 00:00:00+07', 'Groceries'),
(135, 8, 1, 90.00, '2024-04-20 00:00:00+07', 'Utilities'),
(136, 8, 1, 45.00, '2024-04-25 00:00:00+07', 'Transport'),
(137, 8, 2, 75.00, '2024-04-10 00:00:00+07', 'Dining Out'),
(138, 8, 2, 55.00, '2024-04-18 00:00:00+07', 'Entertainment'),
(139, 8, 2, 40.00, '2024-04-28 00:00:00+07', 'Snacks'),
(140, 8, 3, 105.00, '2024-04-05 00:00:00+07', 'Rent'),
(141, 8, 3, 100.00, '2024-04-15 00:00:00+07', 'Rent'),
(142, 8, 3, 110.00, '2024-04-25 00:00:00+07', 'Rent'),
(143, 8, 4, 60.00, '2024-04-08 00:00:00+07', 'Gym'),
(144, 8, 4, 65.00, '2024-04-18 00:00:00+07', 'Gym'),
(145, 8, 4, 50.00, '2024-04-28 00:00:00+07', 'Gym'),
(146, 8, 5, 70.00, '2024-04-12 00:00:00+07', 'Insurance'),
(147, 8, 5, 75.00, '2024-04-22 00:00:00+07', 'Insurance'),
(148, 8, 5, 65.00, '2024-04-27 00:00:00+07', 'Insurance'),
(149, 8, 6, 85.00, '2024-04-07 00:00:00+07', 'Subscriptions'),
(150, 8, 6, 90.00, '2024-04-17 00:00:00+07', 'Subscriptions'),
(151, 8, 6, 80.00, '2024-04-27 00:00:00+07', 'Subscriptions'),
(152, 8, 7, 35.00, '2024-04-09 00:00:00+07', 'Miscellaneous'),
(153, 8, 7, 45.00, '2024-04-19 00:00:00+07', 'Miscellaneous'),
(154, 8, 7, 40.00, '2024-04-29 00:00:00+07', 'Miscellaneous'),
(155, 8, 1, 70.00, '2024-05-14 00:00:00+07', 'Groceries'),
(156, 8, 1, 95.00, '2024-05-20 00:00:00+07', 'Utilities'),
(157, 8, 1, 50.00, '2024-05-25 00:00:00+07', 'Transport'),
(158, 8, 2, 80.00, '2024-05-10 00:00:00+07', 'Dining Out'),
(159, 8, 2, 60.00, '2024-05-18 00:00:00+07', 'Entertainment'),
(160, 8, 2, 45.00, '2024-05-28 00:00:00+07', 'Snacks'),
(161, 8, 3, 110.00, '2024-05-05 00:00:00+07', 'Rent'),
(162, 8, 3, 105.00, '2024-05-15 00:00:00+07', 'Rent'),
(163, 8, 3, 115.00, '2024-05-25 00:00:00+07', 'Rent'),
(164, 8, 4, 65.00, '2024-05-08 00:00:00+07', 'Gym'),
(165, 8, 4, 70.00, '2024-05-18 00:00:00+07', 'Gym'),
(166, 8, 4, 55.00, '2024-05-28 00:00:00+07', 'Gym'),
(167, 8, 5, 75.00, '2024-05-12 00:00:00+07', 'Insurance'),
(168, 8, 5, 80.00, '2024-05-22 00:00:00+07', 'Insurance'),
(69, 8, 3, 30.00, '2024-06-28 07:00:00+07', NULL),
(169, 8, 5, 70.00, '2024-05-27 00:00:00+07', 'Insurance'),
(170, 8, 6, 90.00, '2024-05-07 00:00:00+07', 'Subscriptions'),
(171, 8, 6, 95.00, '2024-05-17 00:00:00+07', 'Subscriptions'),
(172, 8, 6, 85.00, '2024-05-27 00:00:00+07', 'Subscriptions'),
(173, 8, 7, 40.00, '2024-05-09 00:00:00+07', 'Miscellaneous'),
(174, 8, 7, 50.00, '2024-05-19 00:00:00+07', 'Miscellaneous'),
(175, 8, 7, 45.00, '2024-05-29 00:00:00+07', 'Miscellaneous'),
(176, 8, 1, 75.00, '2024-06-14 00:00:00+07', 'Groceries'),
(177, 8, 1, 100.00, '2024-06-20 00:00:00+07', 'Utilities'),
(178, 8, 1, 55.00, '2024-06-25 00:00:00+07', 'Transport'),
(179, 8, 2, 85.00, '2024-06-10 00:00:00+07', 'Dining Out'),
(180, 8, 2, 65.00, '2024-06-18 00:00:00+07', 'Entertainment'),
(181, 8, 2, 50.00, '2024-06-28 00:00:00+07', 'Snacks'),
(182, 8, 3, 115.00, '2024-06-05 00:00:00+07', 'Rent'),
(183, 8, 3, 110.00, '2024-06-15 00:00:00+07', 'Rent'),
(185, 8, 4, 70.00, '2024-06-08 00:00:00+07', 'Gym'),
(186, 8, 4, 75.00, '2024-06-18 00:00:00+07', 'Gym'),
(187, 8, 4, 60.00, '2024-06-28 00:00:00+07', 'Gym'),
(188, 8, 5, 80.00, '2024-06-12 00:00:00+07', 'Insurance'),
(189, 8, 5, 85.00, '2024-06-22 00:00:00+07', 'Insurance'),
(190, 8, 5, 75.00, '2024-06-27 00:00:00+07', 'Insurance'),
(191, 8, 6, 95.00, '2024-06-07 00:00:00+07', 'Subscriptions'),
(192, 8, 6, 100.00, '2024-06-17 00:00:00+07', 'Subscriptions'),
(193, 8, 6, 90.00, '2024-06-27 00:00:00+07', 'Subscriptions'),
(194, 8, 7, 45.00, '2024-06-09 00:00:00+07', 'Miscellaneous'),
(195, 8, 7, 55.00, '2024-06-19 00:00:00+07', 'Miscellaneous'),
(196, 8, 7, 50.00, '2024-06-29 00:00:00+07', 'Miscellaneous'),
(197, 8, 4, 123.00, '2024-06-30 07:00:00+07', NULL),
(198, 8, 4, 10.00, '2024-06-30 07:00:00+07', NULL),
(206, 8, 2, 2.00, '2024-07-16 07:00:00+07', NULL);

INSERT INTO public.income_type (income_type_id, income_type_name) VALUES
(1, 'Base Salary'),
(2, 'Investments'),
(3, 'Bonus'),
(4, 'Side Hustles'),
(10, 'Freelance USA'),
(11, 'Freelance Japan');

INSERT INTO public.income (income_id, income_user_id, income_amount, income_type_id, income_created_at, income_note) VALUES
(288, 8, 1000.00, 1, '2024-01-10 15:00:00+07', 'Income note 1'),
(289, 8, 1100.00, 1, '2024-01-15 15:00:00+07', 'Income note 2'),
(290, 8, 1200.00, 1, '2024-01-20 15:00:00+07', 'Income note 3'),
(291, 8, 2000.00, 2, '2024-01-10 15:00:00+07', 'Income note 1'),
(292, 8, 2100.00, 2, '2024-01-15 15:00:00+07', 'Income note 2'),
(293, 8, 2200.00, 2, '2024-01-20 15:00:00+07', 'Income note 3'),
(294, 8, 3000.00, 3, '2024-01-10 15:00:00+07', 'Income note 1'),
(295, 8, 3100.00, 3, '2024-01-15 15:00:00+07', 'Income note 2'),
(296, 8, 3200.00, 3, '2024-01-20 15:00:00+07', 'Income note 3'),
(297, 8, 4000.00, 4, '2024-01-10 15:00:00+07', 'Income note 1'),
(298, 8, 4100.00, 4, '2024-01-15 15:00:00+07', 'Income note 2'),
(299, 8, 4200.00, 4, '2024-01-20 15:00:00+07', 'Income note 3'),
(300, 8, 10000.00, 10, '2024-01-10 15:00:00+07', 'Income note 1'),
(301, 8, 10100.00, 10, '2024-01-15 15:00:00+07', 'Income note 2'),
(302, 8, 10200.00, 10, '2024-01-20 15:00:00+07', 'Income note 3'),
(303, 8, 11000.00, 11, '2024-01-10 15:00:00+07', 'Income note 1'),
(304, 8, 11100.00, 11, '2024-01-15 15:00:00+07', 'Income note 2'),
(305, 8, 11200.00, 11, '2024-01-20 15:00:00+07', 'Income note 3'),
(306, 8, 1300.00, 1, '2024-02-10 15:00:00+07', 'Income note 4'),
(307, 8, 1400.00, 1, '2024-02-15 15:00:00+07', 'Income note 5'),
(308, 8, 1500.00, 1, '2024-02-20 15:00:00+07', 'Income note 6'),
(309, 8, 2300.00, 2, '2024-02-10 15:00:00+07', 'Income note 4'),
(310, 8, 2400.00, 2, '2024-02-15 15:00:00+07', 'Income note 5'),
(311, 8, 2500.00, 2, '2024-02-20 15:00:00+07', 'Income note 6'),
(312, 8, 3300.00, 3, '2024-02-10 15:00:00+07', 'Income note 4'),
(313, 8, 3400.00, 3, '2024-02-15 15:00:00+07', 'Income note 5'),
(314, 8, 3500.00, 3, '2024-02-20 15:00:00+07', 'Income note 6'),
(315, 8, 4300.00, 4, '2024-02-10 15:00:00+07', 'Income note 4'),
(316, 8, 4400.00, 4, '2024-02-15 15:00:00+07', 'Income note 5'),
(317, 8, 4500.00, 4, '2024-02-20 15:00:00+07', 'Income note 6'),
(318, 8, 10300.00, 10, '2024-02-10 15:00:00+07', 'Income note 4'),
(319, 8, 10400.00, 10, '2024-02-15 15:00:00+07', 'Income note 5'),
(320, 8, 10500.00, 10, '2024-02-20 15:00:00+07', 'Income note 6'),
(321, 8, 11300.00, 11, '2024-02-10 15:00:00+07', 'Income note 4'),
(322, 8, 11400.00, 11, '2024-02-15 15:00:00+07', 'Income note 5'),
(323, 8, 11500.00, 11, '2024-02-20 15:00:00+07', 'Income note 6'),
(324, 8, 1300.00, 1, '2024-02-10 15:00:00+07', 'Income note 4'),
(325, 8, 1400.00, 1, '2024-02-15 15:00:00+07', 'Income note 5'),
(326, 8, 1500.00, 1, '2024-02-20 15:00:00+07', 'Income note 6'),
(327, 8, 2300.00, 2, '2024-02-10 15:00:00+07', 'Income note 4'),
(328, 8, 2400.00, 2, '2024-02-15 15:00:00+07', 'Income note 5'),
(329, 8, 2500.00, 2, '2024-02-20 15:00:00+07', 'Income note 6'),
(330, 8, 3300.00, 3, '2024-02-10 15:00:00+07', 'Income note 4'),
(331, 8, 3400.00, 3, '2024-02-15 15:00:00+07', 'Income note 5'),
(332, 8, 3500.00, 3, '2024-02-20 15:00:00+07', 'Income note 6'),
(333, 8, 4300.00, 4, '2024-02-10 15:00:00+07', 'Income note 4'),
(334, 8, 4400.00, 4, '2024-02-15 15:00:00+07', 'Income note 5'),
(335, 8, 4500.00, 4, '2024-02-20 15:00:00+07', 'Income note 6'),
(336, 8, 10300.00, 10, '2024-02-10 15:00:00+07', 'Income note 4'),
(337, 8, 10400.00, 10, '2024-02-15 15:00:00+07', 'Income note 5'),
(338, 8, 10500.00, 10, '2024-02-20 15:00:00+07', 'Income note 6'),
(339, 8, 11300.00, 11, '2024-02-10 15:00:00+07', 'Income note 4'),
(340, 8, 11400.00, 11, '2024-02-15 15:00:00+07', 'Income note 5'),
(341, 8, 11500.00, 11, '2024-02-20 15:00:00+07', 'Income note 6'),
(342, 8, 1600.00, 1, '2024-03-10 15:00:00+07', 'Income note 7'),
(343, 8, 1700.00, 1, '2024-03-15 15:00:00+07', 'Income note 8'),
(344, 8, 1800.00, 1, '2024-03-20 15:00:00+07', 'Income note 9'),
(345, 8, 2600.00, 2, '2024-03-10 15:00:00+07', 'Income note 7'),
(346, 8, 2700.00, 2, '2024-03-15 15:00:00+07', 'Income note 8'),
(347, 8, 2800.00, 2, '2024-03-20 15:00:00+07', 'Income note 9'),
(348, 8, 3600.00, 3, '2024-03-10 15:00:00+07', 'Income note 7'),
(349, 8, 3700.00, 3, '2024-03-15 15:00:00+07', 'Income note 8'),
(350, 8, 3800.00, 3, '2024-03-20 15:00:00+07', 'Income note 9'),
(351, 8, 4600.00, 4, '2024-03-10 15:00:00+07', 'Income note 7'),
(352, 8, 4700.00, 4, '2024-03-15 15:00:00+07', 'Income note 8'),
(353, 8, 4800.00, 4, '2024-03-20 15:00:00+07', 'Income note 9'),
(354, 8, 10600.00, 10, '2024-03-10 15:00:00+07', 'Income note 7'),
(355, 8, 10700.00, 10, '2024-03-15 15:00:00+07', 'Income note 8'),
(356, 8, 10800.00, 10, '2024-03-20 15:00:00+07', 'Income note 9'),
(357, 8, 11600.00, 11, '2024-03-10 15:00:00+07', 'Income note 7'),
(358, 8, 11700.00, 11, '2024-03-15 15:00:00+07', 'Income note 8'),
(359, 8, 11800.00, 11, '2024-03-20 15:00:00+07', 'Income note 9'),
(360, 8, 1900.00, 1, '2024-04-10 15:00:00+07', 'Income note 10'),
(361, 8, 2000.00, 1, '2024-04-15 15:00:00+07', 'Income note 11'),
(362, 8, 2100.00, 1, '2024-04-20 15:00:00+07', 'Income note 12'),
(363, 8, 2900.00, 2, '2024-04-10 15:00:00+07', 'Income note 10'),
(364, 8, 3000.00, 2, '2024-04-15 15:00:00+07', 'Income note 11'),
(365, 8, 3100.00, 2, '2024-04-20 15:00:00+07', 'Income note 12'),
(366, 8, 3900.00, 3, '2024-04-10 15:00:00+07', 'Income note 10'),
(367, 8, 4000.00, 3, '2024-04-15 15:00:00+07', 'Income note 11'),
(368, 8, 4100.00, 3, '2024-04-20 15:00:00+07', 'Income note 12'),
(369, 8, 4900.00, 4, '2024-04-10 15:00:00+07', 'Income note 10'),
(370, 8, 5000.00, 4, '2024-04-15 15:00:00+07', 'Income note 11'),
(371, 8, 5100.00, 4, '2024-04-20 15:00:00+07', 'Income note 12'),
(372, 8, 10900.00, 10, '2024-04-10 15:00:00+07', 'Income note 10'),
(373, 8, 11000.00, 10, '2024-04-15 15:00:00+07', 'Income note 11'),
(374, 8, 11100.00, 10, '2024-04-20 15:00:00+07', 'Income note 12'),
(375, 8, 11900.00, 11, '2024-04-10 15:00:00+07', 'Income note 10'),
(376, 8, 12000.00, 11, '2024-04-15 15:00:00+07', 'Income note 11'),
(377, 8, 12100.00, 11, '2024-04-20 15:00:00+07', 'Income note 12'),
(378, 8, 2200.00, 1, '2024-05-10 15:00:00+07', 'Income note 13'),
(379, 8, 2300.00, 1, '2024-05-15 15:00:00+07', 'Income note 14'),
(380, 8, 2400.00, 1, '2024-05-20 15:00:00+07', 'Income note 15'),
(381, 8, 3200.00, 2, '2024-05-10 15:00:00+07', 'Income note 13'),
(382, 8, 3300.00, 2, '2024-05-15 15:00:00+07', 'Income note 14'),
(383, 8, 3400.00, 2, '2024-05-20 15:00:00+07', 'Income note 15'),
(384, 8, 4200.00, 3, '2024-05-10 15:00:00+07', 'Income note 13'),
(385, 8, 4300.00, 3, '2024-05-15 15:00:00+07', 'Income note 14'),
(386, 8, 4400.00, 3, '2024-05-20 15:00:00+07', 'Income note 15'),
(387, 8, 5200.00, 4, '2024-05-10 15:00:00+07', 'Income note 13'),
(388, 8, 5300.00, 4, '2024-05-15 15:00:00+07', 'Income note 14'),
(389, 8, 5400.00, 4, '2024-05-20 15:00:00+07', 'Income note 15'),
(390, 8, 11200.00, 10, '2024-05-10 15:00:00+07', 'Income note 13'),
(391, 8, 11300.00, 10, '2024-05-15 15:00:00+07', 'Income note 14'),
(392, 8, 11400.00, 10, '2024-05-20 15:00:00+07', 'Income note 15'),
(393, 8, 12200.00, 11, '2024-05-10 15:00:00+07', 'Income note 13'),
(394, 8, 12300.00, 11, '2024-05-15 15:00:00+07', 'Income note 14'),
(395, 8, 12400.00, 11, '2024-05-20 15:00:00+07', 'Income note 15'),
(396, 8, 2200.00, 1, '2024-05-10 15:00:00+07', 'Income note 13'),
(397, 8, 2300.00, 1, '2024-05-15 15:00:00+07', 'Income note 14'),
(398, 8, 2400.00, 1, '2024-05-20 15:00:00+07', 'Income note 15'),
(399, 8, 3200.00, 2, '2024-05-10 15:00:00+07', 'Income note 13'),
(400, 8, 3300.00, 2, '2024-05-15 15:00:00+07', 'Income note 14'),
(401, 8, 3400.00, 2, '2024-05-20 15:00:00+07', 'Income note 15'),
(402, 8, 4200.00, 3, '2024-05-10 15:00:00+07', 'Income note 13'),
(403, 8, 4300.00, 3, '2024-05-15 15:00:00+07', 'Income note 14'),
(404, 8, 4400.00, 3, '2024-05-20 15:00:00+07', 'Income note 15'),
(405, 8, 5200.00, 4, '2024-05-10 15:00:00+07', 'Income note 13'),
(406, 8, 5300.00, 4, '2024-05-15 15:00:00+07', 'Income note 14'),
(407, 8, 5400.00, 4, '2024-05-20 15:00:00+07', 'Income note 15'),
(408, 8, 11200.00, 10, '2024-05-10 15:00:00+07', 'Income note 13'),
(409, 8, 11300.00, 10, '2024-05-15 15:00:00+07', 'Income note 14'),
(410, 8, 11400.00, 10, '2024-05-20 15:00:00+07', 'Income note 15'),
(411, 8, 12200.00, 11, '2024-05-10 15:00:00+07', 'Income note 13'),
(412, 8, 12300.00, 11, '2024-05-15 15:00:00+07', 'Income note 14'),
(413, 8, 12400.00, 11, '2024-05-20 15:00:00+07', 'Income note 15'),
(414, 8, 2500.00, 1, '2024-06-10 15:00:00+07', 'Income note 16'),
(415, 8, 2600.00, 1, '2024-06-15 15:00:00+07', 'Income note 17'),
(416, 8, 2700.00, 1, '2024-06-20 15:00:00+07', 'Income note 18'),
(417, 8, 3500.00, 2, '2024-06-10 15:00:00+07', 'Income note 16'),
(418, 8, 3600.00, 2, '2024-06-15 15:00:00+07', 'Income note 17'),
(419, 8, 3700.00, 2, '2024-06-20 15:00:00+07', 'Income note 18'),
(420, 8, 4500.00, 3, '2024-06-10 15:00:00+07', 'Income note 16'),
(421, 8, 4600.00, 3, '2024-06-15 15:00:00+07', 'Income note 17'),
(422, 8, 4700.00, 3, '2024-06-20 15:00:00+07', 'Income note 18'),
(423, 8, 5500.00, 4, '2024-06-10 15:00:00+07', 'Income note 16'),
(424, 8, 5600.00, 4, '2024-06-15 15:00:00+07', 'Income note 17'),
(425, 8, 5700.00, 4, '2024-06-20 15:00:00+07', 'Income note 18'),
(426, 8, 11500.00, 10, '2024-06-10 15:00:00+07', 'Income note 16'),
(427, 8, 11600.00, 10, '2024-06-15 15:00:00+07', 'Income note 17'),
(428, 8, 11700.00, 10, '2024-06-20 15:00:00+07', 'Income note 18'),
(429, 8, 12500.00, 11, '2024-06-10 15:00:00+07', 'Income note 16'),
(430, 8, 12600.00, 11, '2024-06-15 15:00:00+07', 'Income note 17'),
(431, 8, 12700.00, 11, '2024-06-20 15:00:00+07', 'Income note 18'),
(435, 8, 120.00, 2, '2038-07-11 07:00:00+07', 'kaka'),
(456, 8, 13.00, 4, '2033-12-18 07:00:00+07', 'alo'),
(458, 8, 1200.00, 1, '2024-07-16 07:00:00+07', NULL),
(459, 8, 13.00, NULL, '2024-07-17 07:00:00+07', 'freelance heydevs job'),
(460, 8, 15.00, NULL, '2024-07-16 07:00:00+07', NULL),
(461, 8, 145.00, NULL, '2024-07-17 16:43:23.953+07', 'freelance job'),
(462, 8, 89.00, NULL, '2024-07-17 17:55:46.493+07', 'side job'),
(463, 8, 79.00, NULL, '2024-07-17 18:07:29.947+07', 'freelance job');

INSERT INTO public.saving_type (saving_type_id, saving_type_name) VALUES
(1, 'Properties - House'),
(2, 'Retirement Fund'),
(3, 'Emergency Fund'),
(4, 'Savings'),
(6, 'Travel');

INSERT INTO public.saving (saving_id, saving_user_id, saving_amount, saving_created_at, saving_type_id, saving_note) VALUES
(43, 8, 240.00, '2024-03-18 10:10:00+07', 3, 'March saving 8'),
(25, 8, 16.00, '2024-01-28 15:00:00+07', 6, 'January saving 10'),
(7, 8, 200.00, '2024-06-17 07:00:00+07', 2, 'kekke alo alo'),
(8, 8, 200.00, '2024-06-17 07:00:00+07', 4, '20000'),
(12, 8, 35.00, '2024-06-28 02:42:10.315691+07', 4, NULL),
(14, 8, 45.00, '2024-06-28 02:42:10.315691+07', 2, NULL),
(9, 8, 67.00, '2024-05-28 02:41:39.472207+07', 2, NULL),
(10, 8, 45.00, '2024-05-28 02:41:39.472207+07', 4, NULL),
(11, 8, 123.00, '2024-05-28 02:41:39.472207+07', 4, NULL),
(13, 8, 34.00, '2024-05-28 02:42:10.315691+07', 4, NULL),
(15, 8, 23.00, '2024-05-28 02:42:10.315691+07', 2, NULL),
(2, 7, 70.00, '2024-04-05 20:55:43.054+07', 1, 'Saving 50%'),
(4, 8, 123.00, '2024-05-03 07:00:00+07', 2, 'Saving 50%'),
(16, 8, 10.00, '2024-01-05 12:00:00+07', 1, 'January saving 1'),
(17, 8, 15.00, '2024-01-10 14:30:00+07', 2, 'January saving 2'),
(18, 8, 200.00, '2024-01-15 09:00:00+07', 3, 'January saving 3'),
(19, 8, 12.00, '2024-01-20 17:00:00+07', 4, 'January saving 4'),
(20, 8, 18.00, '2024-01-25 08:45:00+07', 6, 'January saving 5'),
(21, 8, 25.00, '2024-01-30 11:20:00+07', 1, 'January saving 6'),
(22, 8, 17.00, '2024-01-12 13:15:00+07', 2, 'January saving 7'),
(23, 8, 22.00, '2024-01-18 10:10:00+07', 3, 'January saving 8'),
(24, 8, 140.00, '2024-01-22 16:05:00+07', 4, 'January saving 9'),
(26, 8, 110.00, '2024-02-05 12:00:00+07', 1, 'February saving 1'),
(27, 8, 160.00, '2024-02-10 14:30:00+07', 2, 'February saving 2'),
(28, 8, 21.00, '2024-02-15 09:00:00+07', 3, 'February saving 3'),
(29, 8, 130.00, '2024-02-20 17:00:00+07', 4, 'February saving 4'),
(30, 8, 19.00, '2024-02-25 08:45:00+07', 6, 'February saving 5'),
(31, 8, 260.00, '2024-02-28 11:20:00+07', 1, 'February saving 6'),
(32, 8, 180.00, '2024-02-12 13:15:00+07', 2, 'February saving 7'),
(33, 8, 23.00, '2024-02-18 10:10:00+07', 3, 'February saving 8'),
(34, 8, 150.00, '2024-02-22 16:05:00+07', 4, 'February saving 9'),
(35, 8, 17.00, '2024-02-28 15:00:00+07', 6, 'February saving 10'),
(36, 8, 12.00, '2024-03-05 12:00:00+07', 1, 'March saving 1'),
(37, 8, 170.00, '2024-03-10 14:30:00+07', 2, 'March saving 2'),
(38, 8, 220.00, '2024-03-15 09:00:00+07', 3, 'March saving 3'),
(39, 8, 14.00, '2024-03-20 17:00:00+07', 4, 'March saving 4'),
(40, 8, 200.00, '2024-03-25 08:45:00+07', 6, 'March saving 5'),
(41, 8, 27.00, '2024-03-30 11:20:00+07', 1, 'March saving 6'),
(42, 8, 190.00, '2024-03-12 13:15:00+07', 2, 'March saving 7'),
(44, 8, 16.00, '2024-03-22 16:05:00+07', 4, 'March saving 9'),
(45, 8, 180.00, '2024-03-28 15:00:00+07', 6, 'March saving 10'),
(46, 8, 130.00, '2024-04-05 12:00:00+07', 1, 'April saving 1'),
(47, 8, 180.00, '2024-04-10 14:30:00+07', 2, 'April saving 2'),
(48, 8, 23.00, '2024-04-15 09:00:00+07', 3, 'April saving 3'),
(49, 8, 15.00, '2024-04-20 17:00:00+07', 4, 'April saving 4'),
(50, 8, 21.00, '2024-04-25 08:45:00+07', 6, 'April saving 5'),
(51, 8, 280.00, '2024-04-30 11:20:00+07', 1, 'April saving 6'),
(52, 8, 200.00, '2024-04-12 13:15:00+07', 2, 'April saving 7'),
(53, 8, 25.00, '2024-04-18 10:10:00+07', 3, 'April saving 8'),
(54, 8, 170.00, '2024-04-22 16:05:00+07', 4, 'April saving 9'),
(55, 8, 190.00, '2024-04-28 15:00:00+07', 6, 'April saving 10'),
(56, 8, 14.00, '2024-05-05 12:00:00+07', 1, 'May saving 1'),
(57, 8, 19.00, '2024-05-10 14:30:00+07', 2, 'May saving 2'),
(58, 8, 240.00, '2024-05-15 09:00:00+07', 3, 'May saving 3'),
(59, 8, 16.00, '2024-05-20 17:00:00+07', 4, 'May saving 4'),
(60, 8, 220.00, '2024-05-25 08:45:00+07', 6, 'May saving 5'),
(61, 8, 29.00, '2024-05-30 11:20:00+07', 1, 'May saving 6'),
(62, 8, 21.00, '2024-05-12 13:15:00+07', 2, 'May saving 7'),
(63, 8, 260.00, '2024-05-18 10:10:00+07', 3, 'May saving 8'),
(64, 8, 180.00, '2024-05-22 16:05:00+07', 4, 'May saving 9'),
(65, 8, 20.00, '2024-05-28 15:00:00+07', 6, 'May saving 10'),
(96, 8, 100.00, '2024-01-05 09:00:00+07', 1, 'Savings January - Emergency Fund'),
(97, 8, 150.00, '2024-01-15 14:00:00+07', 1, 'Savings January - Retirement'),
(98, 8, 200.00, '2024-01-25 19:00:00+07', 1, 'Savings January - Education'),
(99, 8, 250.00, '2024-01-10 10:00:00+07', 2, 'Savings January - Vacation'),
(100, 8, 300.00, '2024-01-20 15:00:00+07', 2, 'Savings January - House'),
(101, 8, 350.00, '2024-01-30 20:00:00+07', 2, 'Savings January - Car'),
(102, 8, 400.00, '2024-01-05 12:00:00+07', 3, 'Savings January - Investment'),
(103, 8, 450.00, '2024-01-15 17:00:00+07', 3, 'Savings January - Business'),
(104, 8, 500.00, '2024-01-25 22:00:00+07', 3, 'Savings January - Stocks'),
(105, 8, 550.00, '2024-01-10 11:00:00+07', 4, 'Savings January - Gift'),
(106, 8, 600.00, '2024-01-20 16:00:00+07', 4, 'Savings January - Lottery'),
(107, 8, 650.00, '2024-01-30 21:00:00+07', 4, 'Savings January - Prize'),
(108, 8, 700.00, '2024-01-05 08:00:00+07', 6, 'Savings January - Insurance'),
(109, 8, 750.00, '2024-01-15 13:00:00+07', 6, 'Savings January - Pension'),
(110, 8, 800.00, '2024-01-25 18:00:00+07', 6, 'Savings January - Healthcare'),
(111, 8, 110.00, '2024-02-05 09:00:00+07', 1, 'Savings February - Emergency Fund'),
(112, 8, 160.00, '2024-02-15 14:00:00+07', 1, 'Savings February - Retirement'),
(113, 8, 210.00, '2024-02-25 19:00:00+07', 1, 'Savings February - Education'),
(114, 8, 260.00, '2024-02-10 10:00:00+07', 2, 'Savings February - Vacation'),
(115, 8, 310.00, '2024-02-20 15:00:00+07', 2, 'Savings February - House'),
(116, 8, 360.00, '2024-02-28 20:00:00+07', 2, 'Savings February - Car'),
(117, 8, 410.00, '2024-02-05 12:00:00+07', 3, 'Savings February - Investment'),
(118, 8, 460.00, '2024-02-15 17:00:00+07', 3, 'Savings February - Business'),
(119, 8, 510.00, '2024-02-25 22:00:00+07', 3, 'Savings February - Stocks'),
(120, 8, 560.00, '2024-02-10 11:00:00+07', 4, 'Savings February - Gift'),
(121, 8, 610.00, '2024-02-20 16:00:00+07', 4, 'Savings February - Lottery'),
(122, 8, 660.00, '2024-02-28 21:00:00+07', 4, 'Savings February - Prize'),
(123, 8, 710.00, '2024-02-05 08:00:00+07', 6, 'Savings February - Insurance'),
(124, 8, 760.00, '2024-02-15 13:00:00+07', 6, 'Savings February - Pension'),
(125, 8, 810.00, '2024-02-25 18:00:00+07', 6, 'Savings February - Healthcare'),
(126, 8, 120.00, '2024-03-05 09:00:00+07', 1, 'Savings March - Emergency Fund'),
(127, 8, 170.00, '2024-03-15 14:00:00+07', 1, 'Savings March - Retirement'),
(128, 8, 220.00, '2024-03-25 19:00:00+07', 1, 'Savings March - Education'),
(129, 8, 270.00, '2024-03-10 10:00:00+07', 2, 'Savings March - Vacation'),
(130, 8, 320.00, '2024-03-20 15:00:00+07', 2, 'Savings March - House'),
(131, 8, 370.00, '2024-03-30 20:00:00+07', 2, 'Savings March - Car'),
(132, 8, 420.00, '2024-03-05 12:00:00+07', 3, 'Savings March - Investment'),
(133, 8, 470.00, '2024-03-15 17:00:00+07', 3, 'Savings March - Business'),
(134, 8, 520.00, '2024-03-25 22:00:00+07', 3, 'Savings March - Stocks'),
(135, 8, 570.00, '2024-03-10 11:00:00+07', 4, 'Savings March - Gift'),
(136, 8, 620.00, '2024-03-20 16:00:00+07', 4, 'Savings March - Lottery'),
(137, 8, 670.00, '2024-03-30 21:00:00+07', 4, 'Savings March - Prize'),
(138, 8, 720.00, '2024-03-05 08:00:00+07', 6, 'Savings March - Insurance'),
(139, 8, 770.00, '2024-03-15 13:00:00+07', 6, 'Savings March - Pension'),
(140, 8, 820.00, '2024-03-25 18:00:00+07', 6, 'Savings March - Healthcare'),
(141, 8, 130.00, '2024-04-05 09:00:00+07', 1, 'Savings April - Emergency Fund'),
(142, 8, 180.00, '2024-04-15 14:00:00+07', 1, 'Savings April - Retirement'),
(143, 8, 230.00, '2024-04-25 19:00:00+07', 1, 'Savings April - Education'),
(144, 8, 280.00, '2024-04-10 10:00:00+07', 2, 'Savings April - Vacation'),
(145, 8, 330.00, '2024-04-20 15:00:00+07', 2, 'Savings April - House'),
(146, 8, 380.00, '2024-04-30 20:00:00+07', 2, 'Savings April - Car'),
(147, 8, 430.00, '2024-04-05 12:00:00+07', 3, 'Savings April - Investment'),
(148, 8, 480.00, '2024-04-15 17:00:00+07', 3, 'Savings April - Business'),
(149, 8, 530.00, '2024-04-25 22:00:00+07', 3, 'Savings April - Stocks'),
(150, 8, 580.00, '2024-04-10 11:00:00+07', 4, 'Savings April - Gift'),
(151, 8, 630.00, '2024-04-20 16:00:00+07', 4, 'Savings April - Lottery'),
(152, 8, 680.00, '2024-04-30 21:00:00+07', 4, 'Savings April - Prize'),
(153, 8, 730.00, '2024-04-05 08:00:00+07', 6, 'Savings April - Insurance'),
(154, 8, 780.00, '2024-04-15 13:00:00+07', 6, 'Savings April - Pension'),
(155, 8, 830.00, '2024-04-25 18:00:00+07', 6, 'Savings April - Healthcare'),
(156, 8, 140.00, '2024-05-05 09:00:00+07', 1, 'Savings May - Emergency Fund'),
(157, 8, 190.00, '2024-05-15 14:00:00+07', 1, 'Savings May - Retirement'),
(158, 8, 240.00, '2024-05-25 19:00:00+07', 1, 'Savings May - Education'),
(159, 8, 290.00, '2024-05-10 10:00:00+07', 2, 'Savings May - Vacation'),
(160, 8, 340.00, '2024-05-20 15:00:00+07', 2, 'Savings May - House'),
(161, 8, 390.00, '2024-05-30 20:00:00+07', 2, 'Savings May - Car'),
(162, 8, 440.00, '2024-05-05 12:00:00+07', 3, 'Savings May - Investment'),
(163, 8, 490.00, '2024-05-15 17:00:00+07', 3, 'Savings May - Business'),
(164, 8, 540.00, '2024-05-25 22:00:00+07', 3, 'Savings May - Stocks'),
(165, 8, 590.00, '2024-05-10 11:00:00+07', 4, 'Savings May - Gift'),
(166, 8, 640.00, '2024-05-20 16:00:00+07', 4, 'Savings May - Lottery'),
(167, 8, 690.00, '2024-05-30 21:00:00+07', 4, 'Savings May - Prize'),
(168, 8, 740.00, '2024-05-05 08:00:00+07', 6, 'Savings May - Insurance'),
(169, 8, 790.00, '2024-05-15 13:00:00+07', 6, 'Savings May - Pension'),
(170, 8, 840.00, '2024-05-25 18:00:00+07', 6, 'Savings May - Healthcare'),
(171, 8, 60.00, '2024-06-07 00:00:00+07', 1, 'Emergency Fund'),
(172, 8, 65.00, '2024-06-17 00:00:00+07', 1, 'Emergency Fund'),
(173, 8, 70.00, '2024-06-27 00:00:00+07', 1, 'Emergency Fund'),
(174, 8, 75.00, '2024-06-08 00:00:00+07', 2, 'Retirement'),
(175, 8, 80.00, '2024-06-18 00:00:00+07', 2, 'Retirement'),
(176, 8, 85.00, '2024-06-28 00:00:00+07', 2, 'Retirement'),
(177, 8, 55.00, '2024-06-09 00:00:00+07', 3, 'Vacation Savings'),
(178, 8, 60.00, '2024-06-19 00:00:00+07', 3, 'Vacation Savings'),
(179, 8, 65.00, '2024-06-29 00:00:00+07', 3, 'Vacation Savings'),
(180, 8, 50.00, '2024-06-10 00:00:00+07', 4, 'Home Improvement'),
(181, 8, 55.00, '2024-06-20 00:00:00+07', 4, 'Home Improvement'),
(182, 8, 60.00, '2024-06-30 00:00:00+07', 4, 'Home Improvement'),
(183, 8, 45.00, '2024-06-11 00:00:00+07', 6, 'College Fund'),
(184, 8, 50.00, '2024-06-21 00:00:00+07', 6, 'College Fund'),
(185, 8, 55.00, '2024-06-30 00:00:00+07', 6, 'College Fund'),
(186, 8, 20.00, '2024-06-30 07:00:00+07', 3, 'huhu'),
(187, 8, 20.00, '2024-06-30 07:00:00+07', 6, 'haha'),
(188, 8, 30.00, '2024-06-30 07:00:00+07', 4, 'hahahaha aaa'),
(193, 8, 20.00, '2024-07-17 07:00:00+07', NULL),
(194, 8, 19.00, '2024-07-16 07:00:00+07', NULL);

INSERT INTO public."user" (user_id, user_fullname, user_email, user_email_verified, user_password_hash, user_is_verified, user_image, user_currency_unit, user_created_at, user_default_language, user_need_ratio, user_want_ratio, user_saving_ratio, user_expected_income) VALUES
(8, 'Bui Cam Van', 'buicamvan.work@gmail.com', '2024-04-30 01:59:01.587', '$2b$15$V0rDAr4CA7Q3wQGEFHBFeelG.lmdClXOEnVl8Nv4oMowHvois.fte', 'f', 'https://i.pravatar.cc/300', 'USD', '2024-04-30 01:59:01.587244+07', 'Vietnamese', 50, 20, 30, 500),
(14, 'Huỳnh Tấn Thiên', 'huynhtanthien@gmail.com', '2024-07-11 08:45:49.212', NULL, 'f', 'http://placeimg.com/640/480/people', 'VND', '2024-07-11 15:45:49.212+07', 'Vietnamese', 40, 30, 30, 14000000),
(1, 'Bui Thi Cam Van', 'buivancam02@gmail.com', '2024-04-04 14:13:17.807', '$2y$10$tV4e.hMHMK945i3q0fPMh.HRcf0Wyft0E1FlnoT7PAFJm2Nn/ILWu', 'f', 'https://i.pravatar.cc/300', 'VND', '2024-04-04 21:13:17.807+07', 'Vietnamese', 50, 20, 30, NULL),
(4, 'Nguyen Thi Tham', 'ngTham@gmail.com', '2024-04-05 11:56:58.123', '$2a$15$jphmRfWM7o8iHdFGZZ7SP.PJC/KnMjepgWFY61KWLVN/d/HYROZxm', 'f', 'https://i.pravatar.cc/300', 'VND', '2024-04-05 18:56:58.123+07', 'Vietnamese', 50, 20, 30, NULL),
(5, 'Tran Nguyen Trung Quan', 'ngoclinh@gmail.com', '2024-04-05 11:58:57.086', '$2a$15$279BjUWHv6.O8lixqUthnOoWdv.tiyMRHXW6JKwA4RLK7YeraC3fi', 'f', 'https://i.pravatar.cc/300', 'VND', '2024-04-05 18:58:57.086+07', 'Vietnamese', 50, 20, 30, NULL),
(7, 'Han Ngoc Linh', 'ngoclinh1412@gmail.com', '2024-04-05 12:10:10.76', '$2a$15$F4R7N099AmR4rRTk6kbF6.jCzZZOLhBQigXTElEhhvKXWMLv74IWW', 'f', 'https://i.pravatar.cc/300', 'USD', '2024-04-05 19:10:10.76+07', 'English', 50, 20, 30, NULL),
(9, 'Alda_Jakubowski40', 'Donald10@yahoo.com', '2024-05-04 03:25:40.423', '$2b$15$qLtuXOh3deKdFXExOwvuOeqeMfcQBql2aiXX9LktDhv4P3Zi4LXs6', 'f', 'https://i.pravatar.cc/300', 'USD', '2024-05-04 10:25:40.423+07', 'English', 50, 20, 30, NULL),
(10, 'Tuyet Hong', 'tuyethong@gmail.com', '2024-05-29 09:37:42.707', NULL, 'f', 'https://i.pravatar.cc/300', 'USD', '2024-05-29 16:37:42.707+07', NULL, 50, 20, 30, NULL),
(11, 'Quynh Hoa', 'quynhhoa@gmail.com', '2024-05-29 09:42:16.129', NULL, 'f', 'https://i.pravatar.cc/300', 'USD', '2024-05-29 16:42:16.129+07', NULL, 50, 20, 30, NULL),
(12, 'Chris Lebsack', 'Giuseppe32@gmail.com', '2024-05-29 09:45:36.418', NULL, 'f', 'http://placeimg.com/640/480/people', 'USD', '2024-05-29 16:45:36.418+07', NULL, 50, 20, 30, NULL),
(13, 'Ismael Weber', 'Eve.Luettgen@hotmail.com', '2024-05-29 09:46:58.934', NULL, 'f', 'http://placeimg.com/640/480/people', 'USD', '2024-05-29 16:46:58.934+07', 'English', 40, 30, 30, 5000);
