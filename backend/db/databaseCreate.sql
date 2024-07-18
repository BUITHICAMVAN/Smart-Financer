-- NAMING CONVENTION 
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
    user_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_default_language VARCHAR(20),
    user_need_ratio FLOAT DEFAULT 50.0,
    user_want_ratio FLOAT DEFAULT 20.0,
    user_saving_ratio FLOAT DEFAULT 30.0,
    user_expected_income FLOAT
);

-- Create Account Table
CREATE TABLE IF NOT EXISTS public.account (
    account_id VARCHAR(255) PRIMARY KEY,
    account_user_id INTEGER NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_expires_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    account_language VARCHAR(50),
    account_currency CHAR(3),
    account_timezone TIMESTAMP WITH TIME ZONE,
    CONSTRAINT account_account_user_id FOREIGN KEY (account_user_id) 
    REFERENCES public.user(user_id)
);

-- Create Income Types Table
CREATE TABLE IF NOT EXISTS public.income_type (
    income_type_id SERIAL PRIMARY KEY,
    income_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Income Table
CREATE TABLE IF NOT EXISTS public.income(
    income_id SERIAL PRIMARY KEY,
    income_user_id INTEGER NOT NULL,
    income_amount DECIMAL(15, 2) NOT NULL,
    income_type_id INTEGER,
    income_note TEXT,
    income_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT income_income_type_id FOREIGN KEY (income_type_id) REFERENCES public.income_type (income_type_id),
    CONSTRAINT income_income_user_id FOREIGN KEY(income_user_id) REFERENCES public.user(user_id)
);

-- Create Saving Types Table
CREATE TABLE IF NOT EXISTS public.saving_type (
    saving_type_id SERIAL PRIMARY KEY,
    saving_type_name VARCHAR(255) NOT NULL
);
INSERT INTO public.saving_type (saving_type_name) VALUES ('Emergency Fund'), ('Housing'), ('Education');

-- Create Saving Table
CREATE TABLE IF NOT EXISTS public.saving(
    saving_id SERIAL PRIMARY KEY,
    saving_user_id INTEGER NOT NULL,
    saving_amount DECIMAL(15, 2) NOT NULL,
    saving_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saving_type_id INTEGER,
    saving_note TEXT,
    CONSTRAINT saving_saving_type_id FOREIGN KEY (saving_type_id) REFERENCES public.saving_type (saving_type_id),
    CONSTRAINT saving_saving_user_id FOREIGN KEY (saving_user_id) REFERENCES public.user(user_id)
);

-- Create Expense Types Table
CREATE TABLE IF NOT EXISTS public.expense_type(
    expense_type_id SERIAL PRIMARY KEY,
    expense_type_name VARCHAR(100) NOT NULL UNIQUE
);
-- Populate the Expense Types table with initial data
INSERT INTO public.expense_type (expense_type_name) VALUES ('non-essential'), ('essential');

-- Create Expense Table
CREATE TABLE IF NOT EXISTS public.expense(
    expense_id SERIAL PRIMARY KEY,
    expense_user_id INTEGER NOT NULL,
    expense_type_id INTEGER,
    expense_amount DECIMAL(15, 2) NOT NULL,
    expense_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expense_note TEXT,
    expense_category VARCHAR(50),
    CONSTRAINT expense_expense_user_id FOREIGN KEY(expense_user_id) REFERENCES public.user(user_id),
    CONSTRAINT expense_expense_type_id FOREIGN KEY (expense_type_id) REFERENCES public.expense_type(expense_type_id)
);
