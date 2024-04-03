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


-- Expense Types Table
CREATE TABLE IF NOT EXISTS public.expense_type(
    expense_type_id SERIAL PRIMARY KEY,
    expense_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Populate the Expense Types table with initial data
INSERT INTO public.expense_type (expense_type_name) VALUES ('non-essential'), ('essential');

-- Expense Table
CREATE TABLE IF NOT EXISTS public.expense(
    expense_id SERIAL PRIMARY KEY,
    expense_user_id INTEGER NOT NULL,
    expense_type_id INTEGER,
    expense_amount DECIMAL(15, 2) NOT NULL,
    expense_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expense_expense_user_id FOREIGN KEY(expense_user_id) REFERENCES public.user(user_id),
    CONSTRAINT expense_expense_type_id FOREIGN KEY (expense_type_id) REFERENCES public.expense_type(expense_type_id)
);

ALTER TABLE public.expense ADD COLUMN expense_note TEXT;

-- System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    setting_id SERIAL PRIMARY KEY,
    currency_unit CHAR(3) NOT NULL,
    default_language VARCHAR(50) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Populate the System Settings table with initial data including VND
INSERT INTO public.system_settings (currency_unit, default_language) 
VALUES 
    ('USD', 'English'),
    ('VND', 'Vietnamese'),
    ('EUR', 'English')