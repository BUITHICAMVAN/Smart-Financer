-- NAMNING CONVENTION 
CREATE DATABASE smartfinancer; 

-- Create User Table 
CREATE TABLE IF NOT EXISTS public.user(
    user_id SERIAL PRIMARY KEY,
    user_fullname VARCHAR(255),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_email_verified TIMESTAMP(3) DEFAULT NOW(),
    user_password_hash VARCHAR(255),
    user_is_verified BOOLEAN DEFAULT FALSE,
    user_image VARCHAR(255),
    user_currency_unit CHAR(3),
    user_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.user ADD COLUMN user_default_language VARCHAR(20);

ALTER TABLE public.user 
ADD COLUMN IF NOT EXISTS user_need_ratio FLOAT DEFAULT 50.0,
ADD COLUMN IF NOT EXISTS user_want_ratio FLOAT DEFAULT 20.0,
ADD COLUMN IF NOT EXISTS user_saving_ratio FLOAT DEFAULT 30.0,
ADD COLUMN IF NOT EXISTS user_expected_income FLOAT;

-- Account Table
CREATE TABLE IF NOT EXISTS public.account (
    account_id VARCHAR(255) PRIMARY KEY,
    account_user_id INTEGER NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_expires_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT account_account_user_id FOREIGN KEY (account_user_id) 
    REFERENCES public.user(user_id)
);
ALTER TABLE public.account
ADD COLUMN account_language VARCHAR(50),
ADD COLUMN account_currency CHAR(3),
ADD COLUMN account_timezone TIMESTAMP WITH TIME ZONE;

-- Income Types
CREATE TABLE IF NOT EXISTS public.income_type (
    income_type_id SERIAL PRIMARY KEY,
    income_type_name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO public.income_type (income_type_name) VALUES ('Bouygues Company'), ('Private Tutoring'), ('Mentoring Cybersoft');
-- Income Table
CREATE TABLE IF NOT EXISTS public.income(
    income_id SERIAL PRIMARY KEY,
    income_user_id INTEGER NOT NULL,
    income_amount DECIMAL(15, 2) NOT NULL,
    income_type_id INTEGER,
    CONSTRAINT income_income_type_id FOREIGN KEY (income_type_id) REFERENCES public.income_type (income_type_id),
    CONSTRAINT income_income_user_id FOREIGN KEY(income_user_id) REFERENCES public.user(user_id),
    income_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.income ADD COLUMN income_note TEXT;

-- Saving Types
CREATE TABLE IF NOT EXISTS public.saving_type (
    saving_type_id SERIAL PRIMARY KEY,
    saving_type_name VARCHAR(255) NOT NULL
);
INSERT INTO public.saving_type (saving_type_name) VALUES ('Emergency Fund'), ('Housing'), ('Education');
-- Saving Table
CREATE TABLE IF NOT EXISTS public.saving(
    saving_id SERIAL PRIMARY KEY,
    saving_user_id INTEGER NOT NULL,
    saving_amount DECIMAL(15, 2) NOT NULL,
    saving_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saving_type_id INTEGER,
    CONSTRAINT saving_saving_type_id FOREIGN KEY (saving_type_id) REFERENCES public.saving_type (saving_type_id),
    CONSTRAINT saving_saving_user_id FOREIGN KEY (saving_user_id) REFERENCES public.user(user_id)
);

ALTER TABLE public.saving ADD COLUMN saving_note TEXT;


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


-- Due Types Table
CREATE TABLE IF NOT EXISTS public.due_type (
    due_type_id SERIAL PRIMARY KEY,
    due_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Populate the Due Types table with initial data
INSERT INTO public.due_type (due_type_name) VALUES ('receivable'), ('payable');

-- Due Status Table
CREATE TABLE IF NOT EXISTS public.due_status (
    due_status_id SERIAL PRIMARY KEY,
    due_status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Populate the Due Status table with initial data
INSERT INTO public.due_status (due_status_name) VALUES ('paid'), ('pending');

-- Due Table
CREATE TABLE IF NOT EXISTS public.due (
    due_id SERIAL PRIMARY KEY,
    due_user_id INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_details TEXT,
    due_amount DECIMAL(15, 2) NOT NULL,
    due_type_id INTEGER NOT NULL,
    due_status_id INTEGER NOT NULL,
    CONSTRAINT due_due_user_id FOREIGN KEY (due_user_id) REFERENCES public.user(user_id),
    CONSTRAINT due_due_type_id FOREIGN KEY (due_type_id) REFERENCES public.due_type(due_type_id),
    CONSTRAINT due_due_status_id FOREIGN KEY (due_status_id) REFERENCES public.due_status(due_status_id)
);