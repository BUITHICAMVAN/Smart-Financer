-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id integer NOT NULL DEFAULT nextval('user_user_id_seq'::regclass),
    user_fullname character varying(255) COLLATE pg_catalog."default",
    user_email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    user_email_verified timestamp(3) without time zone DEFAULT now(),
    user_password_hash character varying(255) COLLATE pg_catalog."default",
    user_is_verified boolean DEFAULT false,
    user_image character varying(255) COLLATE pg_catalog."default",
    user_currency_unit character(3) COLLATE pg_catalog."default",
    user_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_default_language character varying(20) COLLATE pg_catalog."default",
    user_need_ratio double precision DEFAULT 50.0,
    user_want_ratio double precision DEFAULT 20.0,
    user_saving_ratio double precision DEFAULT 30.0,
    user_expected_income double precision,
    CONSTRAINT user_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_user_email_key UNIQUE (user_email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;

-- Table: public.saving_type

-- DROP TABLE IF EXISTS public.saving_type;

CREATE TABLE IF NOT EXISTS public.saving_type
(
    saving_type_id integer NOT NULL DEFAULT nextval('saving_type_saving_type_id_seq'::regclass),
    saving_type_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT saving_type_pkey PRIMARY KEY (saving_type_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.saving_type
    OWNER to postgres;

-- Table: public.saving

-- DROP TABLE IF EXISTS public.saving;

CREATE TABLE IF NOT EXISTS public.saving
(
    saving_id integer NOT NULL DEFAULT nextval('saving_saving_id_seq'::regclass),
    saving_user_id integer NOT NULL,
    saving_amount numeric(15,2) NOT NULL,
    saving_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    saving_type_id integer,
    saving_note text COLLATE pg_catalog."default",
    CONSTRAINT saving_pkey PRIMARY KEY (saving_id),
    CONSTRAINT saving_saving_type_id FOREIGN KEY (saving_type_id)
        REFERENCES public.saving_type (saving_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT saving_saving_user_id FOREIGN KEY (saving_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.saving
    OWNER to postgres;

-- Table: public.income_type

-- DROP TABLE IF EXISTS public.income_type;

CREATE TABLE IF NOT EXISTS public.income_type
(
    income_type_id integer NOT NULL DEFAULT nextval('income_type_income_type_id_seq'::regclass),
    income_type_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT income_type_pkey PRIMARY KEY (income_type_id),
    CONSTRAINT income_type_income_type_name_key UNIQUE (income_type_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.income_type
    OWNER to postgres;

-- Table: public.income

-- DROP TABLE IF EXISTS public.income;

CREATE TABLE IF NOT EXISTS public.income
(
    income_id integer NOT NULL DEFAULT nextval('income_income_id_seq'::regclass),
    income_user_id integer NOT NULL,
    income_amount numeric(15,2) NOT NULL,
    income_type_id integer,
    income_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    income_note text COLLATE pg_catalog."default",
    CONSTRAINT income_pkey PRIMARY KEY (income_id),
    CONSTRAINT income_income_type_id FOREIGN KEY (income_type_id)
        REFERENCES public.income_type (income_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT income_income_user_id FOREIGN KEY (income_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.income
    OWNER to postgres;

-- Table: public.expense_category

-- DROP TABLE IF EXISTS public.expense_category;

CREATE TABLE IF NOT EXISTS public.expense_category
(
    expense_category_id integer NOT NULL DEFAULT nextval('expense_category_expense_category_id_seq'::regclass),
    expense_category_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT expense_category_pkey PRIMARY KEY (expense_category_id),
    CONSTRAINT expense_category_expense_category_name_key UNIQUE (expense_category_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.expense_category
    OWNER to postgres;

-- Table: public.expense_type

-- DROP TABLE IF EXISTS public.expense_type;

CREATE TABLE IF NOT EXISTS public.expense_type
(
    expense_type_id integer NOT NULL DEFAULT nextval('expense_type_expense_type_id_seq'::regclass),
    expense_type_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    expense_category_id integer,
    CONSTRAINT expense_type_pkey PRIMARY KEY (expense_type_id),
    CONSTRAINT expense_type_expense_type_name_key UNIQUE (expense_type_name),
    CONSTRAINT expense_type_expense_category_id FOREIGN KEY (expense_category_id)
        REFERENCES public.expense_category (expense_category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.expense_type
    OWNER to postgres;

-- Table: public.expense

-- DROP TABLE IF EXISTS public.expense;

CREATE TABLE IF NOT EXISTS public.expense
(
    expense_id integer NOT NULL DEFAULT nextval('expense_expense_id_seq'::regclass),
    expense_user_id integer NOT NULL,
    expense_type_id integer,
    expense_amount numeric(15,2) NOT NULL,
    expense_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expense_note text COLLATE pg_catalog."default",
    CONSTRAINT expense_pkey PRIMARY KEY (expense_id),
    CONSTRAINT expense_expense_type_id FOREIGN KEY (expense_type_id)
        REFERENCES public.expense_type (expense_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT expense_expense_user_id FOREIGN KEY (expense_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.expense
    OWNER to postgres;


-- Table: public.due_type

-- DROP TABLE IF EXISTS public.due_type;

CREATE TABLE IF NOT EXISTS public.due_type
(
    due_type_id integer NOT NULL DEFAULT nextval('due_type_due_type_id_seq'::regclass),
    due_type_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT due_type_pkey PRIMARY KEY (due_type_id),
    CONSTRAINT due_type_due_type_name_key UNIQUE (due_type_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.due_type
    OWNER to postgres;

-- Table: public.due_status

-- DROP TABLE IF EXISTS public.due_status;

CREATE TABLE IF NOT EXISTS public.due_status
(
    due_status_id integer NOT NULL DEFAULT nextval('due_status_due_status_id_seq'::regclass),
    due_status_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT due_status_pkey PRIMARY KEY (due_status_id),
    CONSTRAINT due_status_due_status_name_key UNIQUE (due_status_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.due_status
    OWNER to postgres;

-- Table: public.due

-- DROP TABLE IF EXISTS public.due;

CREATE TABLE IF NOT EXISTS public.due
(
    due_id integer NOT NULL DEFAULT nextval('due_due_id_seq'::regclass),
    due_user_id integer NOT NULL,
    due_date timestamp with time zone NOT NULL,
    due_due_date timestamp with time zone NOT NULL,
    due_details text COLLATE pg_catalog."default",
    due_amount numeric(15,2) NOT NULL,
    due_type_id integer NOT NULL,
    due_status_id integer NOT NULL,
    CONSTRAINT due_pkey PRIMARY KEY (due_id),
    CONSTRAINT due_due_status_id FOREIGN KEY (due_status_id)
        REFERENCES public.due_status (due_status_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT due_due_type_id FOREIGN KEY (due_type_id)
        REFERENCES public.due_type (due_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT due_due_user_id FOREIGN KEY (due_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.due
    OWNER to postgres;

-- Table: public.account

-- DROP TABLE IF EXISTS public.account;

CREATE TABLE IF NOT EXISTS public.account
(
    account_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    account_user_id integer NOT NULL,
    account_type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    account_expires_at timestamp with time zone,
    account_created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    account_language character varying(50) COLLATE pg_catalog."default",
    account_timezone timestamp with time zone,
    CONSTRAINT account_pkey PRIMARY KEY (account_id),
    CONSTRAINT account_account_user_id FOREIGN KEY (account_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.account
    OWNER to postgres;

-- Table: public.forecast

-- DROP TABLE IF EXISTS public.forecast;

CREATE TABLE IF NOT EXISTS public.forecast
(
    forecast_id integer NOT NULL DEFAULT nextval('forecast_forecast_id_seq'::regclass),
    forecast_user_id integer NOT NULL,
    forecast_related_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    forecast_related_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    forecast_month character varying(20) COLLATE pg_catalog."default" NOT NULL,
    forecast_amount numeric(10,2) NOT NULL,
    forecast_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    forecast_updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT forecast_pkey PRIMARY KEY (forecast_id),
    CONSTRAINT forecast_forecast_user_id_fkey FOREIGN KEY (forecast_user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.forecast
    OWNER to postgres;