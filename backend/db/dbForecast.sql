-- Table: public.user
CREATE TABLE IF NOT EXISTS public.user
(
    user_id SERIAL PRIMARY KEY,
    user_fullname VARCHAR(255),
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_email_verified TIMESTAMP DEFAULT now(),
    user_password_hash VARCHAR(255),
    user_is_verified BOOLEAN DEFAULT false,
    user_image VARCHAR(255),
    user_currency_unit CHAR(3),
    user_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_default_language VARCHAR(20),
    user_need_ratio DOUBLE PRECISION DEFAULT 50.0,
    user_want_ratio DOUBLE PRECISION DEFAULT 20.0,
    user_saving_ratio DOUBLE PRECISION DEFAULT 30.0,
    user_expected_income DOUBLE PRECISION
);

-- Table: public.saving_type
CREATE TABLE IF NOT EXISTS public.saving_type
(
    saving_type_id SERIAL PRIMARY KEY,
    saving_type_name VARCHAR(255) NOT NULL
);

-- Table: public.saving
CREATE TABLE IF NOT EXISTS public.saving
(
    saving_id SERIAL PRIMARY KEY,
    saving_user_id INTEGER NOT NULL,
    saving_amount NUMERIC(15,2) NOT NULL,
    saving_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    saving_type_id INTEGER,
    saving_note TEXT,
    saving_historical BOOLEAN DEFAULT false,
    FOREIGN KEY (saving_type_id) REFERENCES public.saving_type (saving_type_id),
    FOREIGN KEY (saving_user_id) REFERENCES public."user" (user_id)
);

-- Table: public.income_type
CREATE TABLE IF NOT EXISTS public.income_type
(
    income_type_id SERIAL PRIMARY KEY,
    income_type_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table: public.income
CREATE TABLE IF NOT EXISTS public.income
(
    income_id SERIAL PRIMARY KEY,
    income_user_id INTEGER NOT NULL,
    income_amount NUMERIC(15,2) NOT NULL,
    income_type_id INTEGER,
    income_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    income_note TEXT,
    income_historical BOOLEAN DEFAULT false,
    FOREIGN KEY (income_type_id) REFERENCES public.income_type (income_type_id),
    FOREIGN KEY (income_user_id) REFERENCES public."user" (user_id)
);

-- Table: public.expense_category
CREATE TABLE IF NOT EXISTS public.expense_category
(
    expense_category_id SERIAL PRIMARY KEY,
    expense_category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table: public.expense_type
CREATE TABLE IF NOT EXISTS public.expense_type
(
    expense_type_id SERIAL PRIMARY KEY,
    expense_type_name VARCHAR(100) NOT NULL UNIQUE,
    expense_category_id INTEGER,
    expense_essential BOOLEAN NOT NULL, -- True for essentials, false for non-essentials
    FOREIGN KEY (expense_category_id) REFERENCES public.expense_category (expense_category_id)
);

-- Table: public.expense
CREATE TABLE IF NOT EXISTS public.expense
(
    expense_id SERIAL PRIMARY KEY,
    expense_user_id INTEGER NOT NULL,
    expense_type_id INTEGER,
    expense_amount NUMERIC(15,2) NOT NULL,
    expense_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expense_note TEXT,
    expense_historical BOOLEAN DEFAULT false,
    FOREIGN KEY (expense_type_id) REFERENCES public.expense_type (expense_type_id),
    FOREIGN KEY (expense_user_id) REFERENCES public.user(user_id)
);

-- Table: public.due_type
CREATE TABLE IF NOT EXISTS public.due_type
(
    due_type_id SERIAL PRIMARY KEY,
    due_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: public.due_status
CREATE TABLE IF NOT EXISTS public.due_status
(
    due_status_id SERIAL PRIMARY KEY,
    due_status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: public.due
CREATE TABLE IF NOT EXISTS public.due
(
    due_id SERIAL PRIMARY KEY,
    due_user_id INTEGER NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_details TEXT,
    due_amount NUMERIC(15,2) NOT NULL,
    due_type_id INTEGER NOT NULL,
    due_status_id INTEGER NOT NULL,
    FOREIGN KEY (due_status_id) REFERENCES public.due_status (due_status_id),
    FOREIGN KEY (due_type_id) REFERENCES public.due_type (due_type_id),
    FOREIGN KEY (due_user_id) REFERENCES public."user" (user_id)
);

-- Table: public.account
CREATE TABLE IF NOT EXISTS public.account
(
    account_id VARCHAR(255) PRIMARY KEY,
    account_user_id INTEGER NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    account_expires_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    account_language VARCHAR(50),
    account_timezone VARCHAR(50),
    FOREIGN KEY (account_user_id) REFERENCES public."user" (user_id)
);

-- Table: public.income_forecast
CREATE TABLE IF NOT EXISTS public.income_forecast
(
    income_forecast_id SERIAL PRIMARY KEY,
    income_forecast_user_id INTEGER NOT NULL,
    income_forecast_income_type_id INTEGER NOT NULL,
    income_forecast_date TIMESTAMP WITH TIME ZONE NOT NULL,
    income_forecast_amount NUMERIC(15,2) NOT NULL,
    income_forecast_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (income_forecast_user_id) REFERENCES public."user" (user_id),
    FOREIGN KEY (income_forecast_income_type_id) REFERENCES public.income_type (income_type_id)
);

-- Table: public.expense_forecast
CREATE TABLE IF NOT EXISTS public.expense_forecast
(
    expense_forecast_id SERIAL PRIMARY KEY,
    expense_forecast_user_id INTEGER NOT NULL,
    expense_forecast_expense_type_id INTEGER NOT NULL,
    expense_forecast_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expense_forecast_amount NUMERIC(15,2) NOT NULL,
    expense_forecast_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_forecast_user_id) REFERENCES public."user" (user_id),
    FOREIGN KEY (expense_forecast_expense_type_id) REFERENCES public.expense_type (expense_type_id)
);

-- Table: public.saving_forecast
CREATE TABLE IF NOT EXISTS public.saving_forecast
(
    saving_forecast_id SERIAL PRIMARY KEY,
    saving_forecast_user_id INTEGER NOT NULL,
    saving_forecast_saving_type_id INTEGER NOT NULL,
    saving_forecast_date TIMESTAMP WITH TIME ZONE NOT NULL,
    saving_forecast_amount NUMERIC(15,2) NOT NULL,
    saving_forecast_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (saving_forecast_user_id) REFERENCES public."user" (user_id),
    FOREIGN KEY (saving_forecast_saving_type_id) REFERENCES public.saving_type (saving_type_id)
);

-- Table: public.budget_type
CREATE TABLE IF NOT EXISTS public.budget_type
(
    budget_type_id SERIAL PRIMARY KEY,
    budget_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: public.budget
CREATE TABLE IF NOT EXISTS public.budget
(
    budget_id SERIAL PRIMARY KEY,
    budget_user_id INTEGER NOT NULL,
    budget_budget_type_id INTEGER NOT NULL,
    budget_related_id INTEGER, -- This references either income_type_id, saving_type_id, or expense_type_id
    budget_amount NUMERIC(15,2) NOT NULL,
    budget_date TIMESTAMP WITH TIME ZONE NOT NULL,
    budget_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_user_id) REFERENCES public."user" (user_id),
    FOREIGN KEY (budget_budget_type_id) REFERENCES public.budget_type (budget_type_id)
);

-- Table: public.income_budget
CREATE TABLE IF NOT EXISTS public.income_budget
(
    income_budget_income_type_id INTEGER NOT NULL,
    income_budget_total_amount NUMERIC(15,2) NOT NULL,
    income_budget_last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (income_budget_income_type_id),
    FOREIGN KEY (income_budget_income_type_id) REFERENCES public.income_type (income_type_id)
);

-- Table: public.saving_budget
CREATE TABLE IF NOT EXISTS public.saving_budget
(
    saving_budget_saving_type_id INTEGER NOT NULL,
    saving_budget_total_amount NUMERIC(15,2) NOT NULL,
    saving_budget_last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (saving_budget_saving_type_id),
    FOREIGN KEY (saving_budget_saving_type_id) REFERENCES public.saving_type (saving_type_id)
);

-- Table: public.expense_budget
CREATE TABLE IF NOT EXISTS public.expense_budget
(
    expense_budget_expense_type_id INTEGER NOT NULL,
    expense_budget_total_amount NUMERIC(15,2) NOT NULL,
    expense_budget_last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (expense_budget_expense_type_id),
    FOREIGN KEY (expense_budget_expense_type_id) REFERENCES public.expense_type (expense_type_id)
);

-- Table: public.remaining
CREATE TABLE IF NOT EXISTS public.remaining
(
    remaining_id SERIAL PRIMARY KEY,
    remaining_user_id INTEGER NOT NULL,
    remaining_budget_type_id INTEGER NOT NULL,
    remaining_related_id INTEGER, -- This references either income_type_id, saving_type_id, or expense_type_id
    remaining_amount NUMERIC(15,2) NOT NULL,
    remaining_date TIMESTAMP WITH TIME ZONE NOT NULL,
    remaining_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remaining_user_id) REFERENCES public."user" (user_id),
    FOREIGN KEY (remaining_budget_type_id) REFERENCES public.budget_type (budget_type_id),
    FOREIGN KEY (remaining_related_id) REFERENCES public.budget_type (budget_type_id)
);
